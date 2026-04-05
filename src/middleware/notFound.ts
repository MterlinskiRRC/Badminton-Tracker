import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { errorResponse } from "../models/responseModel";

export function notFoundHandler(_req: Request, res: Response): void {
    res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Route not found", "ROUTE_NOT_FOUND"));
}
