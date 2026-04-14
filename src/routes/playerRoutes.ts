import { Router } from "express";
import { requirePlayerAuth, requireRole } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { playerController } from "../services/dependencies";
import { playerSchemas } from "../validation/playerSchemas";

const playerRouter: Router = Router();

// Protect player routes and validate request payloads.
playerRouter.post(
    "/",
    requirePlayerAuth(),
    validateRequest(playerSchemas.create),
    playerController.create
);
playerRouter.get("/", requirePlayerAuth(), playerController.getAll);
playerRouter.get("/:id", requirePlayerAuth(), validateRequest(playerSchemas.getById), playerController.getById);
playerRouter.patch(
    "/:id",
    requireRole("admin"),
    validateRequest(playerSchemas.patch),
    playerController.patch
);
playerRouter.delete(
    "/:id",
    requireRole("admin"),
    validateRequest(playerSchemas.delete),
    playerController.delete
);

export default playerRouter;
