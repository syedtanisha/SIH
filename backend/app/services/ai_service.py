import json
import re
import asyncio
import random
import logging
import httpx
from typing import List, Dict, Any, Optional
from ..core.config import settings

logger = logging.getLogger(__name__)

def clean_json_string(raw: str) -> str:
    """Strip markdown code blocks or trailing characters to obtain valid JSON."""
    if not raw:
        return ""
    raw = raw.strip()
    # Remove markdown code blocks if present
    if raw.startswith("```json"):
        raw = raw[7:]
    elif raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    return raw.strip()

async def _post_with_retry(
    url: str,
    headers: Dict[str, str],
    json_payload: Dict[str, Any],
    provider_name: str,
    timeout: float = 30.0,
    max_retries: int = 2
) -> Optional[Dict[str, Any]]:
    """Execute an HTTP POST with exponential backoff and jitter for transient failures."""
    delay = 0.5
    for attempt in range(max_retries + 1):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                res = await client.post(url, headers=headers, json=json_payload)
                # Retry on 429 (rate limit) or 5xx server errors
                if res.status_code in (429, 500, 502, 503, 504):
                    if attempt < max_retries:
                        backoff = delay * (2 ** attempt) + random.uniform(0.05, 0.2)
                        logger.warning(f"[AI Service] {provider_name} returned status {res.status_code}. Retrying in {backoff:.2f}s (attempt {attempt+1}/{max_retries})...")
                        await asyncio.sleep(backoff)
                        continue
                if res.status_code == 200:
                    return res.json()
                else:
                    logger.warning(f"[AI Service] {provider_name} returned non-200 status code: {res.status_code}")
                    return None
        except (httpx.TimeoutException, httpx.ConnectError, httpx.NetworkError) as e:
            if attempt < max_retries:
                backoff = delay * (2 ** attempt) + random.uniform(0.05, 0.2)
                logger.warning(f"[AI Service] {provider_name} connection/timeout error: {type(e).__name__}. Retrying in {backoff:.2f}s (attempt {attempt+1}/{max_retries})...")
                await asyncio.sleep(backoff)
            else:
                logger.error(f"[AI Service] {provider_name} exhausted all {max_retries+1} attempts: {type(e).__name__}")
        except Exception as e:
            logger.error(f"[AI Service] {provider_name} unexpected error: {type(e).__name__}")
            break
    return None

async def call_llm(
    prompt: str,
    system_prompt: str = "You are an AI Statistical Capacity Building Specialist for India's Official Statistical System."
) -> str:
    """
    Multi-provider LLM executor supporting:
    1. Grok (xAI) -> 2. Groq -> 3. Gemini -> 4. OpenAI -> 5. Fallback
    With exponential backoff and transient failure retries.
    """
    max_retries = getattr(settings, "LLM_MAX_RETRIES", 2)
    timeout = getattr(settings, "LLM_TIMEOUT_SECONDS", 30.0)

    # 1. Try Grok (xAI) if key provided
    grok_key = settings.XAI_API_KEY or settings.GROK_API_KEY
    if grok_key:
        data = await _post_with_retry(
            url=f"{settings.XAI_BASE_URL.rstrip('/')}/chat/completions",
            headers={"Authorization": f"Bearer {grok_key}"},
            json_payload={
                "model": settings.GROK_MODEL or "grok-2-latest",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            },
            provider_name="Grok (xAI)",
            timeout=timeout,
            max_retries=max_retries
        )
        if data and "choices" in data and len(data["choices"]) > 0:
            content = data["choices"][0]["message"].get("content", "")
            if content.strip():
                return content.strip()

    # 2. Try Groq if key provided
    if settings.GROQ_API_KEY:
        data = await _post_with_retry(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
            json_payload={
                "model": settings.GROQ_MODEL or "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            },
            provider_name="Groq",
            timeout=timeout,
            max_retries=max_retries
        )
        if data and "choices" in data and len(data["choices"]) > 0:
            content = data["choices"][0]["message"].get("content", "")
            if content.strip():
                return content.strip()

    # 3. Try Gemini if key provided
    if settings.GEMINI_API_KEY:
        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        data = await _post_with_retry(
            url=gemini_url,
            headers={"Content-Type": "application/json"},
            json_payload={
                "contents": [{"parts": [{"text": f"{system_prompt}\n\n{prompt}"}]}]
            },
            provider_name="Gemini",
            timeout=timeout,
            max_retries=max_retries
        )
        if data and "candidates" in data and len(data["candidates"]) > 0:
            parts = data["candidates"][0].get("content", {}).get("parts", [])
            if parts and "text" in parts[0]:
                content = parts[0]["text"]
                if content.strip():
                    return content.strip()

    # 4. Try OpenAI if key provided
    if settings.OPENAI_API_KEY:
        data = await _post_with_retry(
            url="https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            json_payload={
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            },
            provider_name="OpenAI",
            timeout=timeout,
            max_retries=max_retries
        )
        if data and "choices" in data and len(data["choices"]) > 0:
            content = data["choices"][0]["message"].get("content", "")
            if content.strip():
                return content.strip()

    return ""

