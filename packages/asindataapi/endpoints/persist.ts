type Store<T> = {
	upsertByEntityId?: (id: string, data: T) => Promise<unknown>;
};

export async function upsertEntity<T>(
	store: Store<T> | undefined,
	id: string,
	data: T,
) {
	if (!store?.upsertByEntityId) return;
	try {
		await store.upsertByEntityId(id, data);
	} catch {
		// local cache is best-effort
	}
}

export async function evictEntity(
	store: { deleteByEntityId?: (id: string) => Promise<unknown> } | undefined,
	id: string,
) {
	if (!store?.deleteByEntityId) return;
	try {
		await store.deleteByEntityId(id);
	} catch {
		// local cache is best-effort
	}
}
