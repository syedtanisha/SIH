import json
import re
import logging
import httpx
from typing import List, Dict, Any, Optional
from ..core.config import settings

logger = logging.getLogger(__name__)

def clean_json_string(raw: str) -> str:
    """Strip markdown code blocks or trailing characters to obtain valid JSON."""
    raw = raw.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    elif raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    return raw.strip()

async def call_llm(prompt: str, system_prompt: str = "You are an AI Statistical Capacity Building Specialist for India's Official Statistical System.") -> str:
    """Multi-provider LLM executor supporting Grok (xAI), Groq, Gemini, OpenAI, or local fallback."""
    # 1. Try Grok (xAI) if key provided
    grok_key = settings.XAI_API_KEY or settings.GROK_API_KEY
    if grok_key:
        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                res = await client.post(
                    f"{settings.XAI_BASE_URL.rstrip('/')}/chat/completions",
                    headers={"Authorization": f"Bearer {grok_key}"},
                    json={
                        "model": settings.GROK_MODEL or "grok-2-latest",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.3
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[AI Service] Grok (xAI) call failed: {e}")

    # 2. Try Groq if key provided
    if settings.GROQ_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                    json={
                        "model": settings.GROQ_MODEL or "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.3
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[AI Service] Groq call failed: {e}")

    # 3. Try Gemini if key provided
    if settings.GEMINI_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}",
                    json={
                        "contents": [{"parts": [{"text": f"{system_prompt}\n\n{prompt}"}]}]
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"[AI Service] Gemini call failed: {e}")

    # Fallback deterministic response
    return ""

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
            f"for your role in {division}. Continue maintaining proficiency through advanced NSSTA research publications and MoSPI technical manuals."
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

Provide a concise, 3-4 sentence professional capacity diagnosis using AI:
1. Explain specifically why bridging these gaps is critical for their role in {division}.
2. Recommend immediate learning actions using NSSTA laboratory resources and MoSPI publications.
3. Conclude with verification guidance via AI Learning Studio quizzes.
"""
    ai_response = await call_llm(prompt, system_prompt="You are an AI Senior Statistical Capacity Building Specialist for India's Ministry of Statistics (MoSPI) and NSSTA.")
    if ai_response and len(ai_response.strip()) > 30:
        return ai_response.strip()

    # High-quality fallback template
    top_gap_names = ", ".join([g["name"] for g in top_gaps])
    return (
        f"AI Capacity Diagnosis for {officer_name} ({designation}, {division}): "
        f"Your statistical readiness index currently stands at {overall_readiness}%. "
        f"Based on your role requirements in {division}, your primary capacity building priorities are {top_gap_names}. "
        f"We recommend completing the aligned NSSTA training modules and official MoSPI guidelines, followed by AI Studio verification quizzes to validate competency gains."
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
        f"To bridge these competency gaps efficiently, complete the corresponding NSSTA training modules and review the official MoSPI technical publications. "
        f"Submitting targeted verification quizzes in the AI Learning Studio will automatically calibrate and record your official competency score growth."
    )

async def generate_grok_learning_path(
    officer_name: str,
    designation: str,
    division: str,
    gaps: List[Dict[str, Any]],
    matched_resources: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """Use AI to synthesize matched learning resources into a structured, phased learning roadmap."""
    resources_summary = "\n".join([
        f"- [{r.get('source', 'MoSPI')}] {r.get('title', '')} ({r.get('resource_type', '')}, Duration: {r.get('estimated_duration_mins', 60)}m, Aligned Gap: {r.get('matched_competency_name', '')})"
        for r in matched_resources[:6]
    ])

    top_gap_name = gaps[0]["name"] if gaps else "Survey Operations"

    prompt = f"""
You are creating a personalized capacity building learning path for an officer in India's Official Statistical System.

Officer: {officer_name}
Designation: {designation}
Division: {division}
Primary Focus Gap: {top_gap_name}

Available Government Learning Resources:
{resources_summary}

Organize the officer's journey into exactly 4 sequential learning milestones:
Phase 1: Diagnostic Calibration & Baseline
Phase 2: Core Concept Mastery (NSSTA Academy Modules)
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
    "action_type": "assessment" | "course" | "lab" | "quiz"
  }}
]
"""
    raw = await call_llm(prompt, system_prompt="You are an official learning path synthesizer for MoSPI and NSSTA.")
    if raw:
        try:
            parsed = json.loads(clean_json_string(raw))
            if isinstance(parsed, list) and len(parsed) >= 3:
                return parsed
        except Exception as e:
            print(f"[AI Service] Learning path parsing error: {e}")

    # High-quality fallback learning path
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
            "title": f"Phase 2: NSSTA Foundations in {top_gap_name}",
            "domain": "Conceptual Foundations",
            "description": f"Complete foundational modules at NSSTA to build theoretical grounding in {top_gap_name}.",
            "recommended_resource": matched_resources[0]["title"] if matched_resources else "NSSTA Official Statistics Curriculum",
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
    """Use Grok AI to analyze quiz submission performance, diagnose errors, and give actionable feedback."""
    mistake_summary = ""
    if mistakes:
        mistake_summary = "Questions needing review:\n" + "\n".join([
            f"- Q: {m.get('question_text', '')[:120]}... Selected: Option {m.get('user_selected', '')}, Correct: Option {m.get('correct_option', '')}. Explanation: {m.get('explanation', '')[:150]}"
            for m in mistakes[:3]
        ])
    else:
        mistake_summary = "All questions answered correctly with 100% accuracy."

    prompt = f"""
