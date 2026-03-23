from fastapi import APIRouter
import python_bot.state as state
from datetime import datetime, timezone

router = APIRouter()

@router.get("/bot/status")
def get_bot_status():
    return {
        "status": "RUNNING" if state.is_running else "STOPPED",
        "uptime": 0,
        "lastUpdate": datetime.now(timezone.utc).isoformat(),
        "memoryUsage": 12.5,
        "cpuUsage": 4.2,
        "dataFeedStatus": {
            "connected": True,
            "provider": "Yahoo Finance (yfinance)",
            "latencyMs": 45
        },
        "mlModelStatus": {
            "loaded": state.agent.model is not None,
            "activeModel": state.agent.model_type,
            "inferenceTimeMs": 10
        },
        "rlAgentStatus": {
            "active": state.is_running,
            "episode": 0,
            "reward": state.engine.get_portfolio_value() - state.engine.initial_capital,
            "epsilon": 0.0
        }
    }

@router.post("/bot/start")
def start_bot():
    state.is_running = True
    return {"message": "Started live simulation engine"}

@router.post("/bot/stop")
def stop_bot():
    state.is_running = False
    return {"message": "Stopped live simulation engine"}

@router.post("/bot/kill-switch")
def kill_switch():
    state.is_running = False
    # Sell everything immediately
    for sym, data in list(state.engine.portfolio.items()):
        state.engine._sell(sym, data['current_price'], datetime.now(timezone.utc))
    return {"message": "Emergency Stop Triggered - Sold All Positions"}

@router.get("/bot/logs")
def get_bot_logs(level: str = "info", limit: int = 50):
    logs = []
    for trade in state.engine.trades:
        commission_str = f" (Fee: ${trade.get('commission', 0):.2f})" if 'commission' in trade else ""
        logs.append({
            "id": f"log-{trade['timestamp']}",
            "timestamp": trade["timestamp"],
            "level": "info",
            "message": f"{trade['type']} {trade['quantity']} shares of {trade['symbol']} at ${trade['price']:.2f}{commission_str}",
            "metadata": {
                "symbol": trade["symbol"],
                "strategy": "RL Agent"
            }
        })
    return logs[-limit:] if logs else [{"id": "init", "timestamp": datetime.now(timezone.utc).isoformat(), "level": "info", "message": "Bot Initialized"}]
