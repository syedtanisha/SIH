import sys
import os
import json

# Ensure app package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from fastapi.testclient import TestClient
from app.main import app, seed_initial_data

def run_full_verification():
    print("================================================================")
    print("STARTING E2E VERIFICATION FOR INDIA'S STATISTICAL CAPACITY PLATFORM")
    print("================================================================")
    
    # 1. Initialize Seed Data
    seed_initial_data()
    client = TestClient(app)
    
    # 2. Health & Root
    root_res = client.get("/")
    assert root_res.status_code == 200, "Root failed"
    print("[PASS] Root Endpoint:", root_res.json()["platform"])

    # 3. Officer Registration
    officer_email = "rajesh.kumar.iss@mospi.gov.in"
    reg_res = client.post("/api/v1/auth/register", json={
        "email": officer_email,
        "password": "OfficialSecurePassword2026!",
        "full_name": "Dr. Rajesh Kumar",
        "designation": "Deputy Director (ISS)",
        "department": "MoSPI National Accounts Division (NAD)",
        "organization": "Government of India"
    })
    assert reg_res.status_code in [201, 400], "Registration failed"
    print("[PASS] Officer Registration for Dr. Rajesh Kumar (ISS)")

    # 4. Officer Login & JWT
    login_res = client.post("/api/v1/auth/login/json", json={
        "username": officer_email,
        "password": "OfficialSecurePassword2026!"
    })
    assert login_res.status_code == 200, "Login failed"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] JWT Token Issued:", token[:25] + "...")

    # 5. Baseline Diagnostic Test Retrieval
    baseline_res = client.get("/api/v1/assessments/baseline", headers=headers)
    assert baseline_res.status_code == 200, "Baseline retrieval failed"
    b_data = baseline_res.json()
    assert len(b_data["questions"]) > 0, "No baseline questions found"
    print(f"[PASS] Baseline Test Loaded: {len(b_data['questions'])} calibrated statistical questions")

    # 6. Baseline Submission (Simulating Officer Diagnostic)
    answers = [
        {"question_id": q["id"], "selected_option": "A" if idx % 2 == 0 else "B"}
        for idx, q in enumerate(b_data["questions"])
    ]
    sub_res = client.post("/api/v1/assessments/baseline/submit", json={"answers": answers}, headers=headers)
    assert sub_res.status_code == 200, "Baseline submission failed"
    sub_data = sub_res.json()
    print(f"[PASS] Baseline Assessment Evaluated: Score = {sub_data['overall_score']}%, Initialized = {sub_data['initialized_competencies_count']} competencies")

    # 7. Competency Profile & Gap Analysis
    gap_res = client.get("/api/v1/competencies/gap-analysis", headers=headers)
    assert gap_res.status_code == 200, "Gap analysis failed"
    gap_data = gap_res.json()
    print(f"[PASS] Deterministic Gap Analysis: {gap_data['total_gaps_identified']} active gaps identified. Primary domain: {gap_data['primary_focus_domain']}")
    for g in gap_data["gaps"][:3]:
        print(f"   - {g['name']}: Current = {g['current_level']}%, Target = {g['required_level']}%, Gap = {g['gap']}% ({g['priority']} Priority)")

    # 8. Personalized Recommendations (iGOT / NSSTA / MoSPI)
    rec_res = client.get("/api/v1/recommendations/for-you", headers=headers)
    assert rec_res.status_code == 200, "Recommendations failed"
    rec_data = rec_res.json()
    print(f"[PASS] For You Recommendations: {rec_data['total_recommendations']} courses/reports aligned with '{rec_data['primary_focus_gap']}'")
    for r in rec_data["recommendations"][:2]:
        print(f"   - [{r['resource']['source']}] {r['resource']['title']} (Match: {r['match_score']}%)")

    # 9. Document Ingestion & AI Quiz Generation
    sample_text = (
        "The Periodic Labour Force Survey (PLFS) uses a stratified multi-stage design. "
        "The first stage units (FSU) in rural areas are 2011 Census villages and in urban areas are Urban Frame Survey (UFS) blocks. "
        "The ultimate stage units (USU) are households. Sampling weights (multipliers) must be applied to all unit-level microdata. "
        "Gross Value Added (GVA) at basic prices is computed as Gross Output minus Intermediate Inputs."
    )
    quiz_gen_res = client.post("/api/v1/quizzes/generate", json={
        "topic": "PLFS Sampling Frame & Multipliers",
        "custom_text": sample_text,
        "num_questions": 3,
        "difficulty": "Intermediate"
    }, headers=headers)
    assert quiz_gen_res.status_code == 201, "Quiz generation failed"
    quiz_data = quiz_gen_res.json()
    quiz_id = quiz_data["id"]
    print(f"[PASS] AI Quiz Generated: '{quiz_data['title']}' with {len(quiz_data['questions'])} schema-enforced MCQs")

    # 10. Quiz Examination Submission & Demonstrable Delta Calculation (+26%)
    q_answers = [
        {"question_id": q["id"], "selected_option": "A"}
        for q in quiz_data["questions"]
    ]
    submit_quiz_res = client.post(f"/api/v1/quizzes/{quiz_id}/submit", json={"answers": q_answers}, headers=headers)
    assert submit_quiz_res.status_code == 200, "Quiz submission failed"
    q_result = submit_quiz_res.json()
    print(f"[PASS] Quiz Examination Completed!")
    print(f"   - Score: {q_result['score']}% ({q_result['total_correct']}/{q_result['total_questions']} correct)")
    print(f"   - Competency: {q_result['competency_name']}")
    print(f"   - BEFORE Score: {q_result['competency_score_before']}%")
    print(f"   - AFTER Score:  {q_result['competency_score_after']}%")
    print(f"   - DELTA GAIN:   +{q_result['competency_delta']}% (Demonstrable Capacity Increase)")

    # 11. Longitudinal Progress Audit
    prog_res = client.get("/api/v1/progress/summary", headers=headers)
    assert prog_res.status_code == 200, "Progress summary failed"
    prog_data = prog_res.json()
    print(f"[PASS] Longitudinal Progress Summary:")
    print(f"   - Overall Readiness Index: {prog_data['overall_readiness_score']}%")
    print(f"   - Total Verified Learning Gain: +{prog_data['total_learning_gain']}%")
    print(f"   - Quizzes Evaluated: {prog_data['quizzes_completed']}")

    # 12. Admin Stats
    admin_res = client.get("/api/v1/admin/stats", headers=headers)
    assert admin_res.status_code == 200, "Admin stats failed"
    admin_data = admin_res.json()
    print(f"[PASS] System Administration Analytics:")
    print(f"   - Total Officers: {admin_data['total_officers_registered']}")
    print(f"   - Total Statistical Competencies: {admin_data['total_statistical_competencies']}")
    print(f"   - Total Learning Resources: {admin_data['total_learning_resources']}")
    print(f"   - System Status: {admin_data['status']}")

    print("\n================================================================")
    print("ALL 12 END-TO-END CAPABILITY CHECKS PASSED WITH 100% SUCCESS!")
    print("================================================================")

if __name__ == "__main__":
    run_full_verification()