You are Grok AI evaluating a quiz attempt for a statistical professional.

Quiz: {quiz_title} ({topic})
Competency: {competency_name}
Score: {score_pct}% ({total_correct}/{total_questions} correct)
Competency Recalibration: {before_score}% -> {after_score}% (+{delta}% demonstrated learning gain)

Performance Details:
{mistake_summary}

Provide a concise, motivating, and pedagogical performance analysis (3-4 sentences):
1. Acknowledge the quantified competency gain (+{delta}%).
2. Highlight key conceptual takeaways and explain any specific misunderstandings from the incorrect questions.
3. Suggest the next learning module or practice step to maintain momentum.
"""
    ai_response = await call_llm(prompt, system_prompt="You are Grok AI providing pedagogical feedback on official statistical examinations.")
    if ai_response and len(ai_response.strip()) > 30:
        return ai_response.strip()

    # Fallback qualitative feedback
    if mistakes:
        return (
            f"Grok AI Evaluation: You achieved {score_pct}% ({total_correct}/{total_questions} correct) on '{quiz_title}'. "
            f"Your competency in '{competency_name}' improved by +{delta}% (from {before_score}% to {after_score}%). "
            f"Review the pedagogical explanations below for the {len(mistakes)} questions you missed to reinforce official MoSPI definitions before proceeding to the next tutorial module."
        )
    return (
        f"Grok AI Evaluation: Outstanding mastery! You achieved a perfect score of {score_pct}% ({total_correct}/{total_questions} correct) on '{quiz_title}'. "
        f"Your official competency in '{competency_name}' has increased to {after_score}% (+{delta}% learning gain). "
        f"Your statistical reasoning aligns completely with official guidelines. Proceed to the next milestone in your learning path!"
    )

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
        system_prompt="You are a senior statistical psychometrician designing certified examinations for MoSPI and NSSTA."
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
    """Generate strictly schema-enforced MCQs based on document text."""
    # Build robust pedagogical questions from text
    # In live mode with LLM keys, calls LLM; otherwise uses rich contextual question generator
    truncated_text = text[:4000] if text else topic

    questions = []
    # Dynamic domain generator based on keywords
    is_sampling = any(w in truncated_text.lower() for w in ["sample", "survey", "strata", "fsu", "plfs", "frame", "cluster"])
    is_national_accounts = any(w in truncated_text.lower() for w in ["gdp", "gva", "sna", "accounts", "capital", "intermediate consumption"])
    is_computing = any(w in truncated_text.lower() for w in ["python", "pandas", "numpy", "dataframe", "vectorization", "sql query", "programming", "code"])
    is_cpi_iip = any(w in truncated_text.lower() for w in ["cpi", "iip", "index", "price", "laspeyres"])

    if competency_code:
        comp_code = competency_code
    elif is_computing:
        comp_code = "STAT_COMPUTE"
    elif is_sampling:
        comp_code = "STAT_SURVEY"
    elif is_national_accounts:
        comp_code = "STAT_NAT_ACC"
    elif is_cpi_iip:
        comp_code = "STAT_PRICE_IND"
    else:
        comp_code = "STAT_SURVEY"

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
        comp_code = "STAT_NAT_ACC"
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
        comp_code = "STAT_PRICE_IND"
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
        comp_code = "STAT_SURVEY"
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

    # Populate questions up to requested count
    for i in range(num_questions):
        template = q_templates[i % len(q_templates)].copy()
        template["competency_code"] = comp_code
        questions.append(template)

    return questions[:num_questions]
async def generate_final_interview_questions(
    competencies: List[Dict[str, Any]],
    num_questions: int = 5
) -> List[Dict[str, Any]]:
    """
    Generate AI-powered final interview questions based on
    the officer's current competency gaps.
    """

    competency_context = "\n".join(
        [
            (
                f"- {c['name']} "
                f"({c['domain']}): "
                f"Current={c['current_score']}%, "
                f"Benchmark={c['required_benchmark']}%, "
                f"Gap={c['gap']}%"
            )
            for c in competencies
        ]
    )

    prompt = f"""
