import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";

export function validateBody(schema: ObjectSchema): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        const validationResult: Joi.ValidationResult = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (validationResult.error) {
            res.status(400).json({
                message: "Validation failed",
                details: validationResult.error.details.map((detail) => detail.message),
            });
            return;
        }

        req.body = validationResult.value;
        next();
    };
}
