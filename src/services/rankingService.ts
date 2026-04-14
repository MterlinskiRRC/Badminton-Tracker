import { Ranking } from "../models/ranking";
import { PlayerService } from "./playerService";

// Turn player records into a ranked leaderboard.
export class RankingService {
    playerService: PlayerService;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }

    async getRankings(): Promise<Ranking[]> {
        const allPlayers = await this.playerService.getAll();

        // Sort by ranking score first, then win percentage.
        const rankedPlayers = [...allPlayers].sort((a, b) => {
            const scoreDifference = this.calculateScore(b.totalWins, b.totalLosses) -
                this.calculateScore(a.totalWins, a.totalLosses);
            if (scoreDifference !== 0) {
                return scoreDifference;
            }

            return b.winPercentage - a.winPercentage;
        });

        return rankedPlayers.map((player, index): Ranking => ({
            playerId: player.id,
            playerName: player.name,
            rankingScore: this.calculateScore(player.totalWins, player.totalLosses),
            position: index + 1,
            totalWins: player.totalWins,
            totalLosses: player.totalLosses,
            winPercentage: player.winPercentage,
        }));
    }

    calculateScore(totalWins: number, totalLosses: number): number {
        // A simple score formula keeps rankings easy to understand.
        return totalWins * 3 - totalLosses;
    }
}
