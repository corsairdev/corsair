import type { z } from 'zod';

type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

type EntityEvictor = {
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

function asStore<T>(store: unknown): EntityStore<T> | undefined {
	if (!store || typeof store !== 'object') return undefined;
	const upsert = (store as EntityStore<T>).upsertByEntityId;
	return typeof upsert === 'function' ? (store as EntityStore<T>) : undefined;
}

function asEvictor(store: unknown): EntityEvictor | undefined {
	if (!store || typeof store !== 'object') return undefined;
	const del = (store as EntityEvictor).deleteByEntityId;
	return typeof del === 'function' ? (store as EntityEvictor) : undefined;
}

async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[SALESFORCE] ${what}:`, error);
	}
}

const CACHE_WRITE_CONCURRENCY = 16;

type EntityIdOf<T> = (parsed: T) => string | undefined;

const defaultEntityId = <T>(parsed: T): string | undefined => {
	const id =
		(parsed as { Id?: unknown; id?: unknown }).Id ??
		(parsed as { id?: unknown }).id;
	return typeof id === 'string' && id.length > 0 ? id : undefined;
};

/**
 * Mirrors one Salesforce record into the local cache after schema validation.
 */
export async function cacheEntity<Schema extends z.ZodType>(
	store: unknown,
	schema: Schema,
	record: unknown,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (record == null) return;
	const entityStore = asStore<z.infer<Schema>>(store);
	if (!entityStore) return;

	const parsed = schema.safeParse(record);
	if (!parsed.success) {
		console.warn(
			`[SALESFORCE] skipped caching a ${options.label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}

	const entityId = (options.entityId ?? defaultEntityId)(parsed.data);
	if (!entityId) return;

	await safely(
		() => entityStore.upsertByEntityId(entityId, parsed.data),
		`failed to cache ${options.label} ${entityId}`,
	);
}

export async function evictEntity(
	store: unknown,
	entityId: string | undefined | null,
	label: string,
): Promise<void> {
	const entityStore = asEvictor(store);
	if (!entityStore || entityId == null) return;

	await safely(
		() => entityStore.deleteByEntityId(entityId),
		`failed to evict ${label} ${entityId}`,
	);
}

export async function cacheEntities<Schema extends z.ZodType>(
	store: unknown,
	schema: Schema,
	records: readonly unknown[] | undefined | null,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (!records || records.length === 0) return;

	for (let i = 0; i < records.length; i += CACHE_WRITE_CONCURRENCY) {
		const batch = records.slice(i, i + CACHE_WRITE_CONCURRENCY);
		await Promise.all(
			batch.map((record) => cacheEntity(store, schema, record, options)),
		);
	}
}
