# AI-Enabled Learning Platform for India's Official Statistical System

> **MoSPI • NSSTA • iGOT Karmayogi Capacity Building Ecosystem**  
> Developed for officers and professionals across the Ministry of Statistics and Programme Implementation (MoSPI), National Statistical Systems Training Academy (NSSTA), State Directorates of Economics & Statistics (DES), and Indian Statistical Service (ISS / SSS) cadres.

---

## 🌟 Executive Highlights & Core Value Proposition

1. **Deterministic & AI Competency Gap Engine**:
   - Evaluates proficiency across **9 standardized statistical domains**.
   - Calculates mathematical gaps: $\text{Required Benchmark} - \text{Current Level} = \text{Competency Gap}$.
   - Priority sorts gaps ($\ge 30\%$ High, $15\text{-}30\%$ Medium, $<15\%$ Low) and generates AI diagnostic prescriptions.

2. **Multi-Source Government Learning Hub**:
   - **iGOT Karmayogi**: Mapped directly to the FRAC (Roles, Activities, Competencies) taxonomy with Competency Building Products (CBPs).
   - **NSSTA Greater Noida**: Official induction curriculum and Digital Data Lab modules.
   - **MoSPI & eSankhyiki**: National Accounts Statistics, PLFS Annual Reports, ASI Summaries, CPI/IIP Technical Manuals, and Macro Indicators APIs.

3. **AI Learning Studio (Document Ingestion & MCQ Generation)**:
   - Ingests **PDF, DOCX, PPTX, and TXT** documents (e.g. survey manuals, methodology notes).
   - Generates schema-enforced, pedagogical multiple-choice questions with full explanations.

4. **Demonstrable Learning Delta Tracking (Closed-Loop Cycle)**:
   - Evaluates quizzes deterministically and recalculates official competency scores.
   - Demonstrates before vs. after growth (e.g., *Python for Statistics: 42% → 68%, +26% Gain*).

---

## 🏗 System Architecture

```
                               ┌───────────────────────────────────────────────┐
                               │           React 18 + Vite Frontend            │
                               │      (Tailwind CSS, Recharts, Lucide)         │
                               └───────────────────────┬───────────────────────┘
                                                       │ REST API / JWT
                                                       ▼
                               ┌───────────────────────────────────────────────┐
                               │             FastAPI Backend Engine            │
                               │        (Pydantic v2, SQLAlchemy 2.0)          │
                               └───────┬───────────────┬───────────────┬───────┘
                                       │               │               │
                     ┌─────────────────┴─┐   ┌─────────┴─────────┐   ┌─┴────────────────────────┐
                     ▼                   ▼   ▼                   ▼   ▼                          ▼
              [Relational DB]         [AI Engine]          [Document Parser]        [Govt Resource Hub]
           Users, Competencies,      Multi-Provider       PDF, DOCX, PPTX, TXT      iGOT Karmayogi (FRAC),
           Assessments, Quizzes,     (Groq / Gemini /     Text Extraction &         NSSTA Greater Noida,
           Progress History          OpenAI / Fallback)   Chunking                  MoSPI & eSankhyiki
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Python**: 3.11+ (Python 3.14 compatible)
* **Node.js**: v18+ / v20+ / v24+

---

### Step 1: Start Backend
```powershell
cd mospi-statlearn\backend
# Activate virtual environment
.\.venv\Scripts\Activate.ps1
# Start FastAPI server with Uvicorn
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
* **API Documentation**: Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (Swagger UI)
* **API Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### Step 2: Start Frontend
```powershell
cd mospi-statlearn\frontend
# Start Vite development server
npm run dev
```
* **Web Portal**: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Officer Account
* **Email**: `test_iss_officer@gov.in`
* **Password**: `SecurePassword123!`
* **Name**: Dr. Rajesh Kumar (Deputy Director, National Accounts Division)

*(Or register any new officer cadre profile directly via `/register`)*

---

## 📊 Core Statistical Disciplines Mapped
1. `STAT_SURVEY`: Survey Methodology & Sampling Design (NSSO methods, stratification, weighting)
2. `STAT_NAT_ACC`: National Accounts Statistics & Macro Aggregates (SNA 2008, GDP, GVA)
3. `STAT_COMPUTE`: Statistical Computing & Data Science (Python, R, STATA, Microdata processing)
4. `STAT_PRICE_IND`: Price Statistics & Index Numbers (CPI, IIP, Laspeyres formulas)
5. `STAT_LABOUR`: Labour & Demographic Statistics (PLFS, UPSS, CWS, LFPR)
6. `STAT_DATA_GOV`: Data Management & eSankhyiki Governance (FAIR metadata standards)
7. `STAT_QUALITY`: Statistical Quality Assurance & Audit (UN Fundamental Principles, NQAF)
8. `STAT_VIZ_COMM`: Data Visualization & Official Reporting (SDG National Indicators)
9. `STAT_IND_AGRI`: Industrial & Enterprise Statistics (Annual Survey of Industries)

---

## 🧪 Testing & Verification
Run the backend test suite:
```powershell
cd mospi-statlearn\backend
.\.venv\Scripts\python.exe -m pytest app/tests
```

Run the complete 12-step End-to-End verification script:
```powershell
cd mospi-statlearn
backend\.venv\Scripts\python.exe verify_e2e.py
```
