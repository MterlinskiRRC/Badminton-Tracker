import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { successResponse } from "../models/responseModel";

const healthRouter: Router = Router();

// Keep the health check public and lightweight.
healthRouter.get("/", (_req: Request, res: Response): void => {
    res.status(HTTP_STATUS.OK).json(successResponse({ status: "ok" }));
});

export default healthRouter;
