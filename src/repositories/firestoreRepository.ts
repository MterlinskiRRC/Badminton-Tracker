import { Firestore } from "firebase-admin/firestore";
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

        return snapshot.docs.map((doc) => {
            const data: Omit<T, "id"> = doc.data() as Omit<T, "id">;
            return {
                id: doc.id,
                ...data,
            } as T;
        });
    }

    async findById(id: string): Promise<T | null> {
        const snapshot = await this.db.collection(this.collectionName).doc(id).get();
        if (!snapshot.exists) {
            return null;
        }

        const data: Omit<T, "id"> = snapshot.data() as Omit<T, "id">;

        return {
            id: snapshot.id,
            ...data,
        } as T;
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
        const data: Omit<T, "id"> = updatedSnapshot.data() as Omit<T, "id">;

        return {
            id: updatedSnapshot.id,
            ...data,
        } as T;
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
}
