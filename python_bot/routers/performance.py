from fastapi import APIRouter

router = APIRouter()

@router.get("/performance")
def get_performance():
    return {
        "sharpeRatio": 1.5,
        "sortinoRatio": 2.1,
        "maxDrawdown": -8.4,
        "winRate": 64.5,
        "profitFactor": 1.75,
        "totalTrades": 120,
        "profitableTrades": 77,
        "losingTrades": 43,
        "averageWin": 450.0,
        "averageLoss": -150.0,
        "largestWin": 1200.0,
        "largestLoss": -400.0,
        "expectancy": 210.3,
        "recoveryFactor": 2.2
    }

@router.get("/performance/backtest")
def get_backtest():
    return {
        "strategyId": "1",
        "strategyName": "DQN Optimizer",
        "startDate": "2023-01-01T00:00:00Z",
        "endDate": "2023-12-31T00:00:00Z",
        "initialCapital": 100000.0,
        "finalCapital": 125000.0,
        "totalReturnPct": 25.0,
        "benchmarkReturnPct": 16.5,
        "maxDrawdownPct": -8.5,
        "sharpeRatio": 1.6,
        "trades": 85,
        "winRate": 62.5,
        "profitFactor": 1.8,
        "equityCurve": []
    }
