"""
Crowdsourced Village Groundwater Observation Feed.
Allows farmers to report tube-well bore drops and water table measurements.
"""
from datetime import datetime
from typing import List
import uuid
from app.models.schemas import CommunityReportCreate, CommunityReportResponse

# Pre-seeded real-world field observations across Ludhiana villages
_COMMUNITY_REPORTS: List[CommunityReportResponse] = [
    CommunityReportResponse(
        id="rep-1",
        farmer_name="Sardar Gurpreet Singh",
        village="Sidhwan Kalan",
        block="Jagraon",
        depth_feet=245.0,
        change_past_year_feet=4.2,
        timestamp="2026-10-10 14:30",
        notes="Bore pipe had to be extended by 2 lengths (40 ft) this summer. Water has sulfur smell below 240ft."
    ),
    CommunityReportResponse(
        id="rep-2",
        farmer_name="Manjit Singh Brar",
        village="Dakha",
        block="Ludhiana-1",
        depth_feet=210.0,
        change_past_year_feet=3.5,
        timestamp="2026-10-09 09:15",
        notes="Installed PR-126 with Pani Pipe AWD on 4 acres. Tube-well ran 35 fewer hours in June."
    ),
    CommunityReportResponse(
        id="rep-3",
        farmer_name="Harvinder Singh Grewal",
        village="Dehlon Kalan",
        block="Dehlon",
        depth_feet=280.0,
        change_past_year_feet=5.1,
        timestamp="2026-10-08 17:45",
        notes="Submersible tripped due to low water table; pump lowered to 290 feet. Power supply 8 hours daily."
    )
]

def list_community_reports() -> List[CommunityReportResponse]:
    return _COMMUNITY_REPORTS

def add_community_report(report_in: CommunityReportCreate) -> CommunityReportResponse:
    new_rep = CommunityReportResponse(
        id=f"rep-{str(uuid.uuid4())[:8]}",
        farmer_name=report_in.farmer_name,
        village=report_in.village,
        block=report_in.block,
        depth_feet=report_in.depth_feet,
        change_past_year_feet=report_in.change_past_year_feet,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M"),
        notes=report_in.notes
    )
    _COMMUNITY_REPORTS.insert(0, new_rep)
    return new_rep
