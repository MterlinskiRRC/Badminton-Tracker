import { randomUUID } from "crypto";
import { CreateMatchInput, Match } from "../models/match";
import { MatchRepository } from "../repositories/matchRepository";
import { HttpError } from "../utils/httpError";
import { PlayerService } from "./playerService";

export class MatchService {
    constructor(
        private readonly matchRepository: MatchRepository,
        private readonly playerService: PlayerService
    ) {}

    async getAll(): Promise<Match[]> {
        return this.matchRepository.findAll();
    }

    async getById(id: string): Promise<Match | null> {
        return this.matchRepository.findById(id);
    }

    async create(input: CreateMatchInput): Promise<Match> {
        if (input.playerId === input.opponentId) {
            throw HttpError.badRequest("playerId and opponentId must be different");
        }

        await this.ensurePlayerExists(input.playerId, "Player not found");
        await this.ensurePlayerExists(input.opponentId, "Opponent not found");

        const timestamp = new Date().toISOString();
        const match: Match = {
            id: randomUUID(),
            playerId: input.playerId,
            opponentId: input.opponentId,
            result: input.result,
            playedAt: input.playedAt ?? timestamp,
            createdAt: timestamp,
        };

        const persistedMatch = await this.matchRepository.create(match);

        await this.playerService.applyMatchResult(input.playerId, input.result === "win");
        await this.playerService.applyMatchResult(input.opponentId, input.result !== "win");

        return persistedMatch;
    }

    async ensurePlayerExists(playerId: string, errorMessage: string): Promise<void> {
        const player = await this.playerService.getById(playerId);
        if (!player) {
            throw HttpError.notFound(errorMessage);
        }
    }
}
