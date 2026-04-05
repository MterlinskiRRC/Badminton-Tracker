import { AnalyticsController } from "../controllers/analyticsController";
import { MatchController } from "../controllers/matchController";
import { PlayerController } from "../controllers/playerController";
import { RankingController } from "../controllers/rankingController";
import { MatchRepository } from "../repositories/matchRepository";
import { PlayerRepository } from "../repositories/playerRepository";
import { AnalyticsService } from "./analyticsService";
import { MatchService } from "./matchService";
import { PlayerService } from "./playerService";
import { RankingService } from "./rankingService";

const playerRepository: PlayerRepository = new PlayerRepository();
const matchRepository: MatchRepository = new MatchRepository();

export const playerService: PlayerService = new PlayerService(playerRepository);
export const matchService: MatchService = new MatchService(matchRepository, playerService);
export const rankingService: RankingService = new RankingService(playerService);
export const analyticsService: AnalyticsService = new AnalyticsService();

export const playerController: PlayerController = new PlayerController(playerService);
export const matchController: MatchController = new MatchController(matchService, analyticsService);
export const rankingController: RankingController = new RankingController(rankingService);
export const analyticsController: AnalyticsController = new AnalyticsController(analyticsService);
