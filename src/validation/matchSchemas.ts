import Joi from "joi";

export const createMatchSchema: Joi.ObjectSchema = Joi.object({
    playerId: Joi.string().trim().required(),
    opponentId: Joi.string().trim().required(),
    result: Joi.string().valid("win", "loss").required(),
    playedAt: Joi.string().isoDate().optional(),
});
