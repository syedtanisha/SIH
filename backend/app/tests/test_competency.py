from app.services.competency_service import calculate_gap, get_priority_label

def test_gap_mathematics():
    gap = calculate_gap(required=80.0, current=45.0)
    assert gap == 35.0

    met_gap = calculate_gap(required=80.0, current=85.0)
    assert met_gap == 0.0

def test_priority_labeling():
    assert get_priority_label(35.0) == "High"
    assert get_priority_label(20.0) == "Medium"
    assert get_priority_label(5.0) == "Low"
    assert get_priority_label(0.0) == "Met"
