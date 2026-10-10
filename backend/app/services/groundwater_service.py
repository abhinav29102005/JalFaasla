"""
Central Ground Water Board (CGWB) & PWRDA Ground Water Dynamics of Punjab.
Provides block-level extraction stages, water table trends, and risk index calculations.
"""
from typing import Dict, List, Optional
from app.models.schemas import GroundwaterBlockInfo

PUNJAB_BLOCK_DATABASE: Dict[str, GroundwaterBlockInfo] = {
    "Jagraon": GroundwaterBlockInfo(
        block_name="Jagraon",
        district="Ludhiana",
        stage_of_extraction_pct=248.0,
        category="Over-Exploited (Critical)",
        avg_water_table_depth_m=28.4,
        annual_water_drop_cm=74.0,
        safe_recharge_threshold_m=10.0,
        description="Severe groundwater stress. Over-draft driven by deep submersible tube-wells and high water-demanding paddy varieties."
    ),
    "Ludhiana-1": GroundwaterBlockInfo(
        block_name="Ludhiana-1",
        district="Ludhiana",
        stage_of_extraction_pct=220.0,
        category="Over-Exploited",
        avg_water_table_depth_m=25.2,
        annual_water_drop_cm=68.0,
        safe_recharge_threshold_m=10.0,
        description="Industrial and extensive agricultural abstraction exceeding natural aquifer recharge by 2.2x."
    ),
    "Ludhiana-2": GroundwaterBlockInfo(
        block_name="Ludhiana-2",
        district="Ludhiana",
        stage_of_extraction_pct=215.0,
        category="Over-Exploited",
        avg_water_table_depth_m=24.1,
        annual_water_drop_cm=65.0,
        safe_recharge_threshold_m=10.0,
        description="Critical aquifer drawdowns across suburban farm clusters."
    ),
    "Dehlon": GroundwaterBlockInfo(
        block_name="Dehlon",
        district="Ludhiana",
        stage_of_extraction_pct=262.0,
        category="Over-Exploited (Hyper-Critical)",
        avg_water_table_depth_m=31.8,
        annual_water_drop_cm=82.0,
        safe_recharge_threshold_m=10.0,
        description="Highest extraction intensity in southern Ludhiana belt. Pumping from deep second aquifer."
    ),
    "Sidhwan Bet": GroundwaterBlockInfo(
        block_name="Sidhwan Bet",
        district="Ludhiana",
        stage_of_extraction_pct=184.0,
        category="Over-Exploited",
        avg_water_table_depth_m=21.6,
        annual_water_drop_cm=52.0,
        safe_recharge_threshold_m=10.0,
        description="Sutlej river flood basin provides slight recharge buffer, yet extraction remains unsustainable."
    ),
    "Raikot": GroundwaterBlockInfo(
        block_name="Raikot",
        district="Ludhiana",
        stage_of_extraction_pct=236.0,
        category="Over-Exploited",
        avg_water_table_depth_m=27.9,
        annual_water_drop_cm=71.0,
        safe_recharge_threshold_m=10.0,
        description="Heavy submersible tubewell clustering with deep bores exceeding 250 feet."
    ),
    "Khanna": GroundwaterBlockInfo(
        block_name="Khanna",
        district="Ludhiana",
        stage_of_extraction_pct=204.0,
        category="Over-Exploited",
        avg_water_table_depth_m=23.8,
        annual_water_drop_cm=58.0,
        safe_recharge_threshold_m=10.0,
        description="Grain market belt with continuous paddy-wheat mono-cropping."
    ),
    "Samrala": GroundwaterBlockInfo(
        block_name="Samrala",
        district="Ludhiana",
        stage_of_extraction_pct=195.0,
        category="Over-Exploited",
        avg_water_table_depth_m=22.4,
        annual_water_drop_cm=54.0,
        safe_recharge_threshold_m=10.0,
        description="Over-exploited status. PAU recommends immediate diversification to maize and summer moong."
    )
}

def get_all_blocks() -> List[GroundwaterBlockInfo]:
    return list(PUNJAB_BLOCK_DATABASE.values())

def get_block_info(block_name: str) -> GroundwaterBlockInfo:
    for name, info in PUNJAB_BLOCK_DATABASE.items():
        if name.lower() == block_name.lower():
            return info
    # Return default Jagraon if block not explicitly listed
    return PUNJAB_BLOCK_DATABASE["Jagraon"]

def calculate_stress_score(
    block_name: str,
    tubewell_depth_feet: float,
    current_crop: str,
    irrigation_method: str
) -> Dict[str, Any]:
    block = get_block_info(block_name)
    
    # Base score calculated from Extraction Stage (100% extraction = 50 score, 250% = 85 score)
    base_score = min(85.0, (block.stage_of_extraction_pct / 300.0) * 100.0)
    
    # Tubewell depth factor (deeper bores indicate depleted top aquifers)
    depth_penalty = 0.0
    if tubewell_depth_feet > 200:
        depth_penalty = min(15.0, ((tubewell_depth_feet - 200) / 100.0) * 5.0)
    
    # Practice factor
    practice_factor = 0.0
    if "Flood" in irrigation_method:
        practice_factor += 6.0
    elif "AWD" in irrigation_method:
        practice_factor -= 8.0
    elif "Drip" in irrigation_method:
        practice_factor -= 12.0
        
    if "Pusa-44" in current_crop:
        practice_factor += 5.0
    elif "PR-126" in current_crop:
        practice_factor -= 4.0
    elif "Maize" in current_crop or "Moong" in current_crop:
        practice_factor -= 10.0
        
    final_score = max(10.0, min(99.0, base_score + depth_penalty + practice_factor))
    
    if final_score >= 80:
        status_label = "CRITICAL DANGER"
        color = "red"
        advice = "Immediate transition to short-duration PR-126 or alternate crops required."
    elif final_score >= 60:
        status_label = "HIGH STRESS"
        color = "amber"
        advice = "Adopt PAU Alternate Wetting & Drying (AWD) to avoid acute aquifer depletion."
    else:
        status_label = "MODERATE"
        color = "blue"
        advice = "Maintain water-saving practices."
        
    return {
        "score": round(final_score, 1),
        "stage_of_extraction_pct": block.stage_of_extraction_pct,
        "category": block.category,
        "status_label": status_label,
        "color_code": color,
        "water_table_depth_meters": block.avg_water_table_depth_m,
        "annual_drop_cm": block.annual_water_drop_cm,
        "advice_summary": advice
    }
