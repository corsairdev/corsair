type UpsertStore<T> = {
	upsertByEntityId?: (id: string, data: T) => Promise<unknown>;
};

type DeleteStore = {
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
	} catch {
		// local cache is best-effort
	}
}

export async function evictEntity(
	store: DeleteStore | undefined,
	id: string | undefined,
) {
	if (!id || !store?.deleteByEntityId) return;
	try {
		await store.deleteByEntityId(id);
	} catch {
		// local cache is best-effort
	}
}

export function compactQuery(
	query: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (!query) return undefined;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length ? out : undefined;
}
