import { Router } from "express";
import { requireRole, verifyFirebaseToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { playerController } from "../services/dependencies";
import { createPlayerSchema, updatePlayerSchema } from "../validation/playerSchemas";

const playerRouter: Router = Router();

playerRouter.post(
    "/",
    verifyFirebaseToken,
    requireRole("admin"),
    validateBody(createPlayerSchema),
    playerController.create
);
playerRouter.get("/", verifyFirebaseToken, playerController.getAll);
playerRouter.get("/:id", verifyFirebaseToken, playerController.getById);
playerRouter.patch(
    "/:id",
    verifyFirebaseToken,
    requireRole("admin"),
    validateBody(updatePlayerSchema),
    playerController.patch
);
playerRouter.delete("/:id", verifyFirebaseToken, requireRole("admin"), playerController.delete);

export default playerRouter;
