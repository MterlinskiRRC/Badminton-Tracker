import { Router } from "express";
import { requireRole } from "../middleware/auth";
import { analyticsController } from "../services/dependencies";

const analyticsRouter: Router = Router();

analyticsRouter.get("/", requireRole("admin"), analyticsController.getSummary);

export default analyticsRouter;
