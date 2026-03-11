import { Router, type IRouter } from "express";
import {
  GetPortfolioResponse,
  GetPortfolioHistoryResponse,
  GetPortfolioHistoryQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

let portfolioHistory: Array<{ timestamp: string; value: number; pnl: number }> =
  [];

function generateHistory() {
  const now = Date.now();
  const baseValue = 100000;
  const arr = [];
  for (let i = 90; i >= 0; i--) {
    const t = new Date(now - i * 24 * 3600 * 1000);
    const noise = (Math.random() - 0.45) * 2500;
    const trend = ((90 - i) / 90) * 18000;
    const value = baseValue + trend + noise;
    arr.push({
      timestamp: t.toISOString(),
      value: Math.round(value * 100) / 100,
      pnl: Math.round((value - baseValue) * 100) / 100,
    });
  }
  return arr;
}

portfolioHistory = generateHistory();

router.get("/portfolio", (_req, res) => {
  const data = GetPortfolioResponse.parse({
    totalValue: 118420.55,
    cashBalance: 22340.0,
    investedValue: 96080.55,
    totalPnl: 18420.55,
    totalPnlPercent: 18.42,
    dayPnl: 1243.88,
    dayPnlPercent: 1.06,
    positions: [
      {
        symbol: "AAPL",
        quantity: 50,
        avgPrice: 171.25,
        currentPrice: 189.4,
        marketValue: 9470.0,
        pnl: 907.5,
        pnlPercent: 10.6,
        allocation: 8.0,
        sector: "Technology",
      },
      {
        symbol: "MSFT",
        quantity: 30,
        avgPrice: 380.5,
        currentPrice: 415.22,
        marketValue: 12456.6,
        pnl: 1041.6,
        pnlPercent: 9.13,
        allocation: 10.52,
        sector: "Technology",
      },
      {
        symbol: "NVDA",
        quantity: 25,
        avgPrice: 620.0,
        currentPrice: 875.4,
        marketValue: 21885.0,
        pnl: 6385.0,
        pnlPercent: 41.18,
        allocation: 18.48,
        sector: "Semiconductors",
      },
      {
        symbol: "GOOGL",
        quantity: 40,
        avgPrice: 145.0,
        currentPrice: 162.88,
        marketValue: 6515.2,
        pnl: 715.2,
        pnlPercent: 12.32,
        allocation: 5.5,
        sector: "Technology",
      },
      {
        symbol: "TSLA",
        quantity: 35,
        avgPrice: 225.0,
        currentPrice: 196.34,
        marketValue: 6871.9,
        pnl: -1002.1,
        pnlPercent: -12.72,
        allocation: 5.8,
        sector: "Automotive",
      },
      {
        symbol: "META",
        quantity: 20,
        avgPrice: 430.0,
        currentPrice: 503.27,
        marketValue: 10065.4,
        pnl: 1465.4,
        pnlPercent: 17.05,
        allocation: 8.5,
        sector: "Technology",
      },
      {
        symbol: "AMZN",
        quantity: 45,
        avgPrice: 178.0,
        currentPrice: 195.11,
        marketValue: 8779.95,
        pnl: 769.95,
        pnlPercent: 9.61,
        allocation: 7.41,
        sector: "E-Commerce",
      },
      {
        symbol: "JPM",
        quantity: 60,
        avgPrice: 195.0,
        currentPrice: 213.45,
        marketValue: 12807.0,
        pnl: 1107.0,
        pnlPercent: 9.46,
        allocation: 10.81,
        sector: "Finance",
      },
      {
        symbol: "SPY",
        quantity: 15,
        avgPrice: 490.0,
        currentPrice: 531.24,
        marketValue: 7968.6,
        pnl: 618.6,
        pnlPercent: 8.41,
        allocation: 6.73,
        sector: "ETF",
      },
    ],
  });
  res.json(data);
});

router.get("/portfolio/history", (req, res) => {
  const params = GetPortfolioHistoryQueryParams.parse(req.query);
  const now = Date.now();
  let cutoff = 0;

  switch (params.period) {
    case "1d":
      cutoff = now - 1 * 24 * 3600 * 1000;
      break;
    case "7d":
      cutoff = now - 7 * 24 * 3600 * 1000;
      break;
    case "30d":
      cutoff = now - 30 * 24 * 3600 * 1000;
      break;
    case "90d":
    default:
      cutoff = now - 90 * 24 * 3600 * 1000;
      break;
  }

  const filtered = portfolioHistory.filter(
    (h) => new Date(h.timestamp).getTime() >= cutoff,
  );

  const data = GetPortfolioHistoryResponse.parse(filtered);
  res.json(data);
});

export default router;
