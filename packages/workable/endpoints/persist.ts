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
	// unknown: store backends return varying driver metadata — never read.
	deleteByEntityId?(entityId: string): Promise<unknown>;
};

/** Validates a single row against its entity schema and caches it best-effort. */
export async function persistRow(
	store: Store | undefined,
	schema: z.ZodType,
	// unknown: wire JSON of unproven shape — validated with safeParse below.
	row: unknown,
	entityName: string,
): Promise<void> {
	if (!store || row === null || row === undefined) return;

	const parsed = schema.safeParse(row);
	if (!parsed.success) {
		console.warn(
			`[WORKABLE] Skipped caching a ${entityName} row that did not match the entity schema: ${parsed.error.issues
				.map((i) => `${i.path.join('.')}: ${i.message}`)
				.join('; ')}`,
		);
		return;
	}

	const data = parsed.data as Record<string, unknown>;
	// why safe: zod validated the row against the entity schema above, so
	// treating it as a string-keyed record to read `.id` cannot mis-shape it.
	const entityId = data.id;
	if (typeof entityId !== 'string' || entityId.length === 0) {
		console.warn(
			`[WORKABLE] Skipped caching a ${entityName} row with no usable id`,
		);
		return;
	}

	try {
		// why safe: `data` was zod-validated above; `never` only satisfies the
		// generic store signature — a cache write, skipped on failure below.
		await store.upsertByEntityId(entityId, data as never);
	} catch (error) {
		console.warn(`[WORKABLE] Failed to cache ${entityName}:`, error);
	}
}

/** Validates rows in bounded-concurrency batches and caches them best-effort. */
export async function persistRows(
	store: Store | undefined,
	schema: z.ZodType,
	// unknown: wire JSON of unproven shape — guarded with Array.isArray below.
	rows: unknown,
	entityName: string,
): Promise<void> {
	if (!store || !Array.isArray(rows) || rows.length === 0) return;

	for (let i = 0; i < rows.length; i += WRITE_CONCURRENCY) {
		const batch = rows.slice(i, i + WRITE_CONCURRENCY);
		await Promise.all(
			batch.map((row) => persistRow(store, schema, row, entityName)),
		);
	}
}

/** Removes a cached row best-effort (e.g. after a remote delete or merge). */
export async function evictRow(
	store: Store | undefined,
	entityId: string,
	entityName: string,
): Promise<void> {
	if (!store?.deleteByEntityId || !entityId) return;
	try {
		await store.deleteByEntityId(entityId);
	} catch (error) {
		console.warn(
			`[WORKABLE] Failed to evict ${entityName} ${entityId} from the cache:`,
			error,
		);
	}
}
