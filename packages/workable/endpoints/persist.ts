import type { z } from 'zod';

/**
 * Cache helpers for the local Workable mirror.
 *
 * A row is validated against its entity schema before it is written, so an
 * unrecognised row is skipped rather than stored as something later reads
 * cannot interpret. Writes are best-effort: a plugin call must not fail
 * because the local mirror could not be written.
 */
const WRITE_CONCURRENCY = 16;

type Store = {
	// unknown: store backends return varying driver metadata — never read.
	upsertByEntityId(entityId: string, data: never): Promise<unknown>;
	// unknown: the stored row's data is read back only to keep its fields.
	findByEntityId?(entityId: string): Promise<{ data?: unknown } | null>;
	// unknown: store backends return varying driver metadata — never read.
	deleteByEntityId?(entityId: string): Promise<unknown>;
};

/** The entities this plugin mirrors locally (keys of WorkableSchema.entities). */
export type CachedEntity =
	| 'departments'
	| 'employees'
	| 'members'
	| 'jobs'
	| 'candidates';

/** The slice of the endpoint context the cache helpers read. */
type CacheContext = {
	db?: { readonly [K in CachedEntity]?: Store };
	$getAccountId?: () => Promise<string>;
};

/** A row that passed its entity schema, with its id pulled out. */
type ValidRow = {
	id: string;
	// unknown: zod-validated entity data, stored as is.
	data: Record<string, unknown>;
};

// Writes for one record run one after another. A write reads the stored row
// and writes it back merged, so two calls for the same record that overlap
// (a detail call and a list call, say) would otherwise both read the old row,
// and the later write would drop the fields the earlier one added.
//
// Chains are keyed by account, entity type and entity id, not by the entity
// client: each withTenant(...) call builds new clients, and two clients for
// the same account must still share one chain.
const writeChains = new Map<string, Promise<void>>();

function enqueueWrite(key: string, work: () => Promise<void>): Promise<void> {
	const previous = writeChains.get(key) ?? Promise.resolve();
	const run = previous.then(work, work);
	const settled = run.finally(() => {
		if (writeChains.get(key) === settled) {
			writeChains.delete(key);
		}
	});
	writeChains.set(key, settled);
	return run;
}

/** Number of records with a cache write still queued (for tests). */
export function pendingCacheWrites(): number {
	return writeChains.size;
}

/** Prefix of the write-chain key for one account and entity type. */
async function chainPrefix(
	ctx: CacheContext,
	entity: CachedEntity,
): Promise<string> {
	let account = 'unknown-account';
	try {
		account = (await ctx.$getAccountId?.()) ?? account;
	} catch {
		// No account row: the write itself fails and is logged below.
	}
	return `${account}\u0000${entity}\u0000`;
}

/** Validates a row against its entity schema; undefined when unusable. */
function validRow(
	schema: z.ZodType,
	// unknown: wire JSON of unproven shape — validated with safeParse below.
	row: unknown,
	entity: CachedEntity,
): ValidRow | undefined {
	if (row === null || row === undefined) return undefined;
	const parsed = schema.safeParse(row);
	if (!parsed.success) {
		console.warn(
			`[WORKABLE] Skipped caching a ${entity} row that did not match the entity schema: ${parsed.error.issues
				.map((i) => `${i.path.join('.')}: ${i.message}`)
				.join('; ')}`,
		);
		return undefined;
	}
	// why safe: zod validated the row against the entity schema above, so
	// treating it as a string-keyed record to read `.id` cannot mis-shape it.
	const data = parsed.data as Record<string, unknown>;
	const id = data.id;
	if (typeof id !== 'string' || id.length === 0) {
		console.warn(
			`[WORKABLE] Skipped caching a ${entity} row with no usable id`,
		);
		return undefined;
	}
	return { id, data };
}

/** Reads a cached row's data, or an empty object when there is none. */
async function readStoredData(
	store: Store,
	entityId: string,
	// unknown: the cached row's data is spread back unchanged, never inspected.
): Promise<Record<string, unknown>> {
	const existing = await store.findByEntityId?.(entityId);
	const data = existing?.data;
	return data && typeof data === 'object' && !Array.isArray(data)
		? // why safe: checked to be a non-array object just above.
			(data as Record<string, unknown>)
		: {};
}

/** Merges one validated row into its cached copy, in that record's turn. */
function writeMerged(
	store: Store,
	key: string,
	entity: CachedEntity,
	row: ValidRow,
): Promise<void> {
	return enqueueWrite(key, async () => {
		try {
			// Workable answers with different field sets for the same entity:
			// a list row is a summary of what the detail call returns, and the
			// member update response has no `active`. Keep the stored fields
			// the response leaves out instead of replacing the whole row. The
			// read runs inside this record's turn, so it sees every write
			// queued before it.
			const stored = await readStoredData(store, row.id);
			// why safe: `data` was zod-validated; `never` only satisfies the
			// generic store signature — a cache write, skipped on failure.
			await store.upsertByEntityId(row.id, {
				...stored,
				...row.data,
			} as never);
		} catch (error) {
			console.warn(`[WORKABLE] Failed to cache ${entity}:`, error);
		}
	});
}

/** Validates a single row against its entity schema and caches it best-effort. */
export async function persistRow(
	ctx: CacheContext,
	entity: CachedEntity,
	schema: z.ZodType,
	// unknown: wire JSON of unproven shape — validated before it is stored.
	row: unknown,
): Promise<void> {
	const store = ctx.db?.[entity];
	if (!store) return;
	const valid = validRow(schema, row, entity);
	if (!valid) return;
	const prefix = await chainPrefix(ctx, entity);
	await writeMerged(store, prefix + valid.id, entity, valid);
}

/** Validates rows in bounded-concurrency batches and caches them best-effort. */
export async function persistRows(
	ctx: CacheContext,
	entity: CachedEntity,
	schema: z.ZodType,
	// unknown: wire JSON of unproven shape — guarded with Array.isArray below.
	rows: unknown,
): Promise<void> {
	const store = ctx.db?.[entity];
	if (!store || !Array.isArray(rows) || rows.length === 0) return;
	const prefix = await chainPrefix(ctx, entity);

	for (let i = 0; i < rows.length; i += WRITE_CONCURRENCY) {
		const batch = rows.slice(i, i + WRITE_CONCURRENCY);
		await Promise.all(
			batch.map(async (row) => {
				const valid = validRow(schema, row, entity);
				if (valid) await writeMerged(store, prefix + valid.id, entity, valid);
			}),
		);
	}
}

/**
 * Removes a cached row best-effort (e.g. after a remote delete or merge). It
 * waits behind any write already queued for the record, so a write that
 * started earlier cannot land after the eviction and bring the row back.
 */
export async function evictRow(
	ctx: CacheContext,
	entity: CachedEntity,
	entityId: string,
): Promise<void> {
	const store = ctx.db?.[entity];
	if (!store?.deleteByEntityId || !entityId) return;
	const prefix = await chainPrefix(ctx, entity);
	await enqueueWrite(prefix + entityId, async () => {
		try {
			await store.deleteByEntityId?.(entityId);
		} catch (error) {
			console.warn(
				`[WORKABLE] Failed to evict ${entity} ${entityId} from the cache:`,
				error,
			);
		}
	});
}
