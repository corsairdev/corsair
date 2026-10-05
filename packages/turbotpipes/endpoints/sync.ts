// Best-effort sync of fetched records into local entity tables so the
// documented `<entity>.search()` accessors return fetched data.
//
// Two rules keep sync safe:
// - Detail GETs await their write, so a completed fetch guarantees its record
//   is searchable locally (one local write; negligible latency).
// - Lists sync in the background and only insert records missing locally, so
//   list calls never wait on writes and sparse list items never overwrite
//   detailed stored records.

type EntityTable = {
	upsertByEntityId(id: string, record: never): Promise<unknown>;
	findManyByEntityIds(ids: string[]): Promise<unknown[]>;
};

// unknown: synced records are provider-defined objects without a fixed shape;
// each entity table validates its own columns on write.
export async function syncEntityDetail(
	table: EntityTable | null | undefined,
	id: string,
	record: unknown,
): Promise<void> {
	if (!table) {
		return;
	}
	await table.upsertByEntityId(id, record as never);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

// unknown: list items are provider-defined records; only string ids are used
// for discovery, and records pass through as never for table-validated writes.
export function syncListDiscovery(
	table: EntityTable | null | undefined,
	items: unknown,
): void {
	if (!table || !Array.isArray(items)) {
		return;
	}
	const ids: string[] = [];
	for (const item of items) {
		if (isRecord(item) && typeof item.id === 'string') {
			ids.push(item.id);
		}
	}
	if (ids.length === 0) {
		return;
	}
	void (async () => {
		try {
			const existing = await table.findManyByEntityIds(ids);
			const seen = new Set<string>();
			for (const row of existing) {
				if (isRecord(row) && typeof row.entity_id === 'string') {
					seen.add(row.entity_id);
				}
			}
			for (const item of items) {
				if (!isRecord(item) || typeof item.id !== 'string') {
					continue;
				}
				if (!seen.has(item.id)) {
					seen.add(item.id);
					await table.upsertByEntityId(item.id, item as never);
				}
			}
		} catch (error) {
			console.warn('Failed to sync list items to database:', error);
		}
	})();
}
