import { Match } from "../models/match";
import { FirestoreRepository } from "./firestoreRepository";

export class MatchRepository extends FirestoreRepository<Match> {
	constructor() {
		super("matches");
	}
}
