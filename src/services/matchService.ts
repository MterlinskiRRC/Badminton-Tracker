import { randomUUID } from "crypto";
import { CreateMatchInput, Match } from "../models/match";
import { MatchRepository } from "../repositories/matchRepository";
import { HttpError } from "../utils/httpError";
import { PlayerService } from "./playerService";

export class MatchService {
    public constructor(
        private readonly matchRepository: MatchRepository,
        private readonly playerService: PlayerService
    ) {}

    public async getAll(): Promise<Match[]> {
        return this.matchRepository.findAll();
    }

    public async getById(id: string): Promise<Match | null> {
        return this.matchRepository.findById(id);
    }

    public async create(input: CreateMatchInput): Promise<Match> {
        if (input.playerId === input.opponentId) {
            throw new HttpError(400, "playerId and opponentId must be different");
        }

        const player = await this.playerService.getById(input.playerId);
        if (!player) {
            throw new HttpError(404, "Player not found");
        }

        const opponent = await this.playerService.getById(input.opponentId);
        if (!opponent) {
            throw new HttpError(404, "Opponent not found");
        }

        const now: string = new Date().toISOString();
        const match: Match = {
            id: randomUUID(),
            playerId: input.playerId,
            opponentId: input.opponentId,
            result: input.result,
            playedAt: input.playedAt ?? now,
            createdAt: now,
        };

        const createdMatch: Match = await this.matchRepository.create(match);

        await this.playerService.applyMatchResult(input.playerId, input.result === "win");
        await this.playerService.applyMatchResult(input.opponentId, input.result !== "win");

        return createdMatch;
    }
}