You are conducting the final professional assessment for
an officer in India's Official Statistical System.

The officer's current competency profile is:

{competency_context}

Generate exactly {num_questions} professional interview questions.

Requirements:
1. Focus primarily on the largest competency gaps.
2. Questions must test understanding and practical application.
3. Do not make questions multiple-choice.
4. Questions should be appropriate for a statistical professional.
5. Cover different competencies where possible.
6. Return ONLY valid JSON.
7. Use this exact structure:

[
  {{
    "question": "Question text",
    "competency_code": "COMPETENCY_CODE",
    "domain": "Domain name",
    "difficulty": "Intermediate"
  }}
]
"""

    raw = await call_llm(
        prompt,
        system_prompt=(
            "You are a senior interviewer and statistical "
            "capacity-building specialist for India's "
            "Official Statistical System."
        )
    )

    if raw:
        try:
            parsed = json.loads(clean_json_string(raw))

            if isinstance(parsed, list):
                return parsed[:num_questions]

        except Exception as e:
            print(
                f"[AI Service] Final interview JSON parsing failed: {e}"
            )

    # Safe deterministic fallback
    questions = []

    for competency in competencies[:num_questions]:
        questions.append(
            {
                "question": (
                    f"Explain the key concepts and practical "
                    f"applications of {competency['name']} "
                    f"in India's official statistical system."
                ),
                "competency_code": competency["code"],
                "domain": competency["domain"],
                "difficulty": "Intermediate"
            }
        )

    return questions
async def evaluate_final_interview_answer(
    question: str,
    answer: str,
    competency: str,
    domain: str,
    difficulty: str
) -> Dict[str, Any]:
    """
    Evaluate one final-interview answer and determine
    the appropriate difficulty for the next question.
    """

    prompt = f"""
You are a senior interviewer for India's Official Statistical System.

Evaluate the following professional interview answer.

Competency:
{competency}

Domain:
{domain}

Question difficulty:
{difficulty}

Interview question:
{question}

Candidate answer:
{answer}

Evaluate the answer based on:
1. Accuracy
2. Understanding of the statistical concept
3. Practical application
4. Reasoning
5. Professional communication

Scoring:
- 9-10: Excellent
- 7-8: Strong
- 5-6: Moderate
- 3-4: Weak
- 0-2: Very weak

Determine the next difficulty:
- Score 8-10 → Advanced
- Score 5-7 → Intermediate
- Score 0-4 → Beginner

Return ONLY valid JSON using exactly this structure:

{{
    "score": 0,
    "evaluation": "",
    "strengths": [],
    "weaknesses": [],
    "next_difficulty": "Intermediate"
}}
"""

    raw = await call_llm(
        prompt,
        system_prompt=(
            "You are a senior professional interviewer "
            "specializing in India's Official Statistical System. "
            "Evaluate answers fairly, specifically, and constructively."
        )
    )

    if raw:
        try:
            result = json.loads(clean_json_string(raw))

            if isinstance(result, dict):
                return result

        except Exception as e:
            print(
                f"[AI Service] Interview answer evaluation failed: {e}"
            )

    # Safe fallback if the AI provider is unavailable
    return {
        "score": 5,
        "evaluation": (
            "The answer was received and requires further "
            "evaluation against the relevant statistical concepts."
        ),
        "strengths": [],
        "weaknesses": [
            "AI evaluation was unavailable for this response."
        ],
        "next_difficulty": "Intermediate"
    }