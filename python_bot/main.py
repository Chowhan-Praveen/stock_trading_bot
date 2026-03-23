from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import uvicorn

# We will implement these routers next
from python_bot.routers import portfolio, strategies, market, risk, bot, performance, trades, sentiment

app = FastAPI(title="Alpha Trader Bot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router, prefix="/api", tags=["portfolio"])
app.include_router(strategies.router, prefix="/api", tags=["strategies"])
app.include_router(market.router, prefix="/api", tags=["market"])
app.include_router(risk.router, prefix="/api", tags=["risk"])
app.include_router(bot.router, prefix="/api", tags=["bot"])
app.include_router(performance.router, prefix="/api", tags=["performance"])
app.include_router(trades.router, prefix="/api", tags=["trades"])
app.include_router(sentiment.router, prefix="/api", tags=["sentiment"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
