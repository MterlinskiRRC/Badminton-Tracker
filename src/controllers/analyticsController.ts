import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { successResponse } from "../models/responseModel";
import { AnalyticsService } from "../services/analyticsService";

export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    getSummary = (_req: Request, res: Response): void => {
        const analyticsSummary = this.analyticsService.getSummary();
        res.status(HTTP_STATUS.OK).json(successResponse(analyticsSummary));
    };
}
