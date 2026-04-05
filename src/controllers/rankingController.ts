import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { successResponse } from "../models/responseModel";
import { RankingService } from "../services/rankingService";

export class RankingController {
    constructor(private readonly rankingService: RankingService) {}

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const rankings = await this.rankingService.getRankings();
        res.status(HTTP_STATUS.OK).json(successResponse(rankings));
    };
}
