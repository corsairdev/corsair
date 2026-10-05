// Best-effort sync of fetched records into local entity tables so the
// documented `<entity>.search()` accessors return fetched data.
//
// Design rules:
// - Detail GETs await their write, so a completed fetch guarantees its record
//   is searchable locally (one local write; negligible latency).
// - Sync never fails a read: every store access is guarded, because the
//   entity accessor exists even when no database is configured (its methods
//   throw `Database not configured`), and storage itself can fail.
// - Lists sync in the background and merge stored-wins: each item is re-read
//   immediately before writing, so a concurrent detail fetch is preserved,
//   sparse list items enrich rather than erase, and responses never wait.

type EntityTable = {
	upsertByEntityId(id: string, record: never): Promise<unknown>;
	findByEntityId(id: string): Promise<unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

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
	try {
		await table.upsertByEntityId(id, record as never);
	} catch (error) {
		console.warn('Failed to sync entity to database:', error);
	}
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
	const sparse: Record<string, unknown>[] = [];
	for (const item of items) {
		if (isRecord(item) && typeof item.id === 'string') {
			sparse.push(item);
		}
	}
	if (sparse.length === 0) {
		return;
	}
	void (async () => {
		for (const item of sparse) {
			const id = item.id as string;
			try {
				// Fresh read at write time: a detail GET may have stored the
				// full record after the list response arrived.
				const current: unknown = await table.findByEntityId(id);
				const stored = isRecord(current) ? current.data : undefined;
				// Stored data wins every conflict, so sparse list fields can
				// only fill gaps and never erase fetched details.
				const merged = isRecord(stored) ? { ...item, ...stored } : { ...item };
				await table.upsertByEntityId(id, merged as never);
			} catch (error) {
				console.warn('Failed to sync list item to database:', error);
			}
		}
	})();
}
