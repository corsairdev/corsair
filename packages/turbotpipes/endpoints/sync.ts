// Best-effort sync of fetched records into local entity tables so the
// documented `<entity>.search()` accessors return fetched data.
//
// Design rules:
// - Detail GETs await their write, so a completed fetch guarantees its record
//   is searchable locally (one local write; negligible latency).
// - Sync never fails a read: it is skipped when no database is configured,
//   and every store access is guarded because storage itself can fail.
// - Writes go through the entity client (`ctx.db`), which seals rows when the
//   app turns on encryptDataAtRest.
// - Lists sync in the background with a single bulk existence check, and only
//   write records that are missing or gain new fields. Responses never wait,
//   sparse list items never overwrite fetched details (writes for one record
//   are serialized and a list write re-reads first), and steady-state lists
//   perform one bulk read with zero writes.

type EntityTable = {
	upsertByEntityId(id: string, record: never): Promise<unknown>;
	findManyByEntityIds(ids: string[]): Promise<unknown[]>;
	findByEntityId(id: string): Promise<unknown>;
};

// Only `database` is read: without one, the entity accessor exists but every
// write throws `Database not configured`, so sync is skipped instead of
// warning on each call.
type SyncContext = { database?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function storedData(row: unknown): Record<string, unknown> | undefined {
	if (!isRecord(row)) {
		return undefined;
	}
	const data = row.data;
	return isRecord(data) ? data : {};
}

// Writes for one record run one after another. A list write re-reads the row
// inside its turn, so a detail GET that lands between the list's bulk read and
// its write is merged into, not overwritten by the sparse list item.
const writeChains = new WeakMap<EntityTable, Map<string, Promise<void>>>();

function enqueueWrite(
	table: EntityTable,
	id: string,
	work: () => Promise<void>,
): Promise<void> {
	let chains = writeChains.get(table);
	if (!chains) {
		chains = new Map();
		writeChains.set(table, chains);
	}
	const previous = chains.get(id) ?? Promise.resolve();
	const run = previous.then(work, work);
	const settled = run.finally(() => {
		if (chains.get(id) === settled) {
			chains.delete(id);
		}
	});
	chains.set(id, settled);
	return run;
}

// Stored data wins every conflict: list fields only fill gaps that stored
// details do not already cover. Returns undefined when nothing would change.
function fillGaps(
	stored: Record<string, unknown> | undefined,
	item: Record<string, unknown>,
): Record<string, unknown> | undefined {
	if (!stored) {
		return { ...item };
	}
	const merged = { ...stored };
	let changed = false;
	for (const [key, value] of Object.entries(item)) {
		if (!(key in merged)) {
			merged[key] = value;
			changed = true;
		}
	}
	return changed ? merged : undefined;
}

// unknown: synced records are provider-defined objects without a fixed shape;
// each entity table validates its own columns on write.
export async function syncEntityDetail(
	ctx: SyncContext,
	table: EntityTable | null | undefined,
	id: string,
	record: unknown,
): Promise<void> {
	if (!ctx.database || !table) {
		return;
	}
	await enqueueWrite(table, id, async () => {
		try {
			await table.upsertByEntityId(id, record as never);
		} catch (error) {
			console.warn('Failed to sync entity to database:', error);
		}
	});
}

// unknown: list items are provider-defined records; only string ids are used
// for discovery, and records pass through as never for table-validated writes.
export function syncListDiscovery(
	ctx: SyncContext,
	table: EntityTable | null | undefined,
	items: unknown,
): void {
	if (!ctx.database || !table || !Array.isArray(items)) {
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
			// One bulk read for the whole page picks the items that need a
			// write, so repeated lists cost one read and no writes.
			const existing = await table.findManyByEntityIds(
				sparse.map((item) => item.id as string),
			);
			const storedById = new Map<string, Record<string, unknown>>();
			for (const row of existing) {
				if (isRecord(row) && typeof row.entity_id === 'string') {
					storedById.set(row.entity_id, storedData(row) ?? {});
				}
			}
			for (const item of sparse) {
				const id = item.id as string;
				if (!fillGaps(storedById.get(id), item)) {
					continue;
				}
				// Each item is guarded on its own: one invalid item (for
				// example an id without the required handle) must not stop
				// the remaining valid items on the page from syncing.
				await enqueueWrite(table, id, async () => {
					try {
						// Re-read in this record's turn: the bulk read may be
						// older than a detail write that finished since.
						const merged = fillGaps(
							storedData(await table.findByEntityId(id)),
							item,
						);
						if (merged) {
							await table.upsertByEntityId(id, merged as never);
						}
					} catch (error) {
						console.warn('Failed to sync list item to database:', error);
					}
				});
			}
		} catch (error) {
			console.warn('Failed to sync list items to database:', error);
		}
	})();
}
