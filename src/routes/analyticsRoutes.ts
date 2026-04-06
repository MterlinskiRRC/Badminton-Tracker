import { Router } from "express";
import { requirePlayerAuth } from "../middleware/auth";
import { analyticsController } from "../services/dependencies";

const analyticsRouter: Router = Router();

analyticsRouter.get("/", requirePlayerAuth(), analyticsController.getSummary);

export default analyticsRouter;
