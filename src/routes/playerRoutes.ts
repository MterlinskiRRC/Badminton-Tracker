import { Router } from "express";
import { requireRole, verifyFirebaseToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { playerController } from "../services/dependencies";
import { playerSchemas } from "../validation/playerSchemas";

const playerRouter: Router = Router();

playerRouter.use(verifyFirebaseToken);

playerRouter.post(
    "/",
    requireRole("admin"),
    validateRequest(playerSchemas.create),
    playerController.create
);
playerRouter.get("/", playerController.getAll);
playerRouter.get("/:id", validateRequest(playerSchemas.getById), playerController.getById);
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
