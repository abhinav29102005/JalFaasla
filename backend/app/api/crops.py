from fastapi import APIRouter
from typing import List
from app.models.schemas import CropOption
from app.services.advisory_service import get_crop_options

router = APIRouter(prefix="/crops", tags=["Crops"])

@router.get("/alternatives", response_model=List[CropOption])
def list_crops():
    """
    Returns comparative data for Punjab crops: duration, water requirement,
    tubewell pumping hours, yield, MSP, and economics.
    """
    return get_crop_options()
