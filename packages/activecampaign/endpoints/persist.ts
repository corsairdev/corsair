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
/** Cap a child-eviction search so a parent cannot load an unbounded page. */
const SEARCH_LIMIT = 1000;

/**
 * The subset of the entity store these helpers use.
 *
 * Declared with method shorthand rather than function properties on purpose:
 * the real store types its `data` parameter as the specific entity, and under
 * property syntax TypeScript checks parameters contravariantly, so a store for
 * a concrete entity would not be assignable to a store for a generic row.
 * Method shorthand is bivariant, which is what lets one helper serve all 43
 * entities.
 */
type Store = {
	upsertByEntityId(entityId: string, data: never): Promise<unknown>;
	deleteByEntityId?(entityId: string): Promise<unknown>;
};

/**
 * The extra capability {@link evictChildren} needs: a search by stored field.
 * Kept separate from {@link Store} so the common helpers do not require it.
 */
type ChildStore = Store & {
	// `options` is deliberately `never` for the same reason `upsertByEntityId`
	// takes `never` above: the real store types this against its own entity
	// schema, and a wider parameter here would make no concrete store
	// assignable. The filter is built and cast at the call site below.
	search?(options: never): Promise<Array<{ entity_id?: string } | undefined>>;
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
		await store.upsertByEntityId(entityId, data as never);
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

/**
 * Removes every mirrored row that points at a deleted parent.
 *
 * Some deletions cascade upstream: removing a custom field destroys every
 * value stored against it, and removing a tag removes every contact-tag
 * association. Evicting only the parent would leave those children in the
 * mirror describing something that no longer exists, which is the same
 * staleness `evictRow` exists to prevent - just one level down.
 *
 * The store exposes `search`, so the children are found by their foreign key
 * and evicted individually. Best-effort throughout: a mirror that cannot be
 * cleaned must not fail the API call that already succeeded.
 */
export async function evictChildren(
	store: ChildStore | undefined,
	foreignKey: string,
	parentId: string,
	entityName: string,
): Promise<void> {
	if (!store?.search || !store.deleteByEntityId || !parentId) {
		return;
	}
	const remove = store.deleteByEntityId;

	try {
		const rows = await store.search({
			data: { [foreignKey]: parentId },
			limit: SEARCH_LIMIT,
		} as never);
		if (!Array.isArray(rows) || rows.length === 0) {
			return;
		}

		const ids: string[] = [];
		for (const row of rows) {
			const entityId = row?.entity_id;
			if (typeof entityId !== 'string' || entityId.length === 0) continue;
			ids.push(entityId);
		}

		for (let i = 0; i < ids.length; i += WRITE_CONCURRENCY) {
			const batch = ids.slice(i, i + WRITE_CONCURRENCY);
			await Promise.all(
				batch.map(async (entityId) => {
					try {
						await remove(entityId);
					} catch (error) {
						console.warn(
							`[ACTIVECAMPAIGN] Failed to evict ${entityName} ${entityId} after its parent was deleted:`,
							error,
						);
					}
				}),
			);
		}
	} catch (error) {
		console.warn(
			`[ACTIVECAMPAIGN] Could not look up ${entityName} rows to evict after a parent delete:`,
			error,
		);
	}
}
