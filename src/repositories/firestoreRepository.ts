import { DocumentSnapshot, Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getFirestoreDb } from "../config/firebase";

export interface BaseEntity {
    id: string;
}

export class FirestoreRepository<T extends BaseEntity> {
    private readonly db: Firestore;

    constructor(private readonly collectionName: string) {
        this.db = getFirestoreDb();
    }

    async findAll(): Promise<T[]> {
        const snapshot = await this.db.collection(this.collectionName).get();

        return snapshot.docs.map((doc) => this.mapToEntity(doc));
    }

    async findById(id: string): Promise<T | null> {
        const snapshot = await this.db.collection(this.collectionName).doc(id).get();
        if (!snapshot.exists) {
            return null;
        }

        return this.mapToEntity(snapshot);
    }

    async create(entity: T): Promise<T> {
        await this.db.collection(this.collectionName).doc(entity.id).set(entity);
        return entity;
    }

    async update(id: string, patch: Partial<T>): Promise<T | null> {
        const docRef = this.db.collection(this.collectionName).doc(id);
        const existingSnapshot = await docRef.get();
        if (!existingSnapshot.exists) {
            return null;
        }

        await docRef.update(patch);
        const updatedSnapshot = await docRef.get();
        return this.mapToEntity(updatedSnapshot);
    }

    async delete(id: string): Promise<boolean> {
        const docRef = this.db.collection(this.collectionName).doc(id);
        const existingSnapshot = await docRef.get();
        if (!existingSnapshot.exists) {
            return false;
        }

        await docRef.delete();
        return true;
    }

    private mapToEntity(snapshot: QueryDocumentSnapshot | DocumentSnapshot): T {
        const data: Omit<T, "id"> = snapshot.data() as Omit<T, "id">;
        return {
            id: snapshot.id,
            ...data,
        } as T;
    }
}
