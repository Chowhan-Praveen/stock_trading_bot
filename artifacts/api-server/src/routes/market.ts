import { Router, type IRouter } from "express";
import {
  GetMarketRegimeResponse,
  GetWatchlistResponse,
  GetOrderBookResponse,
  GetOrderBookParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const PREDICTIONS = [
  "strong_buy",
  "buy",
  "hold",
  "sell",
  "strong_sell",
] as const;

function addNoise(price: number, pct: number) {
  return Math.round(price * (1 + (Math.random() - 0.5) * pct) * 100) / 100;
}

router.get("/market/regime", (_req, res) => {
  const regimes = ["bull", "bear", "sideways", "volatile"] as const;
  const regime = regimes[0];
  const data = GetMarketRegimeResponse.parse({
    regime,
    confidence: 0.78,
    vixLevel: 16.42,
    trendStrength: 0.65,
    momentum: 0.42,
    description:
      "Markets are in a sustained bullish trend with moderate volatility. Institutional buying pressure remains strong. Breadth indicators confirm broad participation.",
    signals: [
      "Moving averages in bullish alignment (MA20 > MA50 > MA200)",
      "RSI at 62 - bullish momentum without being overbought",
      "VIX below 20 - low fear, risk-on environment",
      "Positive earnings season with 78% of S&P 500 beats",
      "Fed holding rates steady - accommodative backdrop",
    ],
    updatedAt: new Date().toISOString(),
  });
  res.json(data);
});

router.get("/market/watchlist", (_req, res) => {
  const stocks = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 189.4 + (Math.random() - 0.5) * 4,
      baseChange: 2.35,
      sector: "Technology",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp",
      price: 415.22 + (Math.random() - 0.5) * 6,
      baseChange: 1.87,
      sector: "Technology",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp",
      price: 875.4 + (Math.random() - 0.5) * 20,
      baseChange: 3.14,
      sector: "Semiconductors",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 162.88 + (Math.random() - 0.5) * 3,
      baseChange: -0.42,
      sector: "Technology",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 196.34 + (Math.random() - 0.5) * 8,
      baseChange: -1.23,
      sector: "Automotive",
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      price: 503.27 + (Math.random() - 0.5) * 8,
      baseChange: 2.88,
      sector: "Technology",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 195.11 + (Math.random() - 0.5) * 5,
      baseChange: 1.12,
      sector: "E-Commerce",
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase",
      price: 213.45 + (Math.random() - 0.5) * 4,
      baseChange: 0.64,
      sector: "Finance",
    },
    {
      symbol: "AMD",
      name: "Advanced Micro Devices",
      price: 168.72 + (Math.random() - 0.5) * 6,
      baseChange: 4.22,
      sector: "Semiconductors",
    },
    {
      symbol: "SPY",
      name: "SPDR S&P 500 ETF",
      price: 531.24 + (Math.random() - 0.5) * 3,
      baseChange: 0.88,
      sector: "ETF",
    },
  ];

  const data = GetWatchlistResponse.parse(
    stocks.map((s, i) => ({
      symbol: s.symbol,
      name: s.name,
      price: Math.round(s.price * 100) / 100,
      change: Math.round((s.baseChange + (Math.random() - 0.5) * 0.5) * 100) / 100,
      changePercent: Math.round(((s.baseChange / s.price) * 100 + (Math.random() - 0.5) * 0.2) * 100) / 100,
      volume: Math.floor(10000000 + Math.random() * 90000000),
      high: Math.round(s.price * 1.015 * 100) / 100,
      low: Math.round(s.price * 0.985 * 100) / 100,
      open: Math.round(s.price * (1 + (Math.random() - 0.5) * 0.005) * 100) / 100,
      marketCap: Math.round(s.price * (50 + i * 10) * 1000000),
      prediction: PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)],
      predictionConfidence: Math.round((0.55 + Math.random() * 0.4) * 100) / 100,
      sector: s.sector,
    })),
  );
  res.json(data);
});

router.get("/market/orderbook/:symbol", (req, res) => {
  const params = GetOrderBookParams.parse(req.params);
  const midPrice = 189.4 + Math.random() * 500;
  const spread = Math.random() * 0.1 + 0.01;

  const bids = Array.from({ length: 10 }, (_, i) => {
    const price = Math.round((midPrice - spread / 2 - i * 0.05) * 100) / 100;
    const size = Math.floor(Math.random() * 500 + 50);
    return { price, size, total: Math.round(price * size * 100) / 100 };
  });

  const asks = Array.from({ length: 10 }, (_, i) => {
    const price = Math.round((midPrice + spread / 2 + i * 0.05) * 100) / 100;
    const size = Math.floor(Math.random() * 500 + 50);
    return { price, size, total: Math.round(price * size * 100) / 100 };
  });

  const data = GetOrderBookResponse.parse({
    symbol: params.symbol,
    bids,
    asks,
    spread: Math.round(spread * 100) / 100,
    midPrice: Math.round(midPrice * 100) / 100,
    updatedAt: new Date().toISOString(),
  });
  res.json(data);
});

export default router;
