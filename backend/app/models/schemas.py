from datetime import date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FarmerPlotInput(BaseModel):
    district: str = Field(default="Ludhiana", description="Punjab District")
    block: str = Field(default="Jagraon", description="Tehsil/Block name")
    village: str = Field(default="Sidhwan Kalan", description="Village name")
    land_size_acres: float = Field(default=3.0, ge=0.5, le=500.0, description="Plot size in acres")
    soil_type: str = Field(default="Sandy Loam", description="Soil classification")
    current_crop: str = Field(default="Pusa-44 (Long Duration)", description="Crop variety currently chosen")
    tubewell_depth_feet: float = Field(default=220.0, ge=20.0, le=1000.0, description="Submersible tubewell bore depth in feet")
    irrigation_method: str = Field(default="Flood (Continuous)", description="Existing irrigation practice")
    planned_sowing_date: Optional[date] = Field(default=None, description="Planned transplanting date")

class GroundwaterBlockInfo(BaseModel):
    block_name: str
    district: str
    stage_of_extraction_pct: float
    category: str
    avg_water_table_depth_m: float
    annual_water_drop_cm: float
    safe_recharge_threshold_m: float
    description: str

class CropOption(BaseModel):
    crop_name: str
    variety: str
    growth_duration_days: int
    water_requirement_cm: float
    tubewell_hours_per_acre: float
    avg_yield_quintal_per_acre: float
    msp_or_market_price_per_qtl: float
    gross_revenue_per_acre: float
    pumping_cost_per_acre: float
    net_profit_per_acre: float
    groundwater_stress_rating: str
    recommendation_tier: str

class SavingsEstimate(BaseModel):
    water_saved_cubic_meters: float
    water_saved_acre_inches: float
    tubewell_hours_saved: float
    diesel_or_electricity_cost_saved_inr: float
    net_income_boost_inr: float
    summary_farmer_message: str

class IrrigationDayAdvice(BaseModel):
    day_name: str
    date_str: str
    forecast_rain_mm: float
    temp_max_c: float
    evapotranspiration_mm: float
    action: str
    awd_water_tube_reading_cm: str
    reason: str

class AdvisoryEvaluationResponse(BaseModel):
    plot_input: FarmerPlotInput
    groundwater_status: Dict[str, Any]
    legal_compliance: Dict[str, Any]
    recommended_strategy: str
    target_crop_variety: str
    crop_switch_recommendation: Dict[str, Any]
    savings_estimate: SavingsEstimate
    seven_day_irrigation_schedule: List[IrrigationDayAdvice]
    pau_package_of_practices: List[str]

class CommunityReportCreate(BaseModel):
    farmer_name: str = Field(..., min_length=2)
    village: str = Field(..., min_length=2)
    block: str = Field(..., min_length=2)
    depth_feet: float = Field(..., ge=20.0, le=1000.0)
    change_past_year_feet: float = Field(default=3.5)
    notes: Optional[str] = None

class CommunityReportResponse(BaseModel):
    id: str
    farmer_name: str
    village: str
    block: str
    depth_feet: float
    change_past_year_feet: float
    timestamp: str
    notes: Optional[str] = None
