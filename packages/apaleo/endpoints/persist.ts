type UpsertStore<T> = {
	// unknown: local store return value is unused
	upsertByEntityId?: (id: string, data: T) => Promise<unknown>;
};

type DeleteStore = {
	// unknown: local store return value is unused
	deleteByEntityId?: (id: string) => Promise<unknown>;
};

export async function upsertEntity<T>(
	store: UpsertStore<T> | undefined,
	id: string | undefined,
	data: T,
) {
	if (!id || !store?.upsertByEntityId) return;
	try {
		await store.upsertByEntityId(id, data);
	} catch (error) {
		console.warn(`[apaleo] failed to upsert ${id}:`, error);
	}
}

export async function evictEntity(
	store: DeleteStore | undefined,
	id: string | undefined,
) {
	if (!id || !store?.deleteByEntityId) return;
	try {
		await store.deleteByEntityId(id);
	} catch (error) {
		console.warn(`[apaleo] failed to evict ${id}:`, error);
	}
}

export function compactQuery(query: object | undefined) {
	if (!query) return undefined;
	const out = Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	);
	return Object.keys(out).length ? out : undefined;
}
