from fastapi import APIRouter
from app.models.schemas import FarmerPlotInput, AdvisoryEvaluationResponse
from app.services.advisory_service import evaluate_farmer_plot

router = APIRouter(prefix="/advisor", tags=["Advisor"])

@router.post("/evaluate", response_model=AdvisoryEvaluationResponse)
def evaluate_plot(input_data: FarmerPlotInput):
    """
    Evaluates farmer's plot, calculates groundwater stress, verifies Punjab law compliance,
    and computes concrete tubewell hours and money savings.
    """
    return evaluate_farmer_plot(input_data)
