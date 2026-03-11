import { Router, type IRouter } from "express";
import { GetNewsSentimentResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const sentimentItems = [
  {
    id: "s1",
    headline: "NVIDIA Reports Record Q4 Revenue of $22.1B, Beats Estimates by 12%",
    source: "Bloomberg",
    symbol: "NVDA",
    sentiment: "positive" as const,
    score: 0.92,
    impact: "high" as const,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s2",
    headline: "Federal Reserve Signals Patience on Rate Cuts, Markets Digest Hawkish Tone",
    source: "Reuters",
    symbol: "SPY",
    sentiment: "negative" as const,
    score: -0.45,
    impact: "high" as const,
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s3",
    headline: "Apple Vision Pro Sales Exceed Initial Forecasts, Developer Adoption Growing",
    source: "Financial Times",
    symbol: "AAPL",
    sentiment: "positive" as const,
    score: 0.71,
    impact: "medium" as const,
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s4",
    headline: "Tesla Faces Production Delays at Shanghai Gigafactory Due to Supply Chain",
    source: "WSJ",
    symbol: "TSLA",
    sentiment: "negative" as const,
    score: -0.68,
    impact: "high" as const,
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s5",
    headline: "Microsoft Azure Cloud Revenue Surges 28% YoY, AI Services Driving Growth",
    source: "CNBC",
    symbol: "MSFT",
    sentiment: "positive" as const,
    score: 0.84,
    impact: "high" as const,
    timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s6",
    headline: "AMD Announces Next-Gen MI300X GPU, Targets Enterprise AI Market",
    source: "TechCrunch",
    symbol: "AMD",
    sentiment: "positive" as const,
    score: 0.63,
    impact: "medium" as const,
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s7",
    headline: "Meta Platforms Increases AI Infrastructure Spending to $37B for 2024",
    source: "Barron's",
    symbol: "META",
    sentiment: "neutral" as const,
    score: 0.12,
    impact: "medium" as const,
    timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s8",
    headline: "Amazon Web Services Partners with Anthropic for Enterprise AI Deployment",
    source: "Forbes",
    symbol: "AMZN",
    sentiment: "positive" as const,
    score: 0.77,
    impact: "medium" as const,
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s9",
    headline: "JPMorgan Reports Strong Investment Banking Revenue, Loan Growth Steady",
    source: "Bloomberg",
    symbol: "JPM",
    sentiment: "positive" as const,
    score: 0.58,
    impact: "medium" as const,
    timestamp: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
    url: "#",
  },
  {
    id: "s10",
    headline: "CPI Inflation Data Comes in at 3.2%, Slightly Above Consensus of 3.1%",
    source: "Reuters",
    symbol: "SPY",
    sentiment: "negative" as const,
    score: -0.35,
    impact: "high" as const,
    timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    url: "#",
  },
];

router.get("/sentiment", (_req, res) => {
  const data = GetNewsSentimentResponse.parse(sentimentItems);
  res.json(data);
});

export default router;
