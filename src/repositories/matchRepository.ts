import { Match } from "../models/match";
import { InMemoryRepository } from "./inMemoryRepository";

export class MatchRepository extends InMemoryRepository<Match> {}
