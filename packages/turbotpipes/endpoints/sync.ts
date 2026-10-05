// Best-effort sync of list responses into local entity tables so the
// documented `<entity>.search()` accessors return fetched data.

type EntityTable = {
	upsertByEntityId(id: string, record: never): Promise<unknown>;
};

// unknown: list items are provider-defined records without a fixed shape; only
// string ids are used for syncing, and the record is passed through as never
// because each entity table validates its own columns.
export async function syncListItems(
	table: EntityTable | null | undefined,
	items: unknown,
): Promise<void> {
	if (!table || !Array.isArray(items)) {
		return;
	}
	for (const item of items) {
		if (typeof item !== 'object' || item === null) {
			continue;
		}
		const id = (item as Record<string, unknown>).id;
		if (typeof id !== 'string') {
			continue;
		}
		try {
			await table.upsertByEntityId(id, item as never);
		} catch (error) {
			console.warn('Failed to sync item to database:', error);
		}
	}
}
