from app.services.ai_service import generate_mcqs_from_text

def test_mcq_generation_schema():
    text = "The Periodic Labour Force Survey (PLFS) collects data on employment and unemployment using UPSS and CWS."
    questions = generate_mcqs_from_text(text=text, topic="PLFS Labour Methodology", num_questions=3, difficulty="Intermediate")
    
    assert len(questions) == 3
    for q in questions:
        assert "question_text" in q
        assert "option_a" in q
        assert "option_b" in q
        assert "option_c" in q
        assert "option_d" in q
        assert q["correct_option"] in ["A", "B", "C", "D"]
        assert len(q["explanation"]) > 10
