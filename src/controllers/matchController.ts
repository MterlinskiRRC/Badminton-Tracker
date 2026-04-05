import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { successResponse } from "../models/responseModel";
import { AnalyticsService } from "../services/analyticsService";
import { MatchService } from "../services/matchService";
import { HttpError } from "../utils/httpError";

export class MatchController {
    constructor(
        private readonly matchService: MatchService,
        private readonly analyticsService: AnalyticsService
    ) {}

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const matches = await this.matchService.getAll();
        res.status(HTTP_STATUS.OK).json(successResponse(matches));
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const match = await this.matchService.getById(req.params.id);
        if (!match) {
            throw HttpError.notFound("Match not found");
        }

        res.status(HTTP_STATUS.OK).json(successResponse(match));
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const created = await this.matchService.create(req.body);
        this.analyticsService.recordMatch(created.playerId, created.opponentId);
        res.status(HTTP_STATUS.CREATED).json(successResponse(created, "Match recorded"));
    };
}
