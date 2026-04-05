export interface Player {
    id: string;
    name: string;
    totalWins: number;
    totalLosses: number;
    winPercentage: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlayerInput {
    name: string;
}

export interface UpdatePlayerInput {
    name?: string;
}
