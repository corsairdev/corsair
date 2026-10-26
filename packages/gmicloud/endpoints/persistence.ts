import type { PluginEntityClient } from 'corsair/orm';
import type { ZodTypeAny, z } from 'zod';

type Store<S extends ZodTypeAny> = PluginEntityClient<S> | undefined;

/**
 * Caches API objects by their id. A list returns fewer fields than a get, so
 * each write merges into the cached record instead of replacing it.
 * Persistence is a cache: a failure is logged and never fails the request.
 */
export async function saveRecords<S extends ZodTypeAny>(
	store: Store<S>,
	items: readonly (z.input<S> & { id?: string | null })[],
): Promise<void> {
	if (!store) return;
	try {
		for (const item of items) {
			if (!item.id) continue;
			const cached = await store.findByEntityId(item.id);
			await store.upsertByEntityId(
				item.id,
				Object.assign({}, cached?.data, item),
			);
		}
	} catch (error) {
		console.warn('Failed to save GMI Cloud records to database:', error);
	}
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
