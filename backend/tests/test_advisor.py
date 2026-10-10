from datetime import date
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Punjab" in data["region"]

def test_evaluate_plot_concrete_savings():
    payload = {
        "district": "Ludhiana",
        "block": "Jagraon",
        "village": "Sidhwan Kalan",
        "land_size_acres": 3.0,
        "soil_type": "Sandy Loam",
        "current_crop": "Pusa-44 (Long Duration)",
        "tubewell_depth_feet": 220.0,
        "irrigation_method": "Flood (Continuous)",
        "planned_sowing_date": "2026-06-15"
    }
    res = client.post("/advisor/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    
    assert data["legal_compliance"]["is_compliant"] is True
    assert data["savings_estimate"]["tubewell_hours_saved"] == 420.0  # 140 hrs/acre * 3 acres
    assert data["savings_estimate"]["diesel_or_electricity_cost_saved_inr"] > 0
    assert "On your 3.0-acre plot in Sidhwan Kalan" in data["savings_estimate"]["summary_farmer_message"]
    assert len(data["seven_day_irrigation_schedule"]) == 7

def test_crops_alternatives():
    res = client.get("/crops/alternatives")
    assert res.status_code == 200
    crops = res.json()
    assert len(crops) >= 4
    names = [c["crop_name"] for c in crops]
    assert any("PR-126" in n for n in names)
    assert any("Pusa-44" in n for n in names)
