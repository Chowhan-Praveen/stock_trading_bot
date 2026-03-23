from fastapi import APIRouter
from ..data_collector import get_watchlist_data
import random

router = APIRouter()

@router.get("/market/regime")
def get_market_regime():
    # Placeholder regime detection
    return {
        "regime": "bull",
        "confidence": 0.85,
        "indicators": {
            "trend": "up",
            "volatility": "low",
            "momentum": "strong"
        }
    }

@router.get("/market/watchlist")
def get_watchlist():
    # Use our data_collector to get real prices for the universe
    symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN']
    try:
        data = get_watchlist_data(symbols)
        # Decorate with random ML predictions for the dashboard
        for d in data:
            d['mlPrediction'] = {
                "action": random.choice(["buy", "sell", "hold"]),
                "confidence": round(random.uniform(0.5, 0.99), 2),
                "targetPrice": round(d['price'] * random.uniform(0.9, 1.1), 2),
                "timeframe": "1d"
            }
        return data
    except Exception as e:
        print(f"Error fetching watchlist: {e}")
        return []

@router.get("/market/orderbook/{symbol}")
def get_orderbook(symbol: str):
    return {
        "symbol": symbol,
        "lastUpdate": "2023-01-01T00:00:00Z",
        "bids": [],
        "asks": [],
        "spread": 0.0,
        "liquidityScore": 0.0
    }
