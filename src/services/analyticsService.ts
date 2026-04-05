export interface AnalyticsSummary {
    matchesRecorded: number;
    mostActivePlayers: Array<{ playerId: string; matchCount: number }>;
}

export class AnalyticsService {
    matchesRecorded: number = 0;

    readonly playerActivity: Map<string, number> = new Map<string, number>();

    recordMatch(playerId: string, opponentId: string): void {
        this.matchesRecorded += 1;
        this.incrementPlayerActivity(playerId);
        this.incrementPlayerActivity(opponentId);
    }

    getSummary(): AnalyticsSummary {
        const mostActivePlayers: Array<{ playerId: string; matchCount: number }> =
            Array.from(this.playerActivity.entries())
                .map(([playerId, matchCount]: [string, number]) => ({ playerId, matchCount }))
                .sort(
                    (
                        a: { playerId: string; matchCount: number },
                        b: { playerId: string; matchCount: number }
                    ): number => b.matchCount - a.matchCount
                )
                .slice(0, 5);

        return {
            matchesRecorded: this.matchesRecorded,
            mostActivePlayers,
        };
    }

    incrementPlayerActivity(playerId: string): void {
        const currentValue: number = this.playerActivity.get(playerId) ?? 0;
        this.playerActivity.set(playerId, currentValue + 1);
    }
}
