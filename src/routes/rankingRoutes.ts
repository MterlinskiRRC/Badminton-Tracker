import { Router } from "express";
import { requirePlayerAuth } from "../middleware/auth";
import { rankingController } from "../services/dependencies";

const rankingRouter: Router = Router();

rankingRouter.get("/", requirePlayerAuth(), rankingController.getAll);

export default rankingRouter;
