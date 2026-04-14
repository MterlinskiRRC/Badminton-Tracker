import { getFirebaseAdmin } from "../config/firebase";

export interface BaseEntity {
    id: string;
}

export class FirestoreRepository<T extends BaseEntity> {
    private readonly collectionName: string;

    private allCache?: T[];

    private readonly byIdCache: Map<string, T | null> = new Map<string, T | null>();

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    async findAll(): Promise<T[]> {
        if (this.allCache) {
            return this.allCache;
        }

        const snapshot = await this.getCollection().get();
        const items: T[] = snapshot.docs.map((doc) => doc.data() as T);

        this.allCache = items;
        for (const item of items) {
            this.byIdCache.set(item.id, item);
        }

        return items;
    }

    async findById(id: string): Promise<T | null> {
        const cachedItem = this.byIdCache.get(id);
        if (cachedItem !== undefined) {
            return cachedItem;
        }

        const snapshot = await this.getCollection().doc(id).get();
        const item: T | null = snapshot.exists ? (snapshot.data() as T) : null;

        this.byIdCache.set(id, item);
        return item;
    }

    async create(entity: T): Promise<T> {
        await this.getCollection().doc(entity.id).set(entity);
        this.setCachedEntity(entity);
        return entity;
    }

    async update(id: string, patch: Partial<T>): Promise<T | null> {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }

        const updatedEntity: T = { ...existing, ...patch, id };
        await this.getCollection().doc(id).set(updatedEntity);
        this.setCachedEntity(updatedEntity);
        return updatedEntity;
    }

    async delete(id: string): Promise<boolean> {
        const snapshot = await this.getCollection().doc(id).get();
        if (!snapshot.exists) {
            return false;
        }

        await this.getCollection().doc(id).delete();
        this.invalidateCache(id);
        return true;
    }

    private getCollection() {
        return getFirebaseAdmin().firestore().collection(this.collectionName);
    }

    private setCachedEntity(entity: T): void {
        this.byIdCache.set(entity.id, entity);
        this.allCache = undefined;
    }

    private invalidateCache(id: string): void {
        this.byIdCache.delete(id);
        this.allCache = undefined;
    }
}