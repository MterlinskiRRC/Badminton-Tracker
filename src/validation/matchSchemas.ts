import Joi from "joi";

const idParamsSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().trim().required(),
});

export const matchSchemas = {
    create: {
        body: Joi.object({
            playerId: Joi.string().trim().required(),
            opponentId: Joi.string().trim().required(),
            result: Joi.string().valid("win", "loss").required(),
            playedAt: Joi.string().isoDate().optional(),
        }),
    },
    getById: {
        params: idParamsSchema,
    },
};
