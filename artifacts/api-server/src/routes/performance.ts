import { Router, type IRouter } from "express";
import {
  GetPerformanceMetricsResponse,
  GetBacktestResultsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/performance", (_req, res) => {
  const data = GetPerformanceMetricsResponse.parse({
    sharpeRatio: 2.14,
    sortinoRatio: 2.87,
    maxDrawdown: 8.32,
    currentDrawdown: 1.45,
    winRate: 0.638,
    lossRate: 0.362,
    profitFactor: 2.31,
    totalTrades: 1487,
    winningTrades: 948,
    losingTrades: 539,
    avgWin: 412.50,
    avgLoss: -178.25,
    totalReturn: 18.42,
    annualizedReturn: 24.18,
    calmarRatio: 2.91,
    beta: 0.72,
    alpha: 0.084,
  });
  res.json(data);
});

router.get("/performance/backtest", (_req, res) => {
  const now = Date.now();
  const initialCapital = 100000;
  const equityCurve = [];
  let value = initialCapital;

  for (let i = 365; i >= 0; i--) {
    const t = new Date(now - i * 24 * 3600 * 1000);
    const dailyReturn = (Math.random() - 0.42) * 0.025;
    value = value * (1 + dailyReturn);
    equityCurve.push({
      timestamp: t.toISOString(),
      value: Math.round(value * 100) / 100,
      pnl: Math.round((value - initialCapital) * 100) / 100,
    });
  }

  const finalValue = value;
  const totalReturn = ((finalValue - initialCapital) / initialCapital) * 100;

  const data = GetBacktestResultsResponse.parse({
    period: "1 Year (Jan 2025 - Jan 2026)",
    initialCapital,
    finalValue: Math.round(finalValue * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    annualizedReturn: Math.round(totalReturn * 100) / 100,
    maxDrawdown: 12.4,
    sharpeRatio: 1.98,
    totalTrades: 2847,
    winRate: 0.621,
    equityCurve,
  });
  res.json(data);
});

export default router;
