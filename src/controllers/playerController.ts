import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { successResponse } from "../models/responseModel";
import { PlayerService } from "../services/playerService";
import { HttpError } from "../utils/httpError";

export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const players = await this.playerService.getAll();
        res.status(HTTP_STATUS.OK).json(successResponse(players));
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const player = await this.playerService.getById(req.params.id);
        if (!player) {
            throw HttpError.notFound("Player not found");
        }

        res.status(HTTP_STATUS.OK).json(successResponse(player));
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const created = await this.playerService.create(req.body);
        res.status(HTTP_STATUS.CREATED).json(successResponse(created, "Player created"));
    };

    patch = async (req: Request, res: Response): Promise<void> => {
        const updated = await this.playerService.update(req.params.id, req.body);
        if (!updated) {
            throw HttpError.notFound("Player not found");
        }

        res.status(HTTP_STATUS.OK).json(successResponse(updated, "Player updated"));
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const deleted: boolean = await this.playerService.delete(req.params.id);
        if (!deleted) {
            throw HttpError.notFound("Player not found");
        }

        res.status(HTTP_STATUS.NO_CONTENT).send();
    };
}
