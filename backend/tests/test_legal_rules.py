from datetime import date
from app.core.legal_rules import check_transplanting_compliance

def test_transplanting_before_june_10_is_violation():
    premature_date = date(2026, 5, 25)
    res = check_transplanting_compliance(premature_date, land_size_acres=3.0, crop_type="Paddy")
    assert res["is_compliant"] is False
    assert res["status"] == "VIOLATION_RISK"
    assert res["potential_penalty_inr"] > 0
    assert "Section 6" in res["warning"]

def test_transplanting_after_june_10_is_compliant():
    valid_date = date(2026, 6, 15)
    res = check_transplanting_compliance(valid_date, land_size_acres=4.0, crop_type="Paddy")
    assert res["is_compliant"] is True
    assert res["status"] == "COMPLIANT"
    assert res["potential_penalty_inr"] == 0.0

def test_non_paddy_crop_is_exempt():
    date_val = date(2026, 5, 1)
    res = check_transplanting_compliance(date_val, land_size_acres=5.0, crop_type="Maize")
    assert res["is_compliant"] is True
    assert res["status"] == "EXEMPT"
