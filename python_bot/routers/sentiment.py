from fastapi import APIRouter

router = APIRouter()

@router.get("/sentiment")
def get_sentiment(symbol: str = None):
    return {
        "overallScore": 0.65,
        "label": "Bullish",
        "bullishPercent": 65.0,
        "bearishPercent": 20.0,
        "neutralPercent": 15.0,
        "sourceCount": 145,
        "topKeywords": ["AI", "Growth", "Earnings", "Guidance"],
        "recentArticles": []
    }
