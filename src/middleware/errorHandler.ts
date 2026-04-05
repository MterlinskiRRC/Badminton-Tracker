import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }

    const message: string = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
}
