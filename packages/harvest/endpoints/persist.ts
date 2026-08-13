import type { z } from 'zod';

/**
 * Minimal structural view of a Corsair entity store. Only the operation the
 * Harvest endpoints need is declared, so the helper stays usable whatever else
 * the concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/**
 * Caching is best-effort: a plugin call must not fail because the local mirror
 * could not be written.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[HARVEST] failed to cache ${what}:`, error);
	}
}

/**
 * How many cache writes may be in flight at once.
 *
 * A list call can return up to 2000 rows in one page, and awaiting each write
 * in turn makes that call take far longer than the request it followed. The cap
 * keeps the improvement without letting one call flood the database with
 * thousands of simultaneous writes.
 */
const CACHE_WRITE_CONCURRENCY = 16;

/**
 * Derives the key a record is stored under.
 *
 * Everything Harvest exposes is keyed by a numeric `id` except company
 * settings, which are a per-account singleton with no id — hence the override.
 */
type EntityIdOf<T> = (parsed: T) => string | undefined;

const defaultEntityId = <T>(parsed: T): string | undefined => {
	const id = (parsed as { id?: unknown }).id;
	return typeof id === 'number' || typeof id === 'string'
		? String(id)
		: undefined;
};

/**
 * Mirrors one record into the local cache.
 *
 * The record is validated against the entity schema first. A row Harvest
 * returns in a shape the schema does not recognise is skipped rather than
 * written, so the cache never holds something the rest of the plugin cannot
 * read back — and a schema gap shows up as a missing row, not as corrupt data.
 *
 * Nothing here is ever evicted. Harvest archives rather than deletes — a client
 * or project that stops being used comes back with `is_active: false` instead
 * of disappearing — so a stale row keeps its value for resolving historical
 * references and has its status updated in place.
 */
export async function cacheEntity<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	record: unknown,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (!store || record == null) return;

	const parsed = schema.safeParse(record);
	if (!parsed.success) return;

	const entityId = (options.entityId ?? defaultEntityId)(parsed.data);
	if (!entityId) return;

	await safely(
		() => store.upsertByEntityId(entityId, parsed.data),
		`${options.label} ${entityId}`,
	);
}

/**
 * Mirrors many records, skipping any the schema rejects or that have no key.
 */
export async function cacheEntities<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	records: readonly unknown[] | undefined | null,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (!store || !records || records.length === 0) return;

	for (let i = 0; i < records.length; i += CACHE_WRITE_CONCURRENCY) {
		const batch = records.slice(i, i + CACHE_WRITE_CONCURRENCY);
		// `cacheEntity` swallows its own failures, so no write in a batch can
		// reject and abandon the rest.
		await Promise.all(
			batch.map((record) => cacheEntity(store, schema, record, options)),
		);
	}
}
