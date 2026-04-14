// Match records store the two players and the final result.
export type MatchResult = "win" | "loss";

export interface Match {
    id: string;
    playerId: string;
    opponentId: string;
    result: MatchResult;
    playedAt: string;
    createdAt: string;
}

export interface CreateMatchInput {
    playerId: string;
    opponentId: string;
    result: MatchResult;
    playedAt?: string;
}
