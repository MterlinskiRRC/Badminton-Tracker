import { Router } from "express";
import { requireRole, verifyFirebaseToken } from "../middleware/auth";
import { analyticsController } from "../services/dependencies";

const analyticsRouter: Router = Router();

analyticsRouter.get("/", verifyFirebaseToken, requireRole("admin"), analyticsController.getSummary);

export default analyticsRouter;
