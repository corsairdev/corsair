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

import type { TurbotPipesSchema } from '../schema';

// unknown: entity clients are typed per entity; sync only reads results back
// as plain records (narrowed with isRecord), so their row types are not needed.
type EntityTable = {
	upsertByEntityId(id: string, record: never): Promise<unknown>;
	findManyByEntityIds(ids: string[]): Promise<unknown[]>;
	findByEntityId(id: string): Promise<unknown>;
	deleteByEntityId(id: string): Promise<boolean>;
	// never: each entity types its own search filter; callers pass a handle filter.
	search(options: never): Promise<unknown[]>;
	list(): Promise<unknown[]>;
};

export type SyncedEntity = keyof typeof TurbotPipesSchema.entities;

type SyncContext = {
	// unknown: only presence matters. Without a database the entity accessor
	// exists but every write throws `Database not configured`, so sync is
	// skipped instead of warning on each call.
	database?: unknown;
	db?: { readonly [K in SyncedEntity]?: EntityTable };
	$getAccountId: () => Promise<string>;
};

// unknown: rows and items are provider records of any shape; this guard is
// what narrows them before any field is read.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

// unknown: a stored row is read back untyped and narrowed here.
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
//
// Chains are keyed by account, entity type and entity id, not by the entity
// client: each withTenant(...) call builds new clients, and two clients for
// the same account must still share one chain.
const writeChains = new Map<string, Promise<void>>();

function enqueueWrite(key: string, work: () => Promise<void>): Promise<void> {
	const previous = writeChains.get(key) ?? Promise.resolve();
	const run = previous.then(work, work);
	const settled = run.finally(() => {
		if (writeChains.get(key) === settled) {
			writeChains.delete(key);
		}
	});
	writeChains.set(key, settled);
	return run;
}

// Records deleted recently, by write-chain key. A list that was already in
// flight when the delete ran carries the deleted record, and its write would
// queue after the delete and bring the row back. Pipes never reuses an id (a
// recreated workspace or org gets a new one), so list discovery skips these
// ids for a while. A detail fetch is authoritative and clears the mark.
const DELETED_TTL_MS = 10 * 60 * 1000;
const recentlyDeleted = new Map<string, number>();

function markDeleted(key: string): void {
	const now = Date.now();
	recentlyDeleted.delete(key);
	recentlyDeleted.set(key, now);
	// Insertion order is deletion order, so expired marks sit at the front.
	for (const [staleKey, deletedAt] of recentlyDeleted) {
		if (now - deletedAt <= DELETED_TTL_MS) break;
		recentlyDeleted.delete(staleKey);
	}
}

function wasRecentlyDeleted(key: string): boolean {
	const deletedAt = recentlyDeleted.get(key);
	if (deletedAt === undefined) return false;
	if (Date.now() - deletedAt > DELETED_TTL_MS) {
		recentlyDeleted.delete(key);
		return false;
	}
	return true;
}

/** Number of records with a write still queued (for tests). */
export function pendingWriteChains(): number {
	return writeChains.size;
}

type SyncTarget = {
	table: EntityTable;
	keyFor: (id: string) => string;
};

// Resolves the entity table and the account the write belongs to. Returns
// undefined (sync skipped) without a database, table or account.
async function syncTarget(
	ctx: SyncContext,
	entity: SyncedEntity,
): Promise<SyncTarget | undefined> {
	const table = ctx.db?.[entity];
	if (!ctx.database || !table) {
		return undefined;
	}
	let accountId: string;
	try {
		accountId = await ctx.$getAccountId();
	} catch (error) {
		console.warn('Skipped entity sync: no account for this tenant:', error);
		return undefined;
	}
	return { table, keyFor: (id) => `${accountId}\u0000${entity}\u0000${id}` };
}

// Stored data wins every conflict: list fields only fill gaps that stored
// details do not already cover. Returns undefined when nothing would change.
// unknown: both sides are provider records of any shape, merged key by key.
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
	entity: SyncedEntity,
	id: string,
	record: unknown,
): Promise<void> {
	const target = await syncTarget(ctx, entity);
	if (!target) {
		return;
	}
	const key = target.keyFor(id);
	// Pipes just returned this record, so it exists upstream.
	recentlyDeleted.delete(key);
	await enqueueWrite(key, async () => {
		try {
			await target.table.upsertByEntityId(id, record as never);
		} catch (error) {
			console.warn('Failed to sync entity to database:', error);
		}
	});
}

// unknown: list items are provider-defined records; only string ids are used
// for discovery, and records pass through as never for table-validated writes.
export function syncListDiscovery(
	ctx: SyncContext,
	entity: SyncedEntity,
	items: unknown,
): void {
	if (!ctx.database || !ctx.db?.[entity] || !Array.isArray(items)) {
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
			const target = await syncTarget(ctx, entity);
			if (!target) {
				return;
			}
			const { table, keyFor } = target;
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
				if (
					wasRecentlyDeleted(keyFor(id)) ||
					!fillGaps(storedById.get(id), item)
				) {
					continue;
				}
				// Each item is guarded on its own: one invalid item (for
				// example an id without the required handle) must not stop
				// the remaining valid items on the page from syncing.
				await enqueueWrite(keyFor(id), async () => {
					try {
						// A delete may have run while this list waited its turn.
						if (wasRecentlyDeleted(keyFor(id))) return;
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

/**
 * Removes the local copy of a record Pipes just deleted. Matches by id (from
 * the delete response) and, when given, by handle, since a 204 delete returns
 * no id. Runs in the record's write chain and marks the id as recently
 * deleted, so neither a queued list write nor one from a list that was still
 * in flight can re-insert it. Never fails the delete that already succeeded.
 */
export async function removeLocalEntity(
	ctx: SyncContext,
	entity: SyncedEntity,
	match: { id?: unknown; handle?: string },
): Promise<void> {
	const target = await syncTarget(ctx, entity);
	if (!target) {
		return;
	}
	const { table, keyFor } = target;
	try {
		const ids = new Set<string>();
		if (typeof match.id === 'string' && match.id) {
			ids.add(match.id);
		}
		if (match.handle) {
			const handle = match.handle;
			// unknown: rows come back untyped and are narrowed with isRecord below.
			let rows: unknown[] = [];
			try {
				// as never: a handle filter is valid for the entities this is used
				// on (org, workspace), whose schemas declare handle.
				rows = await table.search({ data: { handle } } as never);
			} catch {
				// Sealed rows (encryptDataAtRest) cannot be searched by field.
			}
			if (rows.length === 0) {
				// Read the rows back (decrypted) and match the handle instead.
				rows = (await table.list()).filter(
					(row) => storedData(row)?.handle === handle,
				);
			}
			for (const row of rows) {
				if (isRecord(row) && typeof row.entity_id === 'string') {
					ids.add(row.entity_id);
				}
			}
		}
		for (const id of ids) {
			markDeleted(keyFor(id));
			await enqueueWrite(keyFor(id), async () => {
				try {
					await table.deleteByEntityId(id);
				} catch (error) {
					console.warn('Failed to remove deleted entity locally:', error);
				}
			});
		}
	} catch (error) {
		console.warn('Failed to remove deleted entity locally:', error);
	}
}
