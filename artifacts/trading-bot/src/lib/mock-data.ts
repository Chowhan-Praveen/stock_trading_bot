export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface TradeLocation {
  time: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  price: number;
  confidence: number;
  strategy: string;
}

export interface MLSignal {
  symbol: string;
  price: number;
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number;
  conditionsMatched: number;
  totalConditions: number;
  mlPrediction: string;
  mlConfidence: number;
  rlQScore: number;
  regime: string;
  expiresIn: string;
}

// Initial Mock Data
export const MOCK_PRICES: StockPrice[] = [
  { symbol: "SPY", price: 512.30, change: 2.15, changePercent: 0.42, volume: 45000000 },
  { symbol: "QQQ", price: 445.10, change: 3.20, changePercent: 0.72, volume: 32000000 },
  { symbol: "TSLA", price: 175.40, change: -1.20, changePercent: -0.68, volume: 85000000 },
  { symbol: "NVDA", price: 890.50, change: 15.30, changePercent: 1.75, volume: 62000000 },
  { symbol: "AAPL", price: 173.20, change: 0.50, changePercent: 0.29, volume: 51000000 },
];

export const MOCK_SIGNALS: MLSignal[] = [
  {
    symbol: "NVDA",
    price: 890.50,
    recommendation: "BUY",
    confidence: 89,
    conditionsMatched: 6,
    totalConditions: 7,
    mlPrediction: "Strong Bullish Continuation",
    mlConfidence: 92,
    rlQScore: 0.85,
    regime: "BULLISH",
    expiresIn: "00:15:30"
  },
  {
    symbol: "TSLA",
    price: 175.40,
    recommendation: "SELL",
    confidence: 76,
    conditionsMatched: 5,
    totalConditions: 7,
    mlPrediction: "Bearish Breakdown",
    mlConfidence: 81,
    rlQScore: -0.62,
    regime: "BEARISH",
    expiresIn: "00:05:12"
  },
  {
    symbol: "SPY",
    price: 512.30,
    recommendation: "HOLD",
    confidence: 54,
    conditionsMatched: 3,
    totalConditions: 7,
    mlPrediction: "Neutral Consolidation",
    mlConfidence: 45,
    rlQScore: 0.12,
    regime: "SIDEWAYS",
    expiresIn: "01:20:00"
  }
];

export const MOCK_TRADES: TradeLocation[] = [
  { time: "10:45:22", symbol: "NVDA", action: "BUY", price: 885.20, confidence: 91, strategy: "Deep Q-Network" },
  { time: "10:42:15", symbol: "TSLA", action: "SELL", price: 176.50, confidence: 78, strategy: "PPO Agent" },
  { time: "10:35:05", symbol: "AAPL", action: "HOLD", price: 172.80, confidence: 65, strategy: "LSTM Predictor" },
];

export const MOCK_PORTFOLIO = {
  totalValue: 124560.50,
  dailyPnl: 1245.20,
  dailyPnlPercent: 1.01,
  activePositions: 4,
  winRate: 68.5,
  sharpeRatio: 1.85
};

export const MOCK_LOGS = [
  { id: 1, time: "10:45:22", level: "EXECUTION", message: "FILLED: BUY 15 NVDA @ 885.20" },
  { id: 2, time: "10:45:21", level: "MODEL", message: "DQN Agent generated BUY signal for NVDA (Q=0.85)" },
  { id: 3, time: "10:42:15", level: "EXECUTION", message: "FILLED: SELL 50 TSLA @ 176.50" },
  { id: 4, time: "10:40:00", level: "INFO", message: "Market Regime Updated: BULLISH -> VOLATILE" },
];
