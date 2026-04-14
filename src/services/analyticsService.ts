export interface AnalyticsSummary {
    matchesRecorded: number;
    mostActivePlayers: Array<{ playerId: string; matchCount: number }>;
}

export class AnalyticsService {
    private matchesRecorded: number = 0;

    private readonly playerActivity: Map<string, number> = new Map();

    recordMatch(playerId: string, opponentId: string): void {
        this.matchesRecorded += 1;
        this.incrementActivity(playerId);
        this.incrementActivity(opponentId);
    }

    getSummary(): AnalyticsSummary {
        const mostActivePlayers = Array.from(this.playerActivity.entries())
            .map(([playerId, matchCount]) => ({ playerId, matchCount }))
            .sort((a, b) => b.matchCount - a.matchCount)
            .slice(0, 5);

        return {
            matchesRecorded: this.matchesRecorded,
            mostActivePlayers,
        };
    }

    private incrementActivity(playerId: string): void {
        const currentMatchCount = this.playerActivity.get(playerId) ?? 0;
        this.playerActivity.set(playerId, currentMatchCount + 1);
    }
}
