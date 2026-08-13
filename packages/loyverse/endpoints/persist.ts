import type { z } from 'zod';

/**
 * Minimal structural view of a Corsair entity store. Only the operations the
 * Loyverse endpoints need are declared, so the helpers stay usable whatever else
 * the concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/** The eviction half of the same store, needed only by the delete operations. */
type EntityEvictor = {
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

/**
 * Mirroring is best-effort: a plugin call must not fail because the local copy
 * could not be written or removed.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[LOYVERSE] ${what}:`, error);
	}
}

/**
 * How many cache writes may be in flight at once.
 *
 * A list page can hold up to 250 rows, and an item page carries its variants
 * inline, so awaiting each write in turn makes the call take far longer than the
 * request it followed. The cap keeps the improvement without letting one call
 * flood the database with hundreds of simultaneous writes.
 */
const CACHE_WRITE_CONCURRENCY = 16;

/**
 * Derives the key a record is stored under.
 *
 * Most Loyverse entities are keyed by a UUID `id`, but variants use
 * `variant_id`, so the resolver is overridable rather than assumed.
 */
type EntityIdOf<T> = (parsed: T) => string | undefined;

const defaultEntityId = <T>(parsed: T): string | undefined => {
	const id = (parsed as { id?: unknown }).id;
	return typeof id === 'number' || typeof id === 'string'
		? String(id)
		: undefined;
};

/** Variants are the one entity whose primary key is not called `id`. */
export const variantEntityId = (parsed: { variant_id?: string | null }) =>
	parsed.variant_id ?? undefined;

/**
 * Mirrors one record into the local cache.
 *
 * The record is validated against the entity schema first. A row Loyverse
 * returns in a shape the schema does not recognise is skipped rather than
 * written, so the cache never holds something the rest of the plugin cannot read
 * back - and a schema gap shows up as a missing row, not as corrupt data.
 *
 * Nothing is evicted on a read. Loyverse soft-deletes most records: a
 * soft-deleted row disappears from a plain list but is still returned by a list
 * with `show_deleted=true` and carries `deleted_at`. A
 * stale row therefore keeps its value for resolving historical references - a
 * receipt from last year names items that may since have been removed - and has
 * its status updated in place. An explicit delete is the one case that evicts;
 * see {@link evictEntity}.
 */
export async function cacheEntity<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	record: unknown,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (!store || record == null) return;

	const parsed = schema.safeParse(record);
	if (!parsed.success) {
		// Silence here would turn a schema gap into a row that simply never
		// appears; the warning is what makes it diagnosable.
		console.warn(
			`[LOYVERSE] skipped caching a ${options.label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}

	const entityId = (options.entityId ?? defaultEntityId)(parsed.data);
	if (!entityId) return;

	await safely(
		() => store.upsertByEntityId(entityId, parsed.data),
		`failed to cache ${options.label} ${entityId}`,
	);
}

/**
 * Drops a record from the local mirror after Loyverse has deleted it.
 *
 * For customers this is a correctness requirement rather than tidiness: Loyverse
 * does not soft-delete customers - the API documents this as a personal-data
 * restriction and the record carries `permanent_deletion_at` - so a mirrored row
 * left behind would outlive a record that no longer exists anywhere, and would
 * keep answering reads with personal data the account has deleted.
 *
 * For the soft-deleting entities eviction is still correct, though for a subtler
 * reason than "the record is gone". Loyverse is inconsistent about what a direct
 * read returns afterwards - 404 for items, modifiers, taxes and POS devices, but
 * 200 with `deleted_at` set for categories and suppliers - so a read is not a
 * reliable signal either way. What is consistent is that every deleted record
 * drops out of the default list, which is the view the mirror is meant to reflect.
 * Keeping the row would leave the cache answering with something the API no longer
 * volunteers.
 */
export async function evictEntity(
	store: EntityEvictor | undefined,
	entityId: string | number | undefined | null,
	label: string,
): Promise<void> {
	if (!store || entityId == null) return;

	await safely(
		() => store.deleteByEntityId(String(entityId)),
		`failed to evict ${label} ${entityId}`,
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
