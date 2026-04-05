import { AppError } from "../errors/appError";

export class HttpError extends AppError {
    constructor(statusCode: number, message: string) {
        super(message, "HTTP_ERROR", statusCode);
    }

    static badRequest(message: string): HttpError {
        return new HttpError(400, message);
    }

    static unauthorized(message: string): HttpError {
        return new HttpError(401, message);
    }

    static forbidden(message: string): HttpError {
        return new HttpError(403, message);
    }

    static notFound(message: string): HttpError {
        return new HttpError(404, message);
    }
}
