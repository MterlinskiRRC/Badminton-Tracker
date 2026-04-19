import { Match } from "../models/match";
import { getFirebaseAdmin } from "../config/firebase";
import { InMemoryRepository } from "./inMemoryRepository";

// Match records are persisted to Firestore and mirrored in memory.
export class MatchRepository extends InMemoryRepository<Match> {
	// Centralizes collection selection and keeps Firestore access consistent.
	private getFirestoreCollection(): FirebaseFirestore.CollectionReference {
		return getFirebaseAdmin().firestore().collection("matches");
	}

	// Reads all match documents, then refreshes the in-memory mirror.
	async findAll(): Promise<Match[]> {
		const snapshot = await this.getFirestoreCollection().get();
		const matches: Match[] = snapshot.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Match, "id">),
		}));

		// Ensure cache matches Firestore after a full collection read.
		this.clearCache();
		for (const match of matches) {
			await super.create(match);
		}

		return matches;
	}

	// Uses the in-memory cache first, then falls back to Firestore on a miss.
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

	// Persists to Firestore first, then updates the local cache.
	async create(entity: Match): Promise<Match> {
		await this.getFirestoreCollection().doc(entity.id).set(entity);
		await super.create(entity);
		return entity;
	}

	// Merges a partial patch onto the stored entity while keeping ID immutable.
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

	// Deletes from both Firestore and cache; returns false when record is absent.
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
