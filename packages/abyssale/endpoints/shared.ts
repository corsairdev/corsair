import type { AbyssaleContext } from '..';

type EntityClient = {
	upsertByEntityId?: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
};

/**
 * Mirrors an API result into the plugin cache. Best-effort: a caching failure
 * must never fail an otherwise successful API call.
 *
 * `ctx.db` narrows each client to its own entity schema; this helper is
 * entity-agnostic, so the map is widened through `unknown`.
 */
export async function cacheEntities(
	ctx: AbyssaleContext,
	entity: 'projects' | 'designs' | 'fonts',
	items: ReadonlyArray<{ id?: string }>,
): Promise<void> {
	const db = ctx.db as unknown as
		| Record<string, EntityClient | undefined>
		| undefined;
	const client = db?.[entity];
	if (!client?.upsertByEntityId) return;

	for (const item of items) {
		if (!item?.id) continue;
		try {
			await client.upsertByEntityId(item.id, item as Record<string, unknown>);
		} catch (error) {
			console.warn(`[abyssale] failed to cache ${entity} ${item.id}:`, error);
		}
	}
}
