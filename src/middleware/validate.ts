import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationResult } from "joi";
import { ValidationError } from "../errors/appError";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripParams?: boolean;
    stripQuery?: boolean;
}

export function validateRequest(
    schemas: RequestSchemas,
    options: ValidationOptions = {}
): (req: Request, res: Response, next: NextFunction) => void {
    const finalOptions: Required<ValidationOptions> = {
        stripBody: true,
        stripParams: false,
        stripQuery: true,
        ...options,
    };

    return (req: Request, _res: Response, next: NextFunction): void => {
        const errors: string[] = [];

        const validatePart = (
            schema: ObjectSchema,
            data: unknown,
            partLabel: string,
            stripUnknown: boolean
        ): unknown => {
            const result: ValidationResult = schema.validate(data, {
                abortEarly: false,
                stripUnknown,
            });

            if (result.error) {
                errors.push(...result.error.details.map((detail) => `${partLabel}: ${detail.message}`));
                return data;
            }

            return stripUnknown ? result.value : data;
        };

        if (schemas.body) {
            req.body = validatePart(schemas.body, req.body, "Body", finalOptions.stripBody);
        }

        if (schemas.params) {
            req.params = validatePart(
                schemas.params,
                req.params,
                "Params",
                finalOptions.stripParams
            ) as Request["params"];
        }

        if (schemas.query) {
            req.query = validatePart(
                schemas.query,
                req.query,
                "Query",
                finalOptions.stripQuery
            ) as Request["query"];
        }

        if (errors.length > 0) {
            next(new ValidationError("Validation failed", errors));
            return;
        }

        next();
    };
}
