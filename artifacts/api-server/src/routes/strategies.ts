import { Router, type IRouter } from "express";
import {
  GetStrategiesResponse,
  ActivateStrategyResponse,
  DeactivateStrategyResponse,
  ActivateStrategyParams,
  DeactivateStrategyParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const strategies = [
  {
    id: "dqn-1",
    name: "Deep Q-Network Agent",
    type: "RL" as const,
    algorithm: "DQN",
    isActive: true,
    accuracy: 0.684,
    sharpeRatio: 1.82,
    totalTrades: 1243,
    winRate: 0.612,
    description:
      "Deep Q-Network reinforcement learning agent that learns optimal buy/sell/hold decisions through reward maximization. Uses experience replay and target network for stability.",
    lastTrained: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isTraining: false,
  },
  {
    id: "ppo-1",
    name: "Proximal Policy Optimization",
    type: "RL" as const,
    algorithm: "PPO",
    isActive: true,
    accuracy: 0.711,
    sharpeRatio: 2.14,
    totalTrades: 987,
    winRate: 0.638,
    description:
      "PPO actor-critic agent with clipped surrogate objective for safe policy updates. Handles continuous action spaces for dynamic position sizing.",
    lastTrained: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    isTraining: false,
  },
  {
    id: "lstm-1",
    name: "LSTM Price Predictor",
    type: "ML" as const,
    algorithm: "LSTM",
    isActive: true,
    accuracy: 0.731,
    sharpeRatio: 1.65,
    totalTrades: 2156,
    winRate: 0.589,
    description:
      "Long Short-Term Memory network for sequential price pattern recognition. Trained on OHLCV data with technical indicators using rolling window cross-validation.",
    lastTrained: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    isTraining: false,
  },
  {
    id: "transformer-1",
    name: "Transformer Market Model",
    type: "ML" as const,
    algorithm: "Transformer",
    isActive: false,
    accuracy: 0.752,
    sharpeRatio: 2.31,
    totalTrades: 456,
    winRate: 0.661,
    description:
      "Multi-head attention transformer model with market context encoding. Incorporates order book data, sentiment signals, and macroeconomic indicators.",
    lastTrained: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isTraining: true,
  },
  {
    id: "gbm-1",
    name: "Gradient Boosting Ensemble",
    type: "ML" as const,
    algorithm: "GradientBoosting",
    isActive: true,
    accuracy: 0.698,
    sharpeRatio: 1.74,
    totalTrades: 3421,
    winRate: 0.602,
    description:
      "XGBoost/LightGBM ensemble with 200+ engineered features including technical indicators, sentiment scores, and regime signals. Walk-forward tested.",
    lastTrained: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    isTraining: false,
  },
  {
    id: "hybrid-1",
    name: "Hybrid RL+ML Strategy",
    type: "hybrid" as const,
    algorithm: "DQN+LSTM",
    isActive: false,
    accuracy: 0.773,
    sharpeRatio: 2.58,
    totalTrades: 312,
    winRate: 0.692,
    description:
      "Combined approach: LSTM provides price direction predictions as state features for DQN agent. Regime-aware switching between exploitation and exploration.",
    lastTrained: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    isTraining: false,
  },
];

router.get("/strategies", (_req, res) => {
  const data = GetStrategiesResponse.parse(strategies);
  res.json(data);
});

router.post("/strategies/:id/activate", (req, res) => {
  const params = ActivateStrategyParams.parse(req.params);
  const strategy = strategies.find((s) => s.id === params.id);
  if (!strategy) {
    res.status(404).json({ error: "Strategy not found" });
    return;
  }
  strategy.isActive = true;
  const data = ActivateStrategyResponse.parse(strategy);
  res.json(data);
});

router.post("/strategies/:id/deactivate", (req, res) => {
  const params = DeactivateStrategyParams.parse(req.params);
  const strategy = strategies.find((s) => s.id === params.id);
  if (!strategy) {
    res.status(404).json({ error: "Strategy not found" });
    return;
  }
  strategy.isActive = false;
  const data = DeactivateStrategyResponse.parse(strategy);
  res.json(data);
});

export default router;
