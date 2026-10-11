"""
Punjab Agricultural University (PAU) Advisory Engine & Farmer Economic Calculator.
Calculates tubewell pumping hours, diesel/electricity expense, and water savings.
"""
import os
from datetime import date, datetime
from typing import Dict, Any, List
from app.models.schemas import (
    FarmerPlotInput,
    CropOption,
    SavingsEstimate,
    AdvisoryEvaluationResponse,
    IrrigationDayAdvice
)
from app.core.legal_rules import check_transplanting_compliance
from app.services.groundwater_service import calculate_stress_score, get_block_info


CROP_DATABASE: Dict[str, CropOption] = {
    "Pusa-44": CropOption(
        crop_name="Paddy (Pusa-44)",
        variety="Pusa-44 (Long-duration 145 days)",
        growth_duration_days=145,
        water_requirement_cm=160.0,
        tubewell_hours_per_acre=410.0,
        avg_yield_quintal_per_acre=32.0,
        msp_or_market_price_per_qtl=2320.0,  # MSP for Paddy Common
        gross_revenue_per_acre=74240.0,
        pumping_cost_per_acre=16400.0,      # Fuel/maintenance & wear on deep submersible pump
        net_profit_per_acre=42840.0,
        groundwater_stress_rating="Severe Depletion (410 hrs pump load)",
        recommendation_tier="PHASE_OUT"
    ),
    "PR-126": CropOption(
        crop_name="Paddy (PR-126)",
        variety="PAU PR-126 (Short-duration 93 days)",
        growth_duration_days=93,
        water_requirement_cm=112.0,
        tubewell_hours_per_acre=270.0,
        avg_yield_quintal_per_acre=31.5,
        msp_or_market_price_per_qtl=2320.0,
        gross_revenue_per_acre=73080.0,
        pumping_cost_per_acre=10800.0,
        net_profit_per_acre=48280.0,
        groundwater_stress_rating="Reduced Drawdown (270 hrs pump load)",
        recommendation_tier="HIGHLY_RECOMMENDED"
    ),
    "Maize": CropOption(
        crop_name="Kharif Maize",
        variety="PAU Hybrid PMH-13",
        growth_duration_days=95,
        water_requirement_cm=45.0,
        tubewell_hours_per_acre=95.0,
        avg_yield_quintal_per_acre=24.0,
        msp_or_market_price_per_qtl=2225.0,
        gross_revenue_per_acre=53400.0,
        pumping_cost_per_acre=3800.0,
        net_profit_per_acre=38600.0,
        groundwater_stress_rating="Low Water Demand (95 hrs pump load)",
        recommendation_tier="DIVERSIFICATION_PRIORITY"
    ),
    "Summer Moong": CropOption(
        crop_name="Summer Pulses (Moong)",
        variety="PAU SML-668 / Star-444",
        growth_duration_days=65,
        water_requirement_cm=28.0,
        tubewell_hours_per_acre=55.0,
        avg_yield_quintal_per_acre=5.5,
        msp_or_market_price_per_qtl=8682.0,
        gross_revenue_per_acre=47751.0,
        pumping_cost_per_acre=2200.0,
        net_profit_per_acre=37551.0,
        groundwater_stress_rating="Minimal Pumping + Nitrogen Fixation",
        recommendation_tier="SOIL_RESTORATION"
    )
}

def get_crop_options() -> List[CropOption]:
    return list(CROP_DATABASE.values())

def generate_seven_day_schedule(
    soil_type: str,
    irrigation_method: str
) -> List[IrrigationDayAdvice]:
    """
    PAU Alternate Wetting and Drying (AWD) schedule for Ludhiana Agromet belt.
    Uses perforated field tube observation (Pani Pipe).
    """
    days = [
        {"day": "Day 1 (Mon)", "date": "16 June", "rain": 0.0, "temp": 39.5, "et": 7.8, "action": "NO IRRIGATION", "tube": "+4 cm standing", "reason": "Sufficient water in root zone from weekend cycle."},
        {"day": "Day 2 (Tue)", "date": "17 June", "rain": 0.0, "temp": 40.2, "et": 8.1, "action": "NO IRRIGATION", "tube": "+1 cm ground level", "reason": "Water receding normally; aeration in progress."},
        {"day": "Day 3 (Wed)", "date": "18 June", "rain": 4.0, "temp": 38.0, "et": 6.5, "action": "CHECK TUBE", "tube": "-3 cm below surface", "reason": "Pani pipe reads -3 cm. Do not turn on tubewell yet."},
        {"day": "Day 4 (Thu)", "date": "19 June", "rain": 26.0, "temp": 34.0, "et": 4.2, "action": "SKIP PUMPING (RAIN)", "tube": "+5 cm post showers", "reason": "Monsoon thunderstorm active. 26 mm rain replaces full tube-well cycle!"},
        {"day": "Day 5 (Fri)", "date": "20 June", "rain": 12.0, "temp": 33.5, "et": 4.0, "action": "NO IRRIGATION", "tube": "+4 cm standing", "reason": "Rainwater retention in field bunds (daul)."},
        {"day": "Day 6 (Sat)", "date": "21 June", "rain": 0.0, "temp": 36.0, "et": 6.0, "action": "NO IRRIGATION", "tube": "+1 cm ground level", "reason": "Natural drainage drying soil without moisture stress."},
        {"day": "Day 7 (Sun)", "date": "22 June", "rain": 0.0, "temp": 37.5, "et": 7.2, "action": "LIGHT FLOOD (5 cm)", "tube": "-5 cm threshold reached", "reason": "AWD threshold of -5 cm reached. Apply light 5 cm irrigation only."}
    ]
    
    result = []
    for d in days:
        result.append(
            IrrigationDayAdvice(
                day_name=d["day"],
                date_str=d["date"],
                forecast_rain_mm=d["rain"],
                temp_max_c=d["temp"],
                evapotranspiration_mm=d["et"],
                action=d["action"],
                awd_water_tube_reading_cm=d["tube"],
                reason=d["reason"]
            )
        )
    return result

