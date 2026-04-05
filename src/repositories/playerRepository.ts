import { Player } from "../models/player";
import { InMemoryRepository } from "./inMemoryRepository";

export class PlayerRepository extends InMemoryRepository<Player> {}
