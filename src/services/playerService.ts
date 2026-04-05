import { randomUUID } from "crypto";
import { CreatePlayerInput, Player, UpdatePlayerInput } from "../models/player";
import { PlayerRepository } from "../repositories/playerRepository";

export class PlayerService {
    readonly playerRepository: PlayerRepository;

    constructor(playerRepository: PlayerRepository) {
        this.playerRepository = playerRepository;
    }

    async getAll(): Promise<Player[]> {
        return this.playerRepository.findAll();
    }

    async getById(id: string): Promise<Player | null> {
        return this.playerRepository.findById(id);
    }

    async create(input: CreatePlayerInput): Promise<Player> {
        const now: string = new Date().toISOString();
        const player: Player = {
            id: randomUUID(),
            name: input.name,
            totalWins: 0,
            totalLosses: 0,
            winPercentage: 0,
            createdAt: now,
            updatedAt: now,
        };

        return this.playerRepository.create(player);
    }

    async update(id: string, input: UpdatePlayerInput): Promise<Player | null> {
        return this.playerRepository.update(id, {
            ...input,
            updatedAt: new Date().toISOString(),
        });
    }

    async delete(id: string): Promise<boolean> {
        return this.playerRepository.delete(id);
    }

    async applyMatchResult(playerId: string, didWin: boolean): Promise<Player | null> {
        const player: Player | null = await this.playerRepository.findById(playerId);
        if (!player) {
            return null;
        }

        const totalWins: number = didWin ? player.totalWins + 1 : player.totalWins;
        const totalLosses: number = didWin ? player.totalLosses : player.totalLosses + 1;
        const updatedPlayer: Partial<Player> = {
            totalWins,
            totalLosses,
            winPercentage: this.calculateWinPercentage(totalWins, totalLosses),
            updatedAt: new Date().toISOString(),
        };

        return this.playerRepository.update(playerId, updatedPlayer);
    }

    calculateWinPercentage(totalWins: number, totalLosses: number): number {
        const totalMatches: number = totalWins + totalLosses;
        if (totalMatches === 0) {
            return 0;
        }

        const rawPercentage: number = (totalWins / totalMatches) * 100;
        return Number(rawPercentage.toFixed(2));
    }
}
