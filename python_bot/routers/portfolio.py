from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime, timezone
from ..state import engine

router = APIRouter()

class Position(BaseModel):
    symbol: str
    quantity: float
    avgPrice: float
    currentPrice: float
    marketValue: float
    pnl: float
    pnlPercent: float
    allocation: float
    sector: str

class PortfolioResponse(BaseModel):
    totalValue: float
    cashBalance: float
    investedValue: float
    totalPnl: float
    totalPnlPercent: float
    dayPnl: float
    dayPnlPercent: float
    positions: List[Position]

@router.get("/portfolio", response_model=PortfolioResponse)
def get_portfolio():
    return engine.get_api_portfolio()

class PortfolioHistoryItem(BaseModel):
    timestamp: str
    value: float
    pnl: float

@router.get("/portfolio/history", response_model=List[PortfolioHistoryItem])
def get_portfolio_history(period: str = '7d'):
    # Return actual tracking history
    history = engine.history
    
    # If empty, just return a flatline for the dashboard
    if not history:
        now = datetime.now(timezone.utc).timestamp()
        arr = []
        baseValue = engine.initial_capital
        for i in range(7, -1, -1):
            t = datetime.fromtimestamp(now - i * 86400, timezone.utc)
            arr.append({
                "timestamp": t.isoformat(),
                "value": baseValue,
                "pnl": 0.0
            })
        return arr
        
    return history
