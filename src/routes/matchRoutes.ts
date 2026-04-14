import { Router } from "express";
import { requirePlayerAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { matchController } from "../services/dependencies";
import { matchSchemas } from "../validation/matchSchemas";

const matchRouter: Router = Router();

// Protect match routes and validate request payloads.
matchRouter.post("/", requirePlayerAuth(), validateRequest(matchSchemas.create), matchController.create);
matchRouter.get("/", requirePlayerAuth(), matchController.getAll);
matchRouter.get("/:id", requirePlayerAuth(), validateRequest(matchSchemas.getById), matchController.getById);

export default matchRouter;
