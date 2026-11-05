import type { PluginEntityClient } from 'corsair/orm';
import type { ZodTypeAny, z } from 'zod';

type Store<S extends ZodTypeAny> = PluginEntityClient<S> | undefined;
type Item<S extends ZodTypeAny> = z.input<S> & { id?: string | null };

// Persistence is a cache: a failure is logged and never fails the request.
async function cache<S extends ZodTypeAny>(
	store: Store<S>,
	items: readonly Item<S>[],
	merge: boolean,
): Promise<void> {
	if (!store) return;
	try {
		for (const item of items) {
			if (!item.id) continue;
			const cached = merge ? await store.findByEntityId(item.id) : null;
			await store.upsertByEntityId(
				item.id,
				Object.assign({}, cached?.data, item),
			);
		}
	} catch (error) {
		console.warn('Failed to save GMI Cloud records to database:', error);
	}
}

/**
 * Caches full API objects by id, replacing the cached record. GMI omits
 * optional fields that have no value, so a merge would keep stale ones.
 */
export function saveRecords<S extends ZodTypeAny>(
	store: Store<S>,
	items: readonly Item<S>[],
): Promise<void> {
	return cache(store, items, false);
}

/** Caches partial API objects (list summaries) by merging into the cached record. */
export function mergeRecords<S extends ZodTypeAny>(
	store: Store<S>,
	items: readonly Item<S>[],
): Promise<void> {
	return cache(store, items, true);
}

/** Drops a cached record after the API deleted or released it. */
export async function forgetRecord<S extends ZodTypeAny>(
	store: Store<S>,
	id: string,
): Promise<void> {
	if (!store) return;
	try {
		await store.deleteByEntityId(id);
	} catch (error) {
		console.warn('Failed to remove GMI Cloud record from database:', error);
	}
}
