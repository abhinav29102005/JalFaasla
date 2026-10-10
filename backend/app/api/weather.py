from fastapi import APIRouter
from typing import Dict, Any
from app.services.weather_service import get_current_agromet_weather

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/forecast")
def get_weather_forecast(district: str = "Ludhiana") -> Dict[str, Any]:
    """
    Returns PAU Agromet Observatory weather forecast and pump skipping advisory.
    """
    return get_current_agromet_weather(district)
