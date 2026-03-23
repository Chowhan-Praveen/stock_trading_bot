from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RiskSettings(BaseModel):
    maxDrawdownPct: float
    maxPositionSizePct: float
    stopLossPct: float
    takeProfitPct: float
    maxOpenPositions: int
    dailyLossLimitPct: float
    allowShortSelling: bool
    requireDiverseSectors: bool

@router.get("/risk")
def get_risk_settings():
    return {
        "maxDrawdownPct": 15.0,
        "maxPositionSizePct": 20.0,
        "stopLossPct": 5.0,
        "takeProfitPct": 10.0,
        "maxOpenPositions": 8,
        "dailyLossLimitPct": 3.0,
        "allowShortSelling": False,
        "requireDiverseSectors": True
    }

@router.put("/risk")
def update_risk_settings(settings: RiskSettings):
    return settings.model_dump()
