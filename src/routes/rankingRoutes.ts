import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth";
import { rankingController } from "../services/dependencies";

const rankingRouter: Router = Router();

rankingRouter.get("/", verifyFirebaseToken, rankingController.getAll);

export default rankingRouter;
