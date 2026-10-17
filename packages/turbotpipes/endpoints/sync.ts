// Best-effort sync of fetched records into local entity tables so the
// documented `<entity>.search()` accessors return fetched data.
//
// Design rules:
// - Detail GETs await their write, so a completed fetch guarantees its record
//   is searchable locally (one local write; negligible latency).
// - Sync never fails a read: every store access is guarded, because the
//   entity accessor exists even when no database is configured (its methods
//   throw `Database not configured`), and storage itself can fail.
// - Lists sync in the background with a single bulk existence check, and only
//   write records that are missing or gain new fields. Responses never wait,
//   sparse list items never overwrite fetched details, and steady-state lists
//   perform one bulk read with zero writes.

type EntityTable = {
	upsertByEntityId(id: string, record: never): Promise<unknown>;
	findManyByEntityIds(ids: string[]): Promise<unknown[]>;
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
		try {
			// One bulk read for the whole page: per-item lookups would keep
			// background synchronization busy on large pages.
			const existing = await table.findManyByEntityIds(
				sparse.map((item) => item.id as string),
			);
			const storedById = new Map<string, Record<string, unknown>>();
			for (const row of existing) {
				if (!isRecord(row) || typeof row.entity_id !== 'string') {
					continue;
				}
				const data = (row as { data?: unknown }).data;
				storedById.set(row.entity_id, isRecord(data) ? data : {});
			}
			for (const item of sparse) {
				// Each item is guarded on its own: one invalid item (for
				// example an id without the required handle) must not stop
				// the remaining valid items on the page from syncing.
				try {
					const id = item.id as string;
					const stored = storedById.get(id);
					if (!stored) {
						await table.upsertByEntityId(id, { ...item } as never);
						continue;
					}
					// Stored data wins every conflict: list fields only fill gaps
					// that stored details do not already cover.
					const merged = { ...stored };
					let changed = false;
					for (const [key, value] of Object.entries(item)) {
						if (!(key in merged)) {
							merged[key] = value;
							changed = true;
						}
					}
					// Skip the write when the stored record already covers the
					// list item, so repeated lists cost one bulk read and no writes.
					if (changed) {
						await table.upsertByEntityId(id, merged as never);
					}
				} catch (error) {
					console.warn('Failed to sync list item to database:', error);
				}
			}
		} catch (error) {
			console.warn('Failed to sync list items to database:', error);
		}
	})();
}
