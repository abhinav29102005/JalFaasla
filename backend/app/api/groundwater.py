from fastapi import APIRouter
from typing import List, Dict, Any
from app.models.schemas import GroundwaterBlockInfo
from app.services.groundwater_service import get_all_blocks, get_block_info

router = APIRouter(prefix="/groundwater", tags=["Groundwater"])

@router.get("/blocks", response_model=List[GroundwaterBlockInfo])
def list_blocks():
    """
    Returns CGWB & PWRDA groundwater status for all recorded Punjab blocks.
    """
    return get_all_blocks()

@router.get("/block/{block_name}", response_model=GroundwaterBlockInfo)
def get_single_block(block_name: str):
    """
    Returns groundwater extraction details for a single block.
    """
    return get_block_info(block_name)
