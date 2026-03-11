import { Router, type IRouter } from "express";
import {
  GetRiskSettingsResponse,
  UpdateRiskSettingsBody,
  UpdateRiskSettingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

let riskSettings = {
  maxDrawdown: 15,
  stopLossPercent: 3,
  maxPositionSize: 10,
  maxPortfolioConcentration: 25,
  volatilityMultiplier: 1.5,
  killSwitchLossThreshold: 10,
  maxDailyLoss: 5,
  enableDynamicStopLoss: true,
  enableVolatilityScaling: true,
  enablePortfolioDiversification: true,
};

router.get("/risk", (_req, res) => {
  const data = GetRiskSettingsResponse.parse(riskSettings);
  res.json(data);
});

router.put("/risk", (req, res) => {
  const body = UpdateRiskSettingsBody.parse(req.body);
  riskSettings = { ...riskSettings, ...body };
  const data = UpdateRiskSettingsResponse.parse(riskSettings);
  res.json(data);
});

export default router;
