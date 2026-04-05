import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError, ValidationError } from "../errors/appError";
import { errorResponse } from "../models/responseModel";

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (error instanceof ValidationError) {
        res.status(error.statusCode).json({
            ...errorResponse(error.message, error.code),
            details: error.details,
        });
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message, error.code));
        return;
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
    );
}
