export interface AnalyticsSummary {
    matchesRecorded: number;
    mostActivePlayers: Array<{ playerId: string; matchCount: number }>;
}

type PlayerActivityEntry = { playerId: string; matchCount: number };

export class AnalyticsService {
    matchesRecorded: number = 0;

    playerActivity: Map<string, number> = new Map();

    recordMatch(playerId: string, opponentId: string): void {
        this.matchesRecorded += 1;
        [playerId, opponentId].forEach((id) => {
            const currentValue = this.playerActivity.get(id) ?? 0;
            this.playerActivity.set(id, currentValue + 1);
        });
    }

    getSummary(): AnalyticsSummary {
        const mostActivePlayers: PlayerActivityEntry[] =
            Array.from(this.playerActivity.entries())
                .map(([playerId, matchCount]) => ({ playerId, matchCount }))
                .sort((a, b) => b.matchCount - a.matchCount)
                .slice(0, 5);

        return {
            matchesRecorded: this.matchesRecorded,
            mostActivePlayers,
        };
    }
}