def evaluate_farmer_plot(input_data: FarmerPlotInput) -> AdvisoryEvaluationResponse:
    # 1. Legal check
    planned_date = input_data.planned_sowing_date or date(date.today().year, 6, 5)
    legal_res = check_transplanting_compliance(
        planned_date=planned_date,
        land_size_acres=input_data.land_size_acres,
        crop_type=input_data.current_crop
    )
    
    # 2. Groundwater stress calculation
    gw_score = calculate_stress_score(
        block_name=input_data.block,
        tubewell_depth_feet=input_data.tubewell_depth_feet,
        current_crop=input_data.current_crop,
        irrigation_method=input_data.irrigation_method
    )
    
    # 3. PAU Savings Calculation
    # Baseline: Continuous flood on Pusa-44 consumes ~410 hrs/acre
    # Optimized: PR-126 + AWD consumes ~240 hrs/acre
    hours_saved_per_acre = 140.0
    total_hours_saved = round(hours_saved_per_acre * input_data.land_size_acres, 1)
    
    # Diesel savings (assuming approx 2.5 litres diesel per tubewell hour when grid power fails)
    # or electricity cost + pump motor maintenance
    cost_per_hour = 120.0  # fuel/wear estimate
    cost_saved_inr = round(total_hours_saved * cost_per_hour, 0)
    
    # Water saved: 48 cm water head per acre = 4800 m3 per acre = 480,000 litres per acre * 4.046
    water_m3_saved = round(input_data.land_size_acres * 1940.0, 0)
    acre_inches_saved = round(input_data.land_size_acres * 19.2, 1)
    
    # Net income difference (PR-126 saves pumping costs with equivalent yield)
    income_boost = round(input_data.land_size_acres * 5440.0, 0)
    
    summary_message = (
        f"On your {input_data.land_size_acres}-acre plot in {input_data.village} ({input_data.block}), "
        f"switching to PAU PR-126 and adopting Alternate Wetting-and-Drying (AWD) can save approximately "
        f"{total_hours_saved:,.0f} tube-well hours and ₹{cost_saved_inr:,.0f} in pumping costs this season, "
        f"while conserving {water_m3_saved:,.0f} m³ of Punjab groundwater."
    )
    
    savings = SavingsEstimate(
        water_saved_cubic_meters=water_m3_saved,
        water_saved_acre_inches=acre_inches_saved,
        tubewell_hours_saved=total_hours_saved,
        diesel_or_electricity_cost_saved_inr=cost_saved_inr,
        net_income_boost_inr=income_boost,
        summary_farmer_message=summary_message
    )
    
    # 4. Strategy & variety recommendation
    recommended_strategy = (
        "Adopt PAU PR-126 with Pani-Pipe (AWD) sensor tube. "
        "Delay transplanting until legal date (10 June) to leverage monsoon showers and curb May heat evaporation."
    )
    
    crop_switch = {
        "current_crop": input_data.current_crop,
        "recommended_crop": "PAU PR-126 (Short Duration)",
        "alternative_diversification": "Kharif Maize PMH-13 or Summer Moong SML-668",
        "days_saved": 52,
        "pumping_hours_difference": f"-{total_hours_saved} hours across {input_data.land_size_acres} acres"
    }
    
    practices = [
        "Transplant after June 10th to avoid 44°C pre-monsoon heat evaporation losses.",
        "Install a 40-cm perforated PVC Pani Pipe (AWD tube) inserted 20 cm into puddle soil.",
        "Re-irrigate only 2 days after standing water completely infiltrates (reading reaches -5 cm in tube).",
        "Stop irrigation 15 days before harvest to allow firm soil for mechanical combine harvesting.",
        "Adopt Laser Land Levelling to save an additional 20-25% irrigation water per cycle."
    ]
    
    schedule = generate_seven_day_schedule(
        soil_type=input_data.soil_type,
        irrigation_method=input_data.irrigation_method
    )
    
    # Persist anonymous evaluation to DynamoDB if configured
    table_name = os.environ.get("EVALUATIONS_TABLE")
    if table_name:
        try:
            import boto3
            from decimal import Decimal
            dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-southeast-2"))
            tbl = dynamodb.Table(table_name)
            tbl.put_item(
                Item={
                    "block_name": input_data.block,
                    "timestamp": datetime.now().isoformat(),
                    "land_size_acres": Decimal(str(input_data.land_size_acres)),
                    "current_crop": input_data.current_crop,
                    "hours_saved": Decimal(str(total_hours_saved)),
                    "cost_saved_inr": Decimal(str(cost_saved_inr)),
                    "water_m3_saved": Decimal(str(water_m3_saved))
                }
            )
        except Exception:
            pass

    return AdvisoryEvaluationResponse(
        plot_input=input_data,
        groundwater_status=gw_score,
        legal_compliance=legal_res,
        recommended_strategy=recommended_strategy,
        target_crop_variety="PAU PR-126",
        crop_switch_recommendation=crop_switch,
        savings_estimate=savings,
        seven_day_irrigation_schedule=schedule,
        pau_package_of_practices=practices
    )

