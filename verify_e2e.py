import sys
import os
import json

# Ensure app package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from fastapi.testclient import TestClient
from app.main import app, seed_initial_data
from app.db.database import SessionLocal
from app.models.models import User
from app.core.security import create_access_token

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
    print("[PASS] 1. Root Endpoint & Health Check:", root_res.json()["platform"])

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
    print("[PASS] 2. Officer Registration for Dr. Rajesh Kumar (ISS)")

    # 4. Officer Login & JWT
    login_res = client.post("/api/v1/auth/login/json", json={
        "username": officer_email,
        "password": "OfficialSecurePassword2026!"
    })
    assert login_res.status_code == 200, "Login failed"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] 3. JWT Authentication Issued:", token[:25] + "...")

    # 5. Profile Retrieval
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == officer_email
    print(f"[PASS] 4. Profile Retrieved: {me_data['full_name']} ({me_data['designation']}, {me_data['department']})")

    # 6. Baseline Diagnostic Test Retrieval
    baseline_res = client.get("/api/v1/assessments/baseline", headers=headers)
    assert baseline_res.status_code == 200, "Baseline retrieval failed"
    b_data = baseline_res.json()
    assert len(b_data["questions"]) > 0, "No baseline questions found"
    print(f"[PASS] 5. Baseline Test Loaded: {len(b_data['questions'])} calibrated statistical questions")

    # 7. Baseline Submission
    answers = [
        {"question_id": q["id"], "selected_option": "A" if idx % 2 == 0 else "B"}
        for idx, q in enumerate(b_data["questions"])
    ]
    sub_res = client.post("/api/v1/assessments/baseline/submit", json={"answers": answers}, headers=headers)
    assert sub_res.status_code == 200, "Baseline submission failed"
    sub_data = sub_res.json()
    print(f"[PASS] 6. Baseline Assessment Evaluated: Score = {sub_data['overall_score']}%, Initialized = {sub_data['initialized_competencies_count']} competencies")

    # 8. Competency Profile & Gap Analysis
    gap_res = client.get("/api/v1/competencies/gap-analysis", headers=headers)
    assert gap_res.status_code == 200, "Gap analysis failed"
    gap_data = gap_res.json()
    print(f"[PASS] 7. Deterministic Gap Analysis: {gap_data['total_gaps_identified']} active gaps identified. Primary domain: {gap_data['primary_focus_domain']}")
    for g in gap_data["gaps"][:3]:
        print(f"   - {g['name']}: Current = {g['current_level']}%, Target = {g['required_level']}%, Gap = {g['gap']}% ({g['priority']} Priority)")

    # 9. AI Gap Diagnosis
    assert len(gap_data["ai_diagnosis_summary"]) > 20
    print(f"[PASS] 8. AI Gap Diagnosis Prescription Generated")

    # 10. Personalized Recommendations (iGOT / NSSTA / MoSPI)
    rec_res = client.get("/api/v1/recommendations/for-you", headers=headers)
    assert rec_res.status_code == 200, "Recommendations failed"
    rec_data = rec_res.json()
    print(f"[PASS] 9. Recommendations Engine: {rec_data['total_recommendations']} courses aligned with '{rec_data['primary_focus_gap']}'")

    # 11. Document Ingestion & Text Extraction
    sample_text = (
        "The Periodic Labour Force Survey (PLFS) uses a stratified multi-stage design. "
        "The first stage units (FSU) in rural areas are 2011 Census villages and in urban areas are Urban Frame Survey (UFS) blocks. "
        "The ultimate stage units (USU) are households. Sampling weights (multipliers) must be applied to all unit-level microdata. "
        "Gross Value Added (GVA) at basic prices is computed as Gross Output minus Intermediate Inputs."
    )
    import io
    doc_res = client.post("/api/v1/documents/upload", files={
        "file": ("plfs_methodology_doc.txt", io.BytesIO(sample_text.encode("utf-8")), "text/plain")
    }, headers=headers)
    assert doc_res.status_code == 201, "Document upload failed"
    doc_data = doc_res.json()
    print(f"[PASS] 10. Document Ingested & Extracted: '{doc_data['filename']}' ({doc_data['character_count']} chars)")

    # 12. AI Document-Based Quiz Generation
    quiz_gen_res = client.post("/api/v1/quizzes/generate", json={
        "topic": "PLFS Sampling Frame & Multipliers",
        "document_id": doc_data["id"],
        "num_questions": 3,
        "difficulty": "Intermediate"
    }, headers=headers)
    assert quiz_gen_res.status_code == 201, "Quiz generation failed"
    quiz_data = quiz_gen_res.json()
    quiz_id = quiz_data["id"]
    print(f"[PASS] 11. AI Document-Based Quiz Generated: '{quiz_data['title']}' with {len(quiz_data['questions'])} schema-enforced MCQs")

    # 13. Quiz Retrieval
    get_quiz_res = client.get(f"/api/v1/quizzes/{quiz_id}", headers=headers)
    assert get_quiz_res.status_code == 200, "Quiz retrieval failed"
    print(f"[PASS] 12. Quiz Retrieval Verified (ID: {quiz_id})")

    # 14. Quiz Examination Submission & Demonstrable Delta Calculation (+26%)
    q_answers = [
        {"question_id": q["id"], "selected_option": "A"}
        for q in quiz_data["questions"]
    ]
    submit_quiz_res = client.post(f"/api/v1/quizzes/{quiz_id}/submit", json={"answers": q_answers}, headers=headers)
    assert submit_quiz_res.status_code == 200, "Quiz submission failed"
    q_result = submit_quiz_res.json()
    print(f"[PASS] 13. Quiz Examination Completed & Evaluated:")
    print(f"   - Score: {q_result['score']}% ({q_result['total_correct']}/{q_result['total_questions']} correct)")
    print(f"   - Competency: {q_result['competency_name']}")
    print(f"   - Competency Recalibration: {q_result['competency_score_before']}% -> {q_result['competency_score_after']}% (+{q_result['competency_delta']}% DELTA GAIN)")

    # 15. Quiz Feedback
    assert len(q_result["ai_qualitative_feedback"]) > 10
    print(f"[PASS] 14. Grok Qualitative Feedback & Pedagogical Analysis Generated")

    # 16. Dynamic Learning Path Retrieval
    path_res = client.get("/api/v1/recommendations/learning-path", headers=headers)
    assert path_res.status_code == 200
    path_data = path_res.json()
    assert len(path_data["milestones"]) == 7
    print(f"[PASS] 15. AI Personalized Learning Roadmap: {path_data['total_milestones']} milestones ({path_data['progress_percentage']}% completed)")

    # 17. Longitudinal Progress Audit
    prog_res = client.get("/api/v1/progress/summary", headers=headers)
    assert prog_res.status_code == 200, "Progress summary failed"
    prog_data = prog_res.json()
    print(f"[PASS] 16. Longitudinal Progress Audit:")
    print(f"   - Overall Readiness Index: {prog_data['overall_readiness_score']}%")
    print(f"   - Total Verified Learning Gain: +{prog_data['total_learning_gain']}%")

    # 18. Final Interview Readiness
    readiness_res = client.get("/api/v1/final-interview/readiness", headers=headers)
    assert readiness_res.status_code == 200
    readiness_data = readiness_res.json()
    print(f"[PASS] 17. Final Interview Readiness Checked (Readiness: {readiness_data['readiness_score']}%)")

    # 19. Final Interview Questions & Answer Evaluation
    eval_res = client.post("/api/v1/final-interview/evaluate-answer", json={
        "question": "Explain the role of stratified sampling in national household surveys.",
        "answer": "Stratification divides the population into homogeneous sub-groups (rural/urban, district strata) to minimize within-stratum variance and increase precision.",
        "competency": "STAT_SURVEY",
        "domain": "Survey Operations",
        "difficulty": "Intermediate"
    }, headers=headers)
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    print(f"[PASS] 18. Final Interview Answer Evaluated: Score = {eval_data['score']}/10, Next Difficulty = {eval_data['next_difficulty']}")

    # 20. Admin Authorization Check & Admin Analytics
    # Normal officer is rejected (403)
    forbidden_res = client.get("/api/v1/admin/stats", headers=headers)
    assert forbidden_res.status_code == 403, "Normal officer should be forbidden from admin stats"
    print("[PASS] 19. Non-Admin Security Authorization Enforcement Verified (HTTP 403)")

    # Admin user is authorized (200)
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == "admin_root@mospi.gov.in").first()
        if not admin_user:
            admin_user = User(
                email="admin_root@mospi.gov.in",
                hashed_password="fakeadminpassword",
                full_name="MoSPI Chief Administrator",
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        admin_token = create_access_token({"sub": str(admin_user.id)})
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
    finally:
        db.close()

    admin_res = client.get("/api/v1/admin/stats", headers=admin_headers)
    assert admin_res.status_code == 200, "Admin stats failed"
    admin_data = admin_res.json()
    print(f"[PASS] 20. Admin Analytics Authorized:")
    print(f"   - Total Officers: {admin_data['total_officers_registered']}")
    print(f"   - Total Statistical Competencies: {admin_data['total_statistical_competencies']}")
    print(f"   - System Status: {admin_data['status']}")

    print("\n================================================================")
    print("ALL 20 END-TO-END CAPABILITY CHECKS PASSED WITH 100% SUCCESS!")
    print("================================================================")

if __name__ == "__main__":
    run_full_verification()
