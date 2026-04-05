export interface BaseEntity {
    id: string;
}

export class InMemoryRepository<T extends BaseEntity> {
    private readonly collection: Map<string, T> = new Map<string, T>();

    async findAll(): Promise<T[]> {
        return Array.from(this.collection.values());
    }

    async findById(id: string): Promise<T | null> {
        return this.collection.get(id) ?? null;
    }

    async create(entity: T): Promise<T> {
        this.collection.set(entity.id, entity);
        return entity;
    }

    async update(id: string, patch: Partial<T>): Promise<T | null> {
        const existing: T | undefined = this.collection.get(id);
        if (!existing) {
            return null;
        }

        const updatedEntity: T = { ...existing, ...patch, id };
        this.collection.set(id, updatedEntity);
        return updatedEntity;
    }

    async delete(id: string): Promise<boolean> {
        return this.collection.delete(id);
    }
}
