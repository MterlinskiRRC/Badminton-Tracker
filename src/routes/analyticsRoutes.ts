import { Router } from "express";
import { requireRole } from "../middleware/auth";
import { analyticsController } from "../services/dependencies";

const analyticsRouter: Router = Router();

// Analytics is restricted to admin users.
analyticsRouter.get("/", requireRole("admin"), analyticsController.getSummary);

export default analyticsRouter;
