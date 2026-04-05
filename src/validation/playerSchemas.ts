import Joi from "joi";

const idParamsSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().trim().required(),
});

export const playerSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().trim().min(2).max(60).required(),
        }),
    },
    getById: {
        params: idParamsSchema,
    },
    patch: {
        params: idParamsSchema,
        body: Joi.object({
            name: Joi.string().trim().min(2).max(60).optional(),
        }).min(1),
    },
    delete: {
        params: idParamsSchema,
    },
};
