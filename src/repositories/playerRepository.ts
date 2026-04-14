import { Player } from "../models/player";
import { getFirebaseAdmin } from "../config/firebase";
import { InMemoryRepository } from "./inMemoryRepository";

// Player records are persisted to Firestore and mirrored in memory.
export class PlayerRepository extends InMemoryRepository<Player> {
	private getFirestoreCollection() {
		return getFirebaseAdmin().firestore().collection("players");
	}

	async findAll(): Promise<Player[]> {
		const snapshot = await this.getFirestoreCollection().get();
		const players: Player[] = snapshot.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Player, "id">),
		}));

		this.clearCache();
		for (const player of players) {
			await super.create(player);
		}

		return players;
	}

	async findById(id: string): Promise<Player | null> {
		const cachedPlayer = await super.findById(id);
		if (cachedPlayer) {
			return cachedPlayer;
		}

		const doc = await this.getFirestoreCollection().doc(id).get();
		if (!doc.exists) {
			return null;
		}

		const player: Player = {
			id: doc.id,
			...(doc.data() as Omit<Player, "id">),
		};

		await super.create(player);
		return player;
	}

	async create(entity: Player): Promise<Player> {
		await this.getFirestoreCollection().doc(entity.id).set(entity);
		await super.create(entity);
		return entity;
	}

	async update(id: string, patch: Partial<Player>): Promise<Player | null> {
		const existingDoc = await this.getFirestoreCollection().doc(id).get();
		if (!existingDoc.exists) {
			return null;
		}

		const existingPlayer: Player = {
			id: existingDoc.id,
			...(existingDoc.data() as Omit<Player, "id">),
		};
		const updatedPlayer: Player = { ...existingPlayer, ...patch, id };

		await this.getFirestoreCollection().doc(id).set(updatedPlayer);
		await super.create(updatedPlayer);
		return updatedPlayer;
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
