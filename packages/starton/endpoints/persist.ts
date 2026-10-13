/**
 * Best-effort write-through to the plugin database. A database failure must not
 * fail an API call that already succeeded at Starton, so errors are logged and
 * swallowed (same behaviour as the Linear plugin).
 */
type EntityStore<T> = {
	// Safe: the helper ignores the saved row, whose type varies by store.
	// A narrower type is not practical because the helper never reads the return value.
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

export async function persistEntities<T>(
	store: EntityStore<T> | undefined,
	entities: ReadonlyArray<{ entityId: string; data: T }>,
	label: string,
): Promise<void> {
	if (!store) return;
	try {
		for (const { entityId, data } of entities) {
			await store.upsertByEntityId(entityId, data);
		}
	} catch (error) {
		console.warn(`Failed to save Starton ${label} to database:`, error);
	}
}
