import Joi from "joi";

export const createPlayerSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().trim().min(2).max(60).required(),
});

export const updatePlayerSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().trim().min(2).max(60).optional(),
}).min(1);
