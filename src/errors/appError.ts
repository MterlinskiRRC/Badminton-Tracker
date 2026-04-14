import { HTTP_STATUS } from "../constants/httpStatus";

// Base application error with a status code and machine-readable code.
export class AppError extends Error {
    readonly code: string;

    readonly statusCode: number;

    constructor(message: string, code: string, statusCode: number) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

// Validation errors can include field-level details.
export class ValidationError extends AppError {
    readonly details?: string[];

    constructor(message: string, details?: string[]) {
        super(message, "VALIDATION_ERROR", HTTP_STATUS.BAD_REQUEST);
        this.details = details;
    }
}

// Authentication errors map to 401 responses.
export class AuthenticationError extends AppError {
    constructor(message: string, code = "AUTHENTICATION_ERROR") {
        super(message, code, HTTP_STATUS.UNAUTHORIZED);
    }
}

// Authorization errors map to 403 responses.
export class AuthorizationError extends AppError {
    constructor(message: string, code = "AUTHORIZATION_ERROR") {
        super(message, code, HTTP_STATUS.FORBIDDEN);
    }
}
