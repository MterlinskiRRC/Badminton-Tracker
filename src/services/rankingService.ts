import { Ranking } from "../models/ranking";
import { PlayerService } from "./playerService";

export class RankingService {
    constructor(private readonly playerService: PlayerService) {}

    async getRankings(): Promise<Ranking[]> {
        const players = await this.playerService.getAll();

        const sortedPlayers = [...players].sort((a, b): number => {
            const scoreDifference: number = this.calculateScore(b.totalWins, b.totalLosses) -
                this.calculateScore(a.totalWins, a.totalLosses);
            if (scoreDifference !== 0) {
                return scoreDifference;
            }

            return b.winPercentage - a.winPercentage;
        });

        return sortedPlayers.map((player, index): Ranking => ({
            playerId: player.id,
            playerName: player.name,
            rankingScore: this.calculateScore(player.totalWins, player.totalLosses),
            position: index + 1,
            totalWins: player.totalWins,
            totalLosses: player.totalLosses,
            winPercentage: player.winPercentage,
        }));
    }

    private calculateScore(totalWins: number, totalLosses: number): number {
        return totalWins * 3 - totalLosses;
    }
}
