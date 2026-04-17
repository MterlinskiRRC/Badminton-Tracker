export interface BaseEntity {
    // All entities stored in this repository must expose a stable string ID.
    id: string;
}

// In-memory store used by the repository layer.
export class InMemoryRepository<T extends BaseEntity> {
    // Map key is the entity ID to provide O(1) lookup for CRUD operations.
    protected readonly collection: Map<string, T> = new Map<string, T>();

    // Returns all entities currently stored in insertion order.
    async findAll(): Promise<T[]> {
        return Array.from(this.collection.values());
    }

    // Returns null when the entity does not exist.
    async findById(id: string): Promise<T | null> {
        return this.collection.get(id) ?? null;
    }

    // Inserts or overwrites an entity using its ID as the key.
    async create(entity: T): Promise<T> {
        this.collection.set(entity.id, entity);
        return entity;
    }

    // Applies a partial update while preserving the original entity ID.
    async update(id: string, patch: Partial<T>): Promise<T | null> {
        const existing: T | undefined = this.collection.get(id);
        if (!existing) {
            return null;
        }

        // Explicitly keep `id` immutable even if the patch includes a different one.
        const updatedEntity: T = { ...existing, ...patch, id };
        this.collection.set(id, updatedEntity);
        return updatedEntity;
    }

    // Returns true only when an entity existed and was removed.
    async delete(id: string): Promise<boolean> {
        return this.collection.delete(id);
    }

    // Protected utility for tests/subclasses to reset repository state.
    protected clearCache(): void {
        this.collection.clear();
    }
}
