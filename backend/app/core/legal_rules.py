"""
Punjab Preservation of Subsoil Water Act, 2008 (Punjab Act No. 6 of 2008)
Legal boundaries, notified dates, and penalty calculators.
"""
from datetime import date
from typing import Dict, Any

# Statutory limits under Punjab Preservation of Subsoil Water Act, 2008
EARLIEST_LEGAL_NURSERY_SOWING_MONTH = 5   # May
EARLIEST_LEGAL_NURSERY_SOWING_DAY = 10     # May 10th

EARLIEST_LEGAL_TRANSPLANT_MONTH = 6       # June
EARLIEST_LEGAL_TRANSPLANT_DAY = 10         # June 10th (standard Punjab gazette notification)

PENALTY_PER_HECTARE_PER_MONTH = 10000.0   # Section 6 penalty (INR)
ACRES_PER_HECTARE = 2.47105

def is_paddy_crop(crop_name: str) -> bool:
    name = crop_name.lower()
    paddy_keywords = ["paddy", "rice", "pusa", "pr-", "parmal", "jhona", "basmati"]
    return any(k in name for k in paddy_keywords)

def check_transplanting_compliance(
    planned_date: date,
    land_size_acres: float,
    crop_type: str = "paddy"
) -> Dict[str, Any]:
    """
    Evaluates farmer's planned nursery/transplant date against Punjab Preservation of Subsoil Water Act.
    """
    if not is_paddy_crop(crop_type):
        return {
            "is_restricted_crop": False,
            "is_compliant": True,
            "status": "EXEMPT",
            "message": f"{crop_type.title()} is not restricted under the Punjab Preservation of Subsoil Water Act, 2008.",
            "penalty_inr": 0.0,
            "recommended_earliest_transplant": None,
            "legal_citations": []
        }

    year = planned_date.year
    legal_deadline = date(year, EARLIEST_LEGAL_TRANSPLANT_MONTH, EARLIEST_LEGAL_TRANSPLANT_DAY)
    
    is_compliant = planned_date >= legal_deadline
    hectares = land_size_acres / ACRES_PER_HECTARE
    
    if not is_compliant:
        days_early = (legal_deadline - planned_date).days
        months_early = max(1.0, days_early / 30.0)
        penalty = round(hectares * PENALTY_PER_HECTARE_PER_MONTH * months_early, 2)
        
        return {
            "is_restricted_crop": True,
            "is_compliant": False,
            "status": "VIOLATION_RISK",
            "days_premature": days_early,
            "planned_date": planned_date.isoformat(),
            "notified_legal_date": legal_deadline.isoformat(),
            "potential_penalty_inr": penalty,
            "hectares_affected": round(hectares, 2),
            "act_name": "Punjab Preservation of Subsoil Water Act, 2008 (Section 6)",
            "warning": (
                f"Sowing/transplanting on {planned_date.strftime('%d %B')} violates Punjab law. "
                f"Section 6 imposes a penalty of ₹10,000/month/hectare (est. ₹{penalty:,.0f} for {land_size_acres} acres). "
                f"Authorized agricultural officers have the legal power to uproot and destroy premature standing crop."
            )
        }
    else:
        return {
            "is_restricted_crop": True,
            "is_compliant": True,
            "status": "COMPLIANT",
            "days_premature": 0,
            "planned_date": planned_date.isoformat(),
            "notified_legal_date": legal_deadline.isoformat(),
            "potential_penalty_inr": 0.0,
            "hectares_affected": round(hectares, 2),
            "act_name": "Punjab Preservation of Subsoil Water Act, 2008",
            "message": f"Your transplanting date ({planned_date.strftime('%d %B')}) is compliant with Punjab subsoil preservation regulations."
        }
