from app.services.groundwater_service import get_all_blocks, get_block_info, calculate_stress_score

def test_get_all_blocks():
    blocks = get_all_blocks()
    assert len(blocks) >= 8
    block_names = [b.block_name for b in blocks]
    assert "Jagraon" in block_names
    assert "Dehlon" in block_names

def test_jagraon_stress_calculation():
    score = calculate_stress_score(
        block_name="Jagraon",
        tubewell_depth_feet=240.0,
        current_crop="Pusa-44 (Long Duration)",
        irrigation_method="Flood (Continuous)"
    )
    assert score["score"] > 80.0
    assert score["status_label"] == "CRITICAL DANGER"
    assert score["color_code"] == "red"
