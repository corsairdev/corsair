import type { z } from 'zod';

/**
 * Minimal structural view of a Corsair entity store. Only the operations these
 * endpoints need are declared, so the helpers stay usable whatever else the
 * concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/** The eviction half of the same store, needed only by the delete operations. */
type EntityEvictor = {
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

/**
 * The listing half, needed only to empty a collection after an account reset.
 *
 * Rows are the entity table's own shape, so the key is `entity_id` rather than
 * the `id` carried inside `data`.
 */
type EntityLister = EntityEvictor & {
	list: (options?: {
		limit?: number;
		offset?: number;
	}) => Promise<readonly { entity_id: string }[]>;
};

/** How many mirrored rows to read per page while emptying a collection. */
const CLEAR_PAGE_SIZE = 100;

/**
 * Mirroring is best-effort: a plugin call must not fail because the local copy
 * could not be written or removed.
 *
 * The exception is an eviction the caller declared **required** - see
 * {@link HabiticaMirrorEvictionError}.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[HABITICA] ${what}:`, error);
	}
}

/**
 * Raised when a record was deleted at Habitica but could not be removed from
 * the local mirror.
 *
 * Habitica **hard-deletes**. There is no soft delete, no `deleted_at` and no
 * "include deleted" listing anywhere in the API: a deleted task returns 404 on
 * the next read and simply vanishes from `GET /tasks/user`. So a mirrored row
 * that survives a delete is not merely stale, it describes something that no
 * longer exists on either side and cannot be refreshed back into agreement.
 *
 * Reporting that as a plain success would be wrong in the same way it is for
 * Loyverse customers: the remote half happened and the local half did not, and
 * only the caller can decide what to do about it. The message says both halves,
 * because retrying the delete will now 404 - what needs attention is the mirror.
 */
export class HabiticaMirrorEvictionError extends Error {
	constructor(
		readonly label: string,
		readonly entityId: string,
		readonly cause: unknown,
	) {
		super(
			`Habitica deleted the ${label} ${entityId}, but it could not be removed ` +
				`from the local mirror, which still holds it. The remote record is gone ` +
				`and does not need deleting again; the local copy does. ` +
				`Cause: ${cause instanceof Error ? cause.message : String(cause)}`,
		);
		this.name = 'HabiticaMirrorEvictionError';
	}
}

/**
 * How many cache writes may be in flight at once.
 *
 * `GET /tasks/user` returns every task the account has in one unpaginated
 * response, so this is not a page-sized batch - a long-lived account can return
 * hundreds of rows at once. The cap keeps the write-ahead without letting a
 * single call flood the database.
 */
const CACHE_WRITE_CONCURRENCY = 16;

/**
 * Derives the key a record is stored under.
 *
 * Every Habitica entity mirrored here is keyed by `id`, but the resolver stays
 * overridable rather than assumed - the API returns the same value under `_id`
 * as well, and a future entity may only carry one of the two.
 */
type EntityIdOf<T> = (parsed: T) => string | undefined;

/** Response-only / secret fields that must not be written to the mirror. */
const OMIT_FROM_CACHE: Record<string, ReadonlySet<string>> = {
	group: new Set(['chat']),
	webhook: new Set(['url']),
};

/**
 * Keeps declared schema keys only, minus fields the mirror must not store.
 *
 * Entities are `.loose()`, so `parsed.data` still carries unknown properties
 * and group `chat` / webhook `url`. The schema shape is the allowlist.
 */
function projectForCache<Schema extends z.ZodType>(
	schema: Schema,
	data: z.infer<Schema>,
	label: string,
): z.infer<Schema> {
	const shape = (schema as { shape?: Record<string, unknown> }).shape;
	if (!shape) return data;
	const omit = OMIT_FROM_CACHE[label];
	const src = data as Record<string, unknown>;
	const out: Record<string, unknown> = {};
	for (const key of Object.keys(shape)) {
		if (omit?.has(key) || !(key in src)) continue;
		out[key] = src[key];
	}
	return out as z.infer<Schema>;
}

const defaultEntityId = <T>(parsed: T): string | undefined => {
	const id = (parsed as { id?: unknown }).id;
	if (typeof id === 'string' || typeof id === 'number') return String(id);
	const mongoId = (parsed as { _id?: unknown })._id;
	return typeof mongoId === 'string' ? mongoId : undefined;
};

/**
 * Mirrors one record into the local cache.
 *
 * The record is validated against the entity schema first. A row Habitica
 * returns in a shape the schema does not recognise is skipped rather than
 * written, so the cache never holds something the rest of the plugin cannot
 * read back, and a schema gap shows up as a missing row rather than corrupt
 * data.
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
			`[HABITICA] skipped caching a ${options.label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}

	const entityId = (options.entityId ?? defaultEntityId)(parsed.data);
	if (!entityId) return;

	await safely(
		() =>
			store.upsertByEntityId(
				entityId,
				projectForCache(schema, parsed.data, options.label),
			),
		`failed to cache ${options.label} ${entityId}`,
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

/**
 * Drops a record from the local mirror after Habitica has deleted it.
 *
 * Pass `required: true` when leaving the row behind would breach something the
 * plugin promises rather than merely leave the cache stale.
 */
export async function evictEntity(
	store: EntityEvictor | undefined,
	entityId: string | number | undefined | null,
	label: string,
	options: { required?: boolean } = {},
): Promise<void> {
	if (!store || entityId == null) return;

	if (!options.required) {
		await safely(
			() => store.deleteByEntityId(String(entityId)),
			`failed to evict ${label} ${entityId}`,
		);
		return;
	}

	try {
		await store.deleteByEntityId(String(entityId));
	} catch (error) {
		console.error(
			`[HABITICA] required eviction of ${label} ${entityId} failed - the local mirror still holds it:`,
			error,
		);
		throw new HabiticaMirrorEvictionError(label, String(entityId), error);
	}
}

/**
 * Empties the mirrored task collection.
 *
 * This exists for one operation. `POST /user/reset` deletes **every** task on
 * the account in a single call - it is the account-wipe operation - and returns
 * the reset user rather than a list of what it removed. So there are no ids to
 * evict one by one, and an endpoint that mirrored tasks would otherwise leave
 * the entire previous task list sitting in local storage, answering lookups
 * with tasks that no longer exist anywhere.
 *
 * The store is emptied by listing what is mirrored and evicting each row. That
 * is more work than a truncate, but it goes through the same
 * `deleteByEntityId` surface the rest of this file uses, and it is a
 * once-in-an-account's-lifetime operation rather than a hot path.
 *
 * Failure is warned about rather than raised. Unlike a single delete, the
 * caller of a reset has not been handed an id they might act on, and the reset
 * itself genuinely succeeded; raising here would report the account wipe as
 * failed when it did not.
 */
export async function clearMirroredTasks(
	store: EntityLister | undefined,
): Promise<void> {
	if (!store) return;

	try {
		// Every id is collected before anything is deleted. Paging by offset
		// while deleting would renumber the rows underneath the cursor and skip
		// roughly half of them - the read has to finish before the writes start.
		const entityIds: string[] = [];
		for (let offset = 0; ; offset += CLEAR_PAGE_SIZE) {
			const page = await store.list({ limit: CLEAR_PAGE_SIZE, offset });
			for (const row of page) {
				if (row.entity_id) entityIds.push(row.entity_id);
			}
			if (page.length < CLEAR_PAGE_SIZE) break;
		}

		for (const entityId of entityIds) {
			await store.deleteByEntityId(entityId);
		}
	} catch (error) {
		console.warn(
			'[HABITICA] the account was reset but the mirrored task list could not be cleared; it now holds tasks that no longer exist:',
			error,
		);
	}
}
