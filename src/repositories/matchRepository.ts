import { Match } from "../models/match";
import { getFirebaseAdmin } from "../config/firebase";
import { InMemoryRepository } from "./inMemoryRepository";

// Match records are persisted to Firestore and mirrored in memory.
export class MatchRepository extends InMemoryRepository<Match> {
	private getFirestoreCollection() {
		return getFirebaseAdmin().firestore().collection("matches");
	}

	async findAll(): Promise<Match[]> {
		const snapshot = await this.getFirestoreCollection().get();
		const matches: Match[] = snapshot.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Match, "id">),
		}));

		this.clearCache();
		for (const match of matches) {
			await super.create(match);
		}

		return matches;
	}

	async findById(id: string): Promise<Match | null> {
		const cachedMatch = await super.findById(id);
		if (cachedMatch) {
			return cachedMatch;
		}

		const doc = await this.getFirestoreCollection().doc(id).get();
		if (!doc.exists) {
			return null;
		}

		const match: Match = {
			id: doc.id,
			...(doc.data() as Omit<Match, "id">),
		};

		await super.create(match);
		return match;
	}

	async create(entity: Match): Promise<Match> {
		await this.getFirestoreCollection().doc(entity.id).set(entity);
		await super.create(entity);
		return entity;
	}

	async update(id: string, patch: Partial<Match>): Promise<Match | null> {
		const existingDoc = await this.getFirestoreCollection().doc(id).get();
		if (!existingDoc.exists) {
			return null;
		}

		const existingMatch: Match = {
			id: existingDoc.id,
			...(existingDoc.data() as Omit<Match, "id">),
		};
		const updatedMatch: Match = { ...existingMatch, ...patch, id };

		await this.getFirestoreCollection().doc(id).set(updatedMatch);
		await super.create(updatedMatch);
		return updatedMatch;
	}

	async delete(id: string): Promise<boolean> {
		const doc = await this.getFirestoreCollection().doc(id).get();
		if (!doc.exists) {
			return false;
		}

		await this.getFirestoreCollection().doc(id).delete();
		await super.delete(id);
		return true;
	}
}
