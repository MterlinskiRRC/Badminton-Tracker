import { Ranking } from "../models/ranking";
import { PlayerService } from "./playerService";

export class RankingService {
    constructor(private readonly playerService: PlayerService) {}

    async getRankings(): Promise<Ranking[]> {
        const allPlayers = await this.playerService.getAll();

        const rankedPlayers = [...allPlayers].sort((a, b) => {
            const scoreDifference = this.calculateScore(b.totalWins, b.totalLosses) - this.calculateScore(a.totalWins, a.totalLosses);
            if (scoreDifference !== 0) {
                return scoreDifference;
            }

            return b.winPercentage - a.winPercentage;
        });

        return rankedPlayers.map((player, index): Ranking => {
            const rankingScore = this.calculateScore(player.totalWins, player.totalLosses);

            return {
                playerId: player.id,
                playerName: player.name,
                rankingScore,
                position: index + 1,
                totalWins: player.totalWins,
                totalLosses: player.totalLosses,
                winPercentage: player.winPercentage,
            };
        });
    }

    private calculateScore(totalWins: number, totalLosses: number): number {
        return totalWins * 3 - totalLosses;
    }
}
