import { Request, Response } from "express";
import { AnalyticsService } from "../services/analyticsService";

export class AnalyticsController {
    public constructor(private readonly analyticsService: AnalyticsService) {}

    public getSummary = (_req: Request, res: Response): void => {
        const analyticsSummary = this.analyticsService.getSummary();
        res.status(200).json(analyticsSummary);
    };
}
