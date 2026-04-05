import { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "../services/analyticsService";
import { MatchService } from "../services/matchService";

export class MatchController {
    public constructor(
        private readonly matchService: MatchService,
        private readonly analyticsService: AnalyticsService
    ) {}

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        const matches = await this.matchService.getAll();
        res.status(200).json(matches);
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        const match = await this.matchService.getById(req.params.id);
        if (!match) {
            res.status(404).json({ message: "Match not found" });
            return;
        }

        res.status(200).json(match);
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const created = await this.matchService.create(req.body);
            this.analyticsService.recordMatch(created.playerId, created.opponentId);
            res.status(201).json(created);
        } catch (error: unknown) {
            next(error);
        }
    };
}
