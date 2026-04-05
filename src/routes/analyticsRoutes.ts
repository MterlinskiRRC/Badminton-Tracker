import { Router } from "express";
import { requireRole, verifyFirebaseToken } from "../middleware/auth";
import { analyticsController } from "../services/dependencies";

const analyticsRouter: Router = Router();

analyticsRouter.use(verifyFirebaseToken);

analyticsRouter.get("/", requireRole("admin"), analyticsController.getSummary);

export default analyticsRouter;
