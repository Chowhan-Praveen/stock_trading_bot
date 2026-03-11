import { Router, type IRouter } from "express";
import {
  GetTradesResponse,
  GetTradesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SYMBOLS = ["AAPL", "MSFT", "NVDA", "GOOGL", "TSLA", "META", "AMZN", "JPM", "SPY", "AMD"];
const STRATEGIES = ["DQN Agent", "PPO Agent", "LSTM Predictor", "Transformer", "Gradient Boost"];
const ACTIONS = ["buy", "sell", "hold"] as const;
const STATUSES = ["open", "closed", "cancelled"] as const;

function generateTrades(count: number) {
  const trades = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const price = 100 + Math.random() * 900;
    const quantity = Math.floor(Math.random() * 100) + 1;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const pnl = status === "closed" ? (Math.random() - 0.4) * 500 : 0;
    const slippage = Math.random() * 0.05;

    trades.push({
      id: `TRD-${String(1000 + i).padStart(6, "0")}`,
      symbol,
      action,
      quantity,
      price: Math.round(price * 100) / 100,
      totalValue: Math.round(price * quantity * 100) / 100,
      status,
      strategy: STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)],
      confidence: Math.round((0.5 + Math.random() * 0.5) * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
      timestamp: new Date(now - i * 12 * 60 * 1000 - Math.random() * 3600000).toISOString(),
      slippage: Math.round(slippage * 10000) / 10000,
    });
  }
  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const allTrades = generateTrades(200);

router.get("/trades", (req, res) => {
  const params = GetTradesQueryParams.parse(req.query);
  let trades = allTrades;

  if (params.status && params.status !== "all") {
    trades = trades.filter((t) => t.status === params.status);
  }

  const limit = params.limit ?? 50;
  const data = GetTradesResponse.parse(trades.slice(0, limit));
  res.json(data);
});

export default router;
