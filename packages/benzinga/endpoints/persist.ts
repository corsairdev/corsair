type EntityTable<T> = {
	// Safe: only awaited for completion; the stored row is never read.
	// A narrower type is not practical because each entity table returns a different row type.
	upsertByEntityId: (id: string, data: T) => Promise<unknown>;
};

/**
 * Upserts API records into a plugin entity table. A database failure is
 * logged and swallowed so a read endpoint still returns the API response.
 */
export async function persistEntities<T>(
	table: EntityTable<T> | undefined,
	records: readonly T[],
	entityId: (record: T) => string,
): Promise<void> {
	if (!table) return;
	try {
		for (const record of records) {
			await table.upsertByEntityId(entityId(record), record);
		}
	} catch (error) {
		console.warn('Failed to save Benzinga records to database:', error);
	}
}