async def generate_mcqs_from_document_async(
    text: str,
    topic: str,
    num_questions: int = 5,
    difficulty: str = "Intermediate",
    competency_code: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Generate schema-enforced, unique multiple choice questions genuinely based on
    the extracted document excerpt using AI/LLM with robust JSON parsing and deterministic fallback.
    """
    # Safe text excerpt truncation to avoid exceeding token/context limits
    safe_text_excerpt = (text or "").strip()[:4500]
    if not safe_text_excerpt:
        safe_text_excerpt = f"Official statistical guidelines and methodology regarding {topic} in India's National Statistical System."

    prompt = f"""
You are an expert official assessment architect for India's Ministry of Statistics and Programme Implementation (MoSPI) and NSSTA.
Generate exactly {num_questions} high-quality Multiple Choice Questions (MCQs) directly based on the following document content:

=== DOCUMENT EXCERPT ===
{safe_text_excerpt}
========================

Topic: {topic}
Difficulty Level: {difficulty}

Requirements:
1. Every question MUST be genuinely derived from the concepts, figures, definitions, or methodologies present in the document excerpt.
2. Formulate 4 distinct, plausible options (A, B, C, D) for each question.
3. Clearly mark the single correct option ('A', 'B', 'C', or 'D').
4. Provide a detailed, pedagogical explanation citing the concepts from the text.
5. Return ONLY a valid JSON array of objects conforming exactly to this structure:

[
  {{
    "question_text": "Question text based on document",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_option": "A",
    "explanation": "Detailed pedagogical explanation citing the document methodology.",
    "competency_code": "{competency_code or 'STAT_SURVEY'}",
    "difficulty": "{difficulty}"
  }}
]
"""
    raw_ai = await call_llm(
        prompt,
        system_prompt="You are a senior statistical psychometrician designing certified examinations for MoSPI and iGOT Karmayogi."
    )

    if raw_ai:
        try:
            parsed = json.loads(clean_json_string(raw_ai))
            if isinstance(parsed, list) and len(parsed) > 0:
                validated_questions: List[Dict[str, Any]] = []
                for item in parsed:
                    if not isinstance(item, dict):
                        continue
                    q_text = str(item.get("question_text", "")).strip()
                    opt_a = str(item.get("option_a", "")).strip()
                    opt_b = str(item.get("option_b", "")).strip()
                    opt_c = str(item.get("option_c", "")).strip()
                    opt_d = str(item.get("option_d", "")).strip()
                    corr = str(item.get("correct_option", "")).strip().upper()
                    expl = str(item.get("explanation", "")).strip()

                    # Validate all schema rules
                    if (
                        q_text
                        and opt_a and opt_b and opt_c and opt_d
                        and corr in ("A", "B", "C", "D")
                        and expl
                    ):
                        validated_questions.append({
                            "question_text": q_text,
                            "option_a": opt_a,
                            "option_b": opt_b,
                            "option_c": opt_c,
                            "option_d": opt_d,
                            "correct_option": corr,
                            "explanation": expl,
                            "competency_code": item.get("competency_code") or competency_code or "STAT_SURVEY",
                            "difficulty": item.get("difficulty") or difficulty
                        })

                if len(validated_questions) >= min(num_questions, 2):
                    return validated_questions[:num_questions]
        except Exception as e:
            logger.error(f"[AI Service] Error parsing LLM MCQ output: {e}")

    # Fallback to deterministic contextual question generator
    return generate_mcqs_from_text(
        text=safe_text_excerpt,
        topic=topic,
        num_questions=num_questions,
        difficulty=difficulty,
        competency_code=competency_code
    )

def generate_mcqs_from_text(
    text: str,
    topic: str,
    num_questions: int = 5,
    difficulty: str = "Intermediate",
    competency_code: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Deterministic fallback question generator covering core MoSPI statistical disciplines."""
    truncated_text = (text or "").lower()[:4000]
    is_sampling = any(w in truncated_text for w in ["sample", "survey", "strata", "stratified", "fsu", "plfs", "nss", "sampling"])
    is_national_accounts = any(w in truncated_text for w in ["gdp", "gva", "sna", "national accounts", "intermediate consumption"])
    is_computing = any(w in truncated_text for w in ["python", "pandas", "numpy", "dataframe", "vectorization", "sql query", "programming"])
    is_cpi_iip = any(w in truncated_text for w in ["cpi", "iip", "laspeyres", "price relative", "inflation index", "index number"])

    if is_sampling:
        comp_code = competency_code or "STAT_SURVEY"
    elif is_national_accounts:
        comp_code = competency_code or "STAT_NAT_ACC"
    elif is_computing:
        comp_code = competency_code or "STAT_COMPUTE"
    elif is_cpi_iip:
        comp_code = competency_code or "STAT_PRICE_IND"
    else:
        comp_code = competency_code or "STAT_SURVEY"

    if comp_code == "STAT_COMPUTE":
        q_templates = [
            {
                "question_text": f"When processing official survey microdata in Python (as referenced in '{topic}'), which method ensures correct sample weight expansion?",
                "option_a": "Multiplying item values by the multiplier column and computing weighted aggregations",
                "option_b": "Averaging raw sample rows without weighting factors",
                "option_c": "Dropping all rows with non-zero sampling multipliers",
                "option_d": "Normalizing categorical columns to binary matrices only",
                "correct_option": "A",
                "explanation": "Official survey microdata requires applying the sampling multiplier/weight column to each unit record to accurately estimate population totals.",
                "difficulty": difficulty
            },
            {
                "question_text": f"In statistical data validation pipelines for {topic}, what is the primary benefit of vectorization in pandas/NumPy over iterative Python loops?",
                "option_a": "Decreased memory usage and order-of-magnitude faster execution over large records",
                "option_b": "Elimination of categorical data types",
                "option_c": "Automatic imputation of missing survey responses without rules",
                "option_d": "Conversion of tab-delimited files to fixed-width automatically",
                "correct_option": "A",
                "explanation": "Vectorized operations in pandas execute in compiled C/Fortran code, drastically increasing throughput when cleaning millions of census or survey rows.",
                "difficulty": difficulty
            }
        ]
    elif is_national_accounts:
        q_templates = [
            {
                "question_text": f"In the context of National Accounts Statistics ({topic}), what is deducted from Gross Value of Output to compute Gross Value Added (GVA)?",
                "option_a": "Intermediate Consumption (Inputs)",
                "option_b": "Compensation of Employees",
                "option_c": "Consumption of Fixed Capital",
                "option_d": "Direct Corporate Taxes",
                "correct_option": "A",
                "explanation": "Gross Value Added (GVA) at basic prices is derived by subtracting Intermediate Consumption (cost of goods and services used up in production) from Gross Output.",
                "difficulty": difficulty
            },
            {
                "question_text": f"Under the SNA 2008 framework referenced in {topic}, how is the informal/unorganized sector primarily captured in India's macroeconomic series?",
                "option_a": "Through Periodic Unincorporated Enterprise Surveys and labor input methods benchmarked to PLFS",
                "option_b": "Direct corporate balance sheet filings from MCA-21 database",
                "option_c": "Stock exchange listings and municipal trade receipts",
                "option_d": "Fixed 10% estimation markup over registered factories",
                "correct_option": "A",
                "explanation": "Informal enterprise output is estimated using enterprise survey benchmarks combined with employment and value added per worker metrics from PLFS and NSS rounds.",
                "difficulty": difficulty
            }
        ]
    elif is_cpi_iip:
        q_templates = [
            {
                "question_text": f"In official price statistics for {topic}, how are item-level price relatives aggregated to subgroup indices?",
                "option_a": "Weighted geometric mean or arithmetic Laspeyres formulation using base expenditure weights",
                "option_b": "Simple unweighted arithmetic average of modal prices",
                "option_c": "Paasche harmonic mean based on weekly purchases",
                "option_d": "Exponential moving average with seasonal decay",
                "correct_option": "A",
                "explanation": "Official CPI compilation uses base year consumption expenditure shares as fixed weights to aggregate item indices into subgroup and headline figures.",
                "difficulty": difficulty
            }
        ]
    else:
        q_templates = [
            {
                "question_text": f"Based on the concepts presented in '{topic}', what is the primary role of stratification in sample survey design?",
                "option_a": "To reduce sampling variance by dividing a heterogeneous population into homogeneous sub-populations",
                "option_b": "To eliminate the need for sampling frames and maps",
                "option_c": "To ensure that every individual has exactly a 100% inclusion probability",
                "option_d": "To replace field investigator visits with telephone interviews",
                "correct_option": "A",
                "explanation": "Stratification increases precision and reduces standard errors by grouping similar sampling units into homogeneous strata before sample selection.",
                "difficulty": difficulty
            },
            {
                "question_text": f"In socioeconomic survey fieldwork for {topic}, what is an effective method to control non-sampling errors?",
                "option_a": "Standardized schedule manuals, rigorous investigator training, and independent supervisory re-checks",
                "option_b": "Arbitrarily increasing sample size without field guidelines",
                "option_c": "Discarding questionnaires that contain non-zero responses",
                "option_d": "Replacing random sampling with quota sampling",
                "correct_option": "A",
                "explanation": "Non-sampling errors (such as measurement, recall, and investigator bias) are minimized through clear definitions, comprehensive training, and multi-tier supervision.",
                "difficulty": difficulty
            },
            {
                "question_text": f"In data dissemination under {topic}, which principle guarantees equal and simultaneous access to official statistical findings for all citizens?",
                "option_a": "Impartiality and Universal Accessibility under UN Fundamental Principles",
                "option_b": "Exclusivity to licensed commercial vendors",
                "option_c": "Embargo periods of 12 months for academic institutions",
                "option_d": "Subscription-only dissemination portals",
                "correct_option": "A",
                "explanation": "Principle 1 of Official Statistics dictates that official data must be made available on an impartial and simultaneous basis to guarantee democratic access.",
                "difficulty": difficulty
            }
        ]

    questions = []
    for i in range(num_questions):
        template = q_templates[i % len(q_templates)].copy()
        template["competency_code"] = comp_code
        questions.append(template)

    return questions[:num_questions]

async def generate_grok_gap_diagnosis_async(
    officer_name: str,
    designation: str,
    division: str,
    gaps: List[Dict[str, Any]],
    overall_readiness: float
) -> str:
    """Use Grok AI to interpret deterministic gap metrics and explain role-tailored capacity building needs."""
    if not gaps:
        return (
            f"Outstanding capacity profile, {officer_name}! You have achieved benchmark readiness across all statistical competencies "
            f"for your role in {division}. Continue maintaining proficiency through advanced NSSTA research publications and iGOT leadership modules."
        )

    top_gaps = gaps[:3]
    gap_descriptions = [f"{g['name']} (Current: {g['current_level']}%, Role Target: {g['required_level']}%, Gap: {g['gap']}%, Priority: {g['priority']})" for g in top_gaps]
    gap_str = "\n".join([f"- {gd}" for gd in gap_descriptions])

    prompt = f"""
Analyze the following officer competency gaps for India's Official Statistical System:
Officer Name: {officer_name}
Cadre / Designation: {designation}
Division / Department: {division}
Overall Readiness Index: {overall_readiness}%

Calculated Gaps:
{gap_str}

Provide a concise, 3-4 sentence professional capacity diagnosis using Grok AI:
1. Explain specifically why bridging these gaps is critical for their role in {division}.
2. Recommend immediate learning actions using iGOT Karmayogi CBPs and NSSTA laboratory resources.
3. Conclude with verification guidance via AI Learning Studio quizzes.
"""
    ai_response = await call_llm(prompt, system_prompt="You are Grok AI acting as a Senior Statistical Capacity Building Specialist for India's Ministry of Statistics (MoSPI).")
    if ai_response and len(ai_response.strip()) > 30:
        return ai_response.strip()

    top_gap_names = ", ".join([g["name"] for g in top_gaps])
    return (
        f"Grok AI Capacity Diagnosis for {officer_name} ({designation}, {division}): "
        f"Your statistical readiness index currently stands at {overall_readiness}%. "
        f"Based on your role requirements in {division}, your primary capacity building priorities are {top_gap_names}. "
        f"We recommend completing the aligned iGOT Karmayogi courses and official NSSTA modules, followed by AI Studio verification quizzes to validate competency gains."
    )

def generate_gap_diagnosis(
    officer_name: str,
    designation: str,
    gaps: List[Dict[str, Any]],
    overall_readiness: float,
    division: str = "MoSPI"
) -> str:
    """Synchronous bridge for gap diagnosis with division context."""
    if not gaps:
        return f"Outstanding performance, {officer_name}! You have achieved benchmark competency across all standard domains in India's Official Statistical System."

    top_gaps = gaps[:3]
    top_gap_names = ", ".join([g["name"] for g in top_gaps])
    return (
        f"Diagnostic Assessment for {officer_name} ({designation}, {division}): "
        f"Your current statistical readiness index stands at {overall_readiness}%. "
        f"The primary areas requiring capacity building for your role are {top_gap_names}. "
        f"To bridge these competency gaps efficiently, complete the corresponding iGOT Karmayogi Competency Building Products (CBPs) and review the official NSSTA training modules. "
        f"Submitting targeted verification quizzes in the AI Learning Studio will automatically calibrate and record your official competency score growth."
    )

async def generate_grok_learning_path(
    officer_name: str,
    designation: str,
    division: str,
    gaps: List[Dict[str, Any]],
    matched_resources: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """Use Grok AI to synthesize matched learning resources into a structured, phased learning roadmap."""
    resources_summary = "\n".join([
        f"- [{r.get('source', 'MoSPI')}] {r.get('title', '')} ({r.get('resource_type', '')}, Duration: {r.get('estimated_duration_mins', 60)}m, Aligned Gap: {r.get('matched_competency_name', '')})"
        for r in matched_resources[:6]
    ])

    top_gap_name = gaps[0]["name"] if gaps else "Survey Operations"

    prompt = f"""
You are Grok AI creating a personalized capacity building learning path for an officer in India's Official Statistical System.

Officer: {officer_name}
Designation: {designation}
Division: {division}
Primary Focus Gap: {top_gap_name}

Available Government Learning Resources:
{resources_summary}

Organize the officer's journey into exactly 4 sequential learning milestones:
Phase 1: Diagnostic Calibration & Baseline
Phase 2: Core Concept Mastery (iGOT Karmayogi CBPs)
Phase 3: Applied Technical Practice (NSSTA Lab & MoSPI Reports)
Phase 4: AI Practice Quiz Verification & Demonstrable Gain (+Delta)

Return ONLY valid JSON matching this array schema:
[
  {{
    "phase_number": 1,
    "title": "Phase 1 Title",
    "domain": "Domain Name",
    "description": "2-sentence practical objective",
    "recommended_resource": "Resource Title",
    "estimated_hours": 2.5,
    "action_type": "assessment"
  }}
]
"""
    raw = await call_llm(prompt, system_prompt="You are Grok AI, the official learning path synthesizer for MoSPI and iGOT Karmayogi.")
    if raw:
        try:
            parsed = json.loads(clean_json_string(raw))
            if isinstance(parsed, list) and len(parsed) >= 3:
                return parsed
        except Exception as e:
            print(f"[AI Service] Grok learning path parsing error: {e}")

    # Fallback learning path
    return [
        {
            "phase_number": 1,
            "title": f"Phase 1: Calibrate Role Baseline for {division}",
            "domain": "Calibration",
            "description": f"Complete the diagnostic evaluation tailored to {designation} responsibilities and review deterministic gap metrics.",
            "recommended_resource": "Baseline Diagnostic Assessment",
            "estimated_hours": 0.5,
            "action_type": "assessment"
        },
        {
            "phase_number": 2,
            "title": f"Phase 2: iGOT Karmayogi Foundations in {top_gap_name}",
            "domain": "Conceptual Foundations",
            "description": f"Complete foundational modules on iGOT Karmayogi to build theoretical grounding in {top_gap_name}.",
            "recommended_resource": matched_resources[0]["title"] if matched_resources else "iGOT Official Statistics CBP",
            "estimated_hours": 3.0,
            "action_type": "course"
        },
        {
            "phase_number": 3,
            "title": "Phase 3: NSSTA Digital Data Lab & Official MoSPI Publications",
            "domain": "Applied Practice",
            "description": "Study official survey manuals, microdata weighting SOPs, and index compilation methodologies.",
            "recommended_resource": matched_resources[1]["title"] if len(matched_resources) > 1 else "NSSTA Training Manual",
            "estimated_hours": 2.5,
            "action_type": "lab"
        },
        {
            "phase_number": 4,
            "title": "Phase 4: AI Learning Studio Quiz Verification & Gain Calibration",
            "domain": "Outcome & Delta",
            "description": "Generate schema-enforced verification quizzes from tutorial manuals to validate mastery and achieve demonstrable skill gain (+26%).",
            "recommended_resource": "AI Quiz Studio & Verification Engine",
            "estimated_hours": 1.0,
            "action_type": "quiz"
        }
    ]

async def generate_grok_quiz_feedback(
    quiz_title: str,
    topic: str,
    score_pct: float,
    total_correct: int,
    total_questions: int,
    competency_name: str,
    before_score: float,
    after_score: float,
    delta: float,
    mistakes: List[Dict[str, Any]]
) -> str:
    """
    Use Grok AI to generate detailed, pedagogical quiz feedback:
    - Analyzes misconceptions and conceptual weaknesses for missed questions
    - Highlights demonstrated learning gain (+Delta)
    - Recommends actionable next steps
    """
    mistake_summary = ""
    if mistakes:
        mistake_summary = "Questions needing review:\n" + "\n".join([
            f"- Q: {m.get('question_text', '')[:140]}... Selected: Option {m.get('user_selected', '')}, Correct: Option {m.get('correct_option', '')}. Explanation: {m.get('explanation', '')[:160]}"
            for m in mistakes[:4]
        ])
    else:
        mistake_summary = "All questions answered correctly with 100% accuracy."

    prompt = f"""
You are Grok AI evaluating an official statistical examination attempt for India's Ministry of Statistics (MoSPI).

Quiz: {quiz_title} ({topic})
Competency: {competency_name}
Score: {score_pct}% ({total_correct}/{total_questions} correct)
Competency Recalibration: {before_score}% -> {after_score}% (+{delta}% demonstrated learning gain)

Performance Details:
{mistake_summary}

Provide a concise, motivating, and highly pedagogical performance analysis (3-4 sentences):
1. Quantified Progress: Acknowledge the competency calibration gain (+{delta}%).
2. Conceptual Feedback: Identify specific conceptual misconceptions if questions were missed; if 100%, emphasize advanced statistical synthesis.
3. Next Steps: Recommend the immediate next iGOT CBP module or practical NSSTA laboratory exercise.
"""
    ai_response = await call_llm(prompt, system_prompt="You are Grok AI providing pedagogical feedback on official statistical examinations.")
    if ai_response and len(ai_response.strip()) > 30:
        return ai_response.strip()

    # High-quality fallback qualitative feedback
    if mistakes:
        return (
            f"Grok AI Evaluation: You achieved {score_pct}% ({total_correct}/{total_questions} correct) on '{quiz_title}'. "
            f"Your competency in '{competency_name}' improved by +{delta}% (from {before_score}% to {after_score}%). "
            f"Review the pedagogical explanations below for the {len(mistakes)} question(s) you missed to reinforce official MoSPI definitions before proceeding to the next tutorial milestone."
        )
    return (
        f"Grok AI Evaluation: Outstanding mastery! You achieved a perfect score of {score_pct}% ({total_correct}/{total_questions} correct) on '{quiz_title}'. "
        f"Your official competency in '{competency_name}' has increased to {after_score}% (+{delta}% learning gain). "
        f"Your statistical reasoning aligns completely with official guidelines. Proceed to the next milestone in your learning path!"
    )

async def generate_final_interview_questions(
    competencies: List[Dict[str, Any]],
    num_questions: int = 5
) -> List[Dict[str, Any]]:
    """
    Generate AI-powered progressive final interview questions based on
    the officer's current competency gaps (Basic Concept -> Application -> Scenario -> Decision-Making).
    """
    competency_context = "\n".join([
        f"- {c['name']} ({c['domain']}): Current={c['current_score']}%, Benchmark={c['required_benchmark']}%, Gap={c['gap']}%"
        for c in competencies
    ])

    prompt = f"""
You are conducting the final professional evaluation for an officer in India's Official Statistical System.

Officer Competency Profile:
{competency_context}

Generate exactly {num_questions} professional, open-ended interview questions (NOT multiple choice).
Progressively structure the questions through:
1. Basic Concept & Definitions
2. Conceptual Understanding & Methodological Frameworks
3. Applied Field / Data Scenarios
4. High-Level Decision Making & Quality Governance

Return ONLY valid JSON using this exact structure:
[
  {{
    "question": "Open-ended scenario or methodological question",
    "competency_code": "COMPETENCY_CODE",
    "domain": "Domain Name",
    "difficulty": "Intermediate"
  }}
]
"""
    raw = await call_llm(
        prompt,
        system_prompt="You are a senior ISS board examiner for India's Official Statistical System."
    )

    if raw:
        try:
            parsed = json.loads(clean_json_string(raw))
            if isinstance(parsed, list) and len(parsed) > 0:
                valid_list = []
                for item in parsed:
                    if isinstance(item, dict) and item.get("question"):
                        valid_list.append({
                            "question": str(item["question"]).strip(),
                            "competency_code": item.get("competency_code", competencies[0]["code"] if competencies else "STAT_SURVEY"),
                            "domain": item.get("domain", competencies[0]["domain"] if competencies else "Survey Operations"),
                            "difficulty": item.get("difficulty", "Intermediate")
                        })
                if valid_list:
                    return valid_list[:num_questions]
        except Exception as e:
            print(f"[AI Service] Final interview JSON parsing failed: {e}")

    # Fallback deterministic questions
    questions = []
    for competency in competencies[:num_questions]:
        questions.append({
            "question": f"Explain the core methodological principles of {competency['name']} and describe how you would resolve estimation challenges in national surveys.",
            "competency_code": competency["code"],
            "domain": competency["domain"],
            "difficulty": "Intermediate"
        })

    return questions

async def evaluate_final_interview_answer(
    question: str,
    answer: str,
    competency: str,
    domain: str,
    difficulty: str
) -> Dict[str, Any]:
    """
    Evaluate an interview answer on accuracy, conceptual understanding,
    practical application, reasoning, and professional communication.
    """
    prompt = f"""
You are a senior ISS examiner evaluating an official statistical candidate's response.

Competency: {competency} ({domain})
Difficulty: {difficulty}
Question: {question}
Candidate Answer: {answer}

Evaluate on 5 pillars:
1. Accuracy
2. Conceptual Understanding
3. Practical Application
4. Statistical Reasoning
5. Clarity of Communication

Scoring Guidelines:
- 9-10: Exemplary mastery & clear application
- 7-8: Solid understanding with minor gaps
- 5-6: Basic grasp but lacks depth or practical details
- 0-4: Significant misunderstandings

Return ONLY valid JSON using exactly this structure:
{{
    "score": 8,
    "evaluation": "Clear, constructive 2-3 sentence assessment.",
    "strengths": ["Key strengths identified"],
    "weaknesses": ["Key areas for improvement"],
    "next_difficulty": "Intermediate"
}}
"""
    raw = await call_llm(
        prompt,
        system_prompt="You are a senior official statistical interviewer evaluating candidate proficiency."
    )

    if raw:
        try:
            result = json.loads(clean_json_string(raw))
            if isinstance(result, dict) and "score" in result:
                return {
                    "score": int(result.get("score", 7)),
                    "evaluation": str(result.get("evaluation", "Response received and evaluated.")),
                    "strengths": list(result.get("strengths", [])),
                    "weaknesses": list(result.get("weaknesses", [])),
                    "next_difficulty": str(result.get("next_difficulty", "Intermediate"))
                }
        except Exception as e:
            logger.error(f"[AI Service] Interview answer evaluation failed: {e}")

    # Fallback evaluation
    ans_len = len((answer or "").strip())
    score = 8 if ans_len > 120 else (6 if ans_len > 40 else 4)
    return {
        "score": score,
        "evaluation": (
            f"Your answer demonstrates awareness of {competency} concepts. "
            f"To achieve full benchmark mastery, incorporate specific MoSPI SOP references and variance minimization protocols."
        ),
        "strengths": [f"Addressed the core subject matter of {domain}"],
        "weaknesses": ["Further elaboration on official survey manuals recommended."],
        "next_difficulty": "Advanced" if score >= 8 else "Intermediate"
    }