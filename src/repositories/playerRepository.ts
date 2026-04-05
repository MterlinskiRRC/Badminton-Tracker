import { Player } from "../models/player";
import { FirestoreRepository } from "./firestoreRepository";

export class PlayerRepository extends FirestoreRepository<Player> {
	constructor() {
		super("players");
	}
}
