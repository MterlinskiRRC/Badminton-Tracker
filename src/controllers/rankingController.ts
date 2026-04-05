import { Request, Response } from "express";
import { RankingService } from "../services/rankingService";

export class RankingController {
    public constructor(private readonly rankingService: RankingService) {}

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        const rankings = await this.rankingService.getRankings();
        res.status(200).json(rankings);
    };
}
