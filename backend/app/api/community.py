from fastapi import APIRouter
from typing import List
from app.models.schemas import CommunityReportCreate, CommunityReportResponse
from app.services.community_service import list_community_reports, add_community_report

router = APIRouter(prefix="/community", tags=["Community"])

@router.get("/reports", response_model=List[CommunityReportResponse])
def get_reports():
    """
    Returns latest village tubewell observations reported by local farmers.
    """
    return list_community_reports()

@router.post("/reports", response_model=CommunityReportResponse)
def submit_report(report_data: CommunityReportCreate):
    """
    Submits a new crowdsourced tubewell water level measurement.
    """
    return add_community_report(report_data)
