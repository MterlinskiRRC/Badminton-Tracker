import { Player } from "../models/player";
import { InMemoryRepository } from "./inMemoryRepository";

// Player records are stored in the shared in-memory map.
export class PlayerRepository extends InMemoryRepository<Player> {}
