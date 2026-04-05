import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { matchController } from "../services/dependencies";
import { matchSchemas } from "../validation/matchSchemas";

const matchRouter: Router = Router();

matchRouter.use(verifyFirebaseToken);

matchRouter.post("/", validateRequest(matchSchemas.create), matchController.create);
matchRouter.get("/", matchController.getAll);
matchRouter.get("/:id", validateRequest(matchSchemas.getById), matchController.getById);

export default matchRouter;
