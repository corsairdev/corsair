// Best-effort sync of fetched records into local entity tables so the
// documented `<entity>.search()` accessors return fetched data.
//
// Sync is fire-and-forget on purpose: endpoint responses must never wait on
// local writes, and list responses are intentionally not synced — list items
// are sparse summaries that would overwrite detailed stored records.

type EntityTable = {
	upsertByEntityId(id: string, record: never): Promise<unknown>;
};

// unknown: synced records are provider-defined objects without a fixed shape;
// each entity table validates its own columns on write.
export function syncEntity(
	table: EntityTable | null | undefined,
	id: string,
	record: unknown,
): void {
	if (!table) {
		return;
	}
	void (async () => {
		try {
			await table.upsertByEntityId(id, record as never);
		} catch (error) {
			console.warn('Failed to sync entity to database:', error);
		}
	})();
}
