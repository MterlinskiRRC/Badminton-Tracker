import { Router } from "express";
import { requirePlayerAuth } from "../middleware/auth";
import { analyticsController } from "../services/dependencies";

const analyticsRouter: Router = Router();

// Analytics is still exposed through the auth-guarded API.
analyticsRouter.get("/", requirePlayerAuth(), analyticsController.getSummary);

export default analyticsRouter;
