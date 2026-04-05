import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { matchController } from "../services/dependencies";
import { createMatchSchema } from "../validation/matchSchemas";

const matchRouter: Router = Router();

matchRouter.post("/", verifyFirebaseToken, validateBody(createMatchSchema), matchController.create);
matchRouter.get("/", verifyFirebaseToken, matchController.getAll);
matchRouter.get("/:id", verifyFirebaseToken, matchController.getById);

export default matchRouter;
