export async function maybeUpsert<T extends Record<string, unknown>>(
	table:
		| {
				upsertByEntityId: (id: string, data: T) => Promise<unknown>;
		  }
		| undefined,
	id: string | number | undefined,
	data: T,
): Promise<void> {
	if (!table || id === undefined || id === '') return;
	try {
		await table.upsertByEntityId(String(id), data);
	} catch (error) {
		console.warn('Failed to save Unione entity to database:', error);
	}
}
