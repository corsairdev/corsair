import type { z } from 'zod';

/**
 * Minimal structural view of a Corsair entity store. Only the operations the Formbricks
 * endpoints need are declared, so the helpers stay usable whatever else the concrete store
 * exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/** The eviction half of the same store, needed only by the delete operations. */
export type EntityEvictor = {
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

/**
 * Mirroring is best-effort: a plugin call must not fail because the local copy could not be
 * written or removed.
 *
 * The one exception is an eviction the caller declares **required** - see
 * {@link FormbricksMirrorEvictionError}.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[FORMBRICKS] ${what}:`, error);
	}
}

/**
 * Raised when a record was deleted at Formbricks but could not be removed from the local
 * mirror, and leaving it there would breach something the plugin promises.
 *
 * Webhooks are the case that matters here, and for an unusual reason: a webhook's create
 * response carries a signing `secret`. Even though {@link stripSecrets} keeps that out of the
 * mirror, a surviving webhook row still describes an integration the account believes it has
 * removed - including its target URL. Contact attribute keys matter too, because they are the
 * schema that makes respondent data legible.
 *
 * The message states both halves, because the remote change did happen and repeating it would
 * report not-found. What needs attention is the mirror.
 */
export class FormbricksMirrorEvictionError extends Error {
	constructor(
		readonly label: string,
		readonly entityId: string,
		readonly cause: unknown,
	) {
		super(
			`Formbricks removed the ${label} ${entityId}, but it could not be removed from the ` +
				`local mirror, which still holds its data. The remote change is already applied ` +
				`and does not need repeating; the local copy does. Cause: ` +
				`${cause instanceof Error ? cause.message : String(cause)}`,
		);
		this.name = 'FormbricksMirrorEvictionError';
	}
}

/**
 * How many cache writes may be in flight at once.
 *
 * A survey list is short, but a workspace's contact-attribute keys or a large team list is not,
 * and awaiting each write in turn makes the call take far longer than the request it followed.
 * The cap keeps the improvement without letting one call flood the database.
 */
const CACHE_WRITE_CONCURRENCY = 16;

/**
 * Fields that must never reach the local mirror, whatever the schema declares.
 *
 * `secret` is a webhook's signing key, returned **only** on the create response. The schema
 * declares it so that a caller can read it from the return value - it exists nowhere else - but
 * persisting it would copy a live credential into durable storage that no later read would even
 * refresh.
 *
 * Stripped here rather than at the call site so that no endpoint has to remember. A new endpoint
 * that mirrors a webhook is covered by default, which is the point.
 */
const NEVER_MIRRORED = ['secret'] as const;

/** Removes credential fields from a record before it is written to the mirror. */
export function stripSecrets<T>(record: T): T {
	if (record === null || typeof record !== 'object' || Array.isArray(record)) {
		return record;
	}
	const copy = { ...(record as Record<string, unknown>) };
	let removed = false;
	for (const field of NEVER_MIRRORED) {
		if (field in copy) {
			delete copy[field];
			removed = true;
		}
	}
	return removed ? (copy as T) : record;
}

/** Derives the key a record is stored under. */
type EntityIdOf<T> = (parsed: T) => string | undefined;

const defaultEntityId = <T>(parsed: T): string | undefined => {
	const id = (parsed as { id?: unknown }).id;
	return typeof id === 'string' || typeof id === 'number'
		? String(id)
		: undefined;
};

/**
 * Mirrors one record into the local cache.
 *
 * The record is validated against the entity schema first. A row Formbricks returns in a shape
 * the schema does not recognise is skipped rather than written, so the cache never holds
 * something the rest of the plugin cannot read back - and a schema gap shows up as a missing row
 * rather than as corrupt data.
 *
 * Nothing is evicted on a read. A survey or webhook that stops appearing in a list may be a
 * permissions change rather than a deletion, and the mirrored row keeps its value for resolving
 * the ids that existing responses reference. An explicit delete is the one case that evicts.
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
		// Silence would turn a schema gap into a row that simply never appears; the warning is
		// what makes it diagnosable.
		//
		// Only the path and the code are logged, never the issue objects. Several zod issue types
		// embed the offending **value**, so logging `error.issues` from a contact or response row
		// would put an email address into durable log output.
		console.warn(
			`[FORMBRICKS] skipped caching a ${options.label} that does not match its schema:`,
			parsed.error.issues.map((issue) => ({
				path: issue.path.join('.'),
				code: issue.code,
			})),
		);
		return;
	}

	const entityId = (options.entityId ?? defaultEntityId)(parsed.data);
	if (!entityId) return;

	await safely(
		() => store.upsertByEntityId(entityId, stripSecrets(parsed.data)),
		`failed to cache ${options.label} ${entityId}`,
	);
}

/**
 * Drops a record from the local mirror after Formbricks has removed it.
 *
 * Pass `required: true` when leaving the row behind would breach a promise rather than merely
 * leave the cache stale. A required eviction that fails raises
 * {@link FormbricksMirrorEvictionError} instead of warning, because a caller told "removed" is
 * entitled to assume the data is gone from both sides.
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
		// Logged as an error rather than a warning: this is data the account believes it has
		// removed still sitting in a queryable mirror.
		console.error(
			`[FORMBRICKS] required eviction of ${label} ${entityId} failed - the local mirror still holds it:`,
			error,
		);
		throw new FormbricksMirrorEvictionError(label, String(entityId), error);
	}
}

/** Mirrors many records, skipping any the schema rejects or that have no key. */
export async function cacheEntities<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	records: readonly unknown[] | undefined | null,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (!store || !records || records.length === 0) return;

	for (let i = 0; i < records.length; i += CACHE_WRITE_CONCURRENCY) {
		const batch = records.slice(i, i + CACHE_WRITE_CONCURRENCY);
		// `cacheEntity` swallows its own failures, so no write in a batch can reject and abandon
		// the rest.
		await Promise.all(
			batch.map((record) => cacheEntity(store, schema, record, options)),
		);
	}
}
