import { Router, Request, Response } from "express";

const healthRouter: Router = Router();

// Keep the health check public and lightweight.
healthRouter.get("/", (_req: Request, res: Response): void => {
    res.status(418).json({ status: "ok" });
});

export default healthRouter;
