import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import tradesRouter from "./trades";
import strategiesRouter from "./strategies";
import riskRouter from "./risk";
import marketRouter from "./market";
import botRouter from "./bot";
import sentimentRouter from "./sentiment";
import performanceRouter from "./performance";

const router: IRouter = Router();

router.use(healthRouter);
router.use(portfolioRouter);
router.use(tradesRouter);
router.use(strategiesRouter);
router.use(riskRouter);
router.use(marketRouter);
router.use(botRouter);
router.use(sentimentRouter);
router.use(performanceRouter);

export default router;
