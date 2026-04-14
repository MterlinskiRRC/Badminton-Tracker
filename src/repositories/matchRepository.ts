import { Match } from "../models/match";
import { InMemoryRepository } from "./inMemoryRepository";

// Match records use the same in-memory storage helper.
export class MatchRepository extends InMemoryRepository<Match> {}
