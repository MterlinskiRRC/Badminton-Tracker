import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth";
import { rankingController } from "../services/dependencies";

const rankingRouter: Router = Router();

rankingRouter.use(verifyFirebaseToken);

rankingRouter.get("/", rankingController.getAll);

export default rankingRouter;
