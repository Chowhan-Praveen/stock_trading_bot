from fastapi import APIRouter
from ..state import engine

router = APIRouter()

@router.get("/trades")
def get_trades(limit: int = 50, symbol: str = None, status: str = None):
    # Format the internal engine trades
    api_trades = []
    
    for i, t in enumerate(engine.trades):
        if symbol and t['symbol'] != symbol:
            continue
            
        api_trades.append({
            "id": f"trade-{i}",
            "symbol": t['symbol'],
            "type": t['type'].lower(),
            "status": "executed",
            "quantity": t['quantity'],
            "price": t['price'],
            "value": t['quantity'] * t['price'],
            "timestamp": t['timestamp'],
            "strategyId": "1",
            "reason": "RL Agent Signal"
        })
        
    # React dashboard expects newest first
    return list(reversed(api_trades))[:limit]
