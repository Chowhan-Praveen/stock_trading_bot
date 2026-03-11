import { Router, type IRouter } from "express";
import {
  GetBotStatusResponse,
  StartBotResponse,
  StopBotResponse,
  TriggerKillSwitchResponse,
  GetBotLogsResponse,
  GetBotLogsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

let botState = {
  isRunning: true,
  isKillSwitchActive: false,
  startTime: Date.now() - 3600 * 1000 * 6,
};

const LOG_SOURCES = ["DataPipeline", "MLPredictor", "RLAgent", "RiskManager", "OrderExec", "Sentinel"];
const LOG_LEVELS = ["info", "info", "info", "warning", "error", "debug"] as const;
const LOG_MESSAGES = [
  { source: "DataPipeline", level: "info" as const, msg: "OHLCV data ingested for AAPL: O=187.2 H=190.1 L=186.8 C=189.4" },
  { source: "DataPipeline", level: "info" as const, msg: "Order book snapshot processed: MSFT bid/ask spread 0.03" },
  { source: "DataPipeline", level: "info" as const, msg: "Macroeconomic indicators updated: CPI=3.2% PPI=2.8% Unemployment=3.9%" },
  { source: "MLPredictor", level: "info" as const, msg: "LSTM prediction: NVDA +2.4% confidence=0.73 horizon=4h" },
  { source: "MLPredictor", level: "info" as const, msg: "Transformer model inference complete: 10 symbols processed in 142ms" },
  { source: "MLPredictor", level: "info" as const, msg: "Gradient Boost ensemble: TSLA SELL signal, feature importance: RSI=0.31, MACD=0.24" },
  { source: "RLAgent", level: "info" as const, msg: "DQN action: BUY AAPL qty=15 Q-value=2.84 epsilon=0.05" },
  { source: "RLAgent", level: "info" as const, msg: "PPO policy update: reward=+142.50 baseline=98.30 advantage=+44.20" },
  { source: "RLAgent", level: "info" as const, msg: "Experience replay buffer: 50000 transitions, sampling minibatch=256" },
  { source: "RiskManager", level: "info" as const, msg: "Position size calculated: MSFT max_qty=25 based on ATR=2.3 volatility_scale=0.8" },
  { source: "RiskManager", level: "warning" as const, msg: "TSLA position approaching stop-loss threshold: current=-11.8% limit=-12%" },
  { source: "RiskManager", level: "info" as const, msg: "Portfolio correlation check: diversification score=0.78 (target >0.7)" },
  { source: "RiskManager", level: "info" as const, msg: "Dynamic stop-loss updated: NVDA trailing stop set at $840.20" },
  { source: "OrderExec", level: "info" as const, msg: "Order filled: BUY AAPL 20@189.42 slippage=0.02% latency=38ms" },
  { source: "OrderExec", level: "info" as const, msg: "Order submitted: SELL META 5@503.15 type=LIMIT broker=Alpaca" },
  { source: "OrderExec", level: "warning" as const, msg: "Slippage detected on AMD: expected=168.72 filled=168.94 (+0.13%)" },
  { source: "Sentinel", level: "info" as const, msg: "Anomaly detection: no unusual price movements detected in past 15 minutes" },
  { source: "Sentinel", level: "info" as const, msg: "Market regime confirmed: BULL confidence=0.78 (momentum=0.42)" },
  { source: "Sentinel", level: "warning" as const, msg: "News event detected: Fed statement release scheduled in 2 hours - reducing position sizes 20%" },
  { source: "DataPipeline", level: "error" as const, msg: "Rate limit hit on Alpaca news API - retrying in 30s (attempt 2/5)" },
  { source: "MLPredictor", level: "debug" as const, msg: "Feature engineering: 127 features computed for Gradient Boost in 28ms" },
  { source: "RLAgent", level: "debug" as const, msg: "Exploration: epsilon=0.05, greedy actions=95%, random actions=5%" },
];

function generateLogs(count: number) {
  const logs = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const template = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
    logs.push({
      id: `LOG-${Date.now()}-${i}`,
      level: template.level,
      message: template.msg,
      source: template.source,
      timestamp: new Date(now - i * 15 * 1000 - Math.random() * 10000).toISOString(),
      metadata: {},
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

router.get("/bot/status", (_req, res) => {
  const uptime = botState.isRunning ? Math.floor((Date.now() - botState.startTime) / 1000) : 0;

  const alerts = [];
  if (botState.isKillSwitchActive) {
    alerts.push({
      id: "alert-ks",
      level: "critical" as const,
      message: "KILL SWITCH ACTIVE: All trading operations halted",
      timestamp: new Date().toISOString(),
    });
  }
  alerts.push({
    id: "alert-1",
    level: "warning" as const,
    message: "TSLA approaching stop-loss threshold (-11.8% of -12% limit)",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  });
  alerts.push({
    id: "alert-2",
    level: "info" as const,
    message: "Transformer model retraining in progress (ETA: 45 min)",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  });
  alerts.push({
    id: "alert-3",
    level: "info" as const,
    message: "Fed statement in 2 hours - position sizes reduced 20%",
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  });

  const data = GetBotStatusResponse.parse({
    isRunning: botState.isRunning,
    isKillSwitchActive: botState.isKillSwitchActive,
    uptime,
    activeStrategies: botState.isRunning ? 4 : 0,
    pendingOrders: botState.isRunning ? Math.floor(Math.random() * 8) : 0,
    totalOrdersToday: 127,
    dataFeedStatus: botState.isRunning ? "connected" : "disconnected",
    mlModelStatus: botState.isRunning ? "ready" : "error",
    rlAgentStatus: botState.isRunning ? "ready" : "error",
    lastHeartbeat: new Date().toISOString(),
    alerts,
  });
  res.json(data);
});

router.post("/bot/start", (_req, res) => {
  botState.isRunning = true;
  botState.isKillSwitchActive = false;
  botState.startTime = Date.now();
  const data = StartBotResponse.parse({
    isRunning: true,
    isKillSwitchActive: false,
    uptime: 0,
    activeStrategies: 4,
    pendingOrders: 0,
    totalOrdersToday: 127,
    dataFeedStatus: "connected",
    mlModelStatus: "ready",
    rlAgentStatus: "ready",
    lastHeartbeat: new Date().toISOString(),
    alerts: [],
  });
  res.json(data);
});

router.post("/bot/stop", (_req, res) => {
  botState.isRunning = false;
  const data = StopBotResponse.parse({
    isRunning: false,
    isKillSwitchActive: false,
    uptime: 0,
    activeStrategies: 0,
    pendingOrders: 0,
    totalOrdersToday: 127,
    dataFeedStatus: "disconnected",
    mlModelStatus: "ready",
    rlAgentStatus: "ready",
    lastHeartbeat: new Date().toISOString(),
    alerts: [],
  });
  res.json(data);
});

router.post("/bot/kill-switch", (_req, res) => {
  botState.isRunning = false;
  botState.isKillSwitchActive = true;
  const data = TriggerKillSwitchResponse.parse({
    isRunning: false,
    isKillSwitchActive: true,
    uptime: 0,
    activeStrategies: 0,
    pendingOrders: 0,
    totalOrdersToday: 127,
    dataFeedStatus: "disconnected",
    mlModelStatus: "ready",
    rlAgentStatus: "ready",
    lastHeartbeat: new Date().toISOString(),
    alerts: [
      {
        id: "alert-ks",
        level: "critical" as const,
        message: "KILL SWITCH ACTIVATED: All trading halted immediately. Manual review required.",
        timestamp: new Date().toISOString(),
      },
    ],
  });
  res.json(data);
});

router.get("/bot/logs", (req, res) => {
  const params = GetBotLogsQueryParams.parse(req.query);
  const limit = params.limit ?? 100;
  const logs = generateLogs(Math.min(limit, 200));
  const data = GetBotLogsResponse.parse(logs);
  res.json(data);
});

export default router;
