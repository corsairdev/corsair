import type { z } from 'zod';

/**
 * Cache helpers for the local ActiveCampaign mirror.
 *
 * Two rules hold throughout:
 *
 * 1. A row is validated against its entity schema *before* it is written, so
 *    an unrecognised row is skipped rather than stored as something later
 *    reads cannot interpret. A skip warns - silence would turn a schema gap
 *    into a row that simply never appears.
 * 2. Writes are best-effort. A plugin call must not fail because the local
 *    mirror could not be written, so every write is wrapped and a failure only
 *    warns.
 */

/** A list page can run to hundreds of rows; cap the concurrent writes. */
const WRITE_CONCURRENCY = 16;

type Store = {
	upsertByEntityId: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/**
 * Validates and writes a single row.
 */
export async function persistRow(
	store: Store | undefined,
	schema: z.ZodType,
	row: unknown,
	entityName: string,
): Promise<void> {
	if (!store || row === null || row === undefined) {
		return;
	}

	const parsed = schema.safeParse(row);
	if (!parsed.success) {
		console.warn(
			`[ACTIVECAMPAIGN] Skipped caching a ${entityName} row that did not match the entity schema: ${parsed.error.issues
				.map((i) => `${i.path.join('.')}: ${i.message}`)
				.join('; ')}`,
		);
		return;
	}

	const data = parsed.data as Record<string, unknown>;
	const entityId = data.id;
	if (typeof entityId !== 'string' || entityId.length === 0) {
		console.warn(
			`[ACTIVECAMPAIGN] Skipped caching a ${entityName} row with no usable id`,
		);
		return;
	}

	try {
		await store.upsertByEntityId(entityId, data);
	} catch (error) {
		console.warn(`[ACTIVECAMPAIGN] Failed to cache ${entityName}:`, error);
	}
}

/**
 * Validates and writes a page of rows, bounded to {@link WRITE_CONCURRENCY}.
 */
export async function persistRows(
	store: Store | undefined,
	schema: z.ZodType,
	rows: unknown,
	entityName: string,
): Promise<void> {
	if (!store || !Array.isArray(rows) || rows.length === 0) {
		return;
	}

	for (let i = 0; i < rows.length; i += WRITE_CONCURRENCY) {
		const batch = rows.slice(i, i + WRITE_CONCURRENCY);
		await Promise.all(
			batch.map((row) => persistRow(store, schema, row, entityName)),
		);
	}
}

/**
 * Removes a row from the mirror after the record is deleted upstream.
 *
 * Reads deliberately do not evict: ActiveCampaign archives far more often than
 * it deletes, and a record that stops appearing in a filtered list is usually
 * still a real record. An explicit DELETE is different - it is permanent, and
 * leaving the row would let the mirror outlive the record it describes.
 */
export async function evictRow(
	store: Store | undefined,
	entityId: string,
	entityName: string,
): Promise<void> {
	if (!store?.deleteByEntityId || !entityId) {
		return;
	}
	try {
		await store.deleteByEntityId(entityId);
	} catch (error) {
		console.warn(
			`[ACTIVECAMPAIGN] Failed to evict ${entityName} ${entityId} from the cache:`,
			error,
		);
	}
}
