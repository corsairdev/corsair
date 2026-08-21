/**
 * Best-effort local mirror of Clientary records. A provider call must still
 * succeed when the cache cannot be written; failures are warned and swallowed.
 */

type UpsertStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

type EvictStore = {
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

type CachedRow = {
	entity_id: string;
	data: unknown;
};

type RelatedStore = EvictStore & {
	list?: (options?: {
		limit?: number;
		offset?: number;
	}) => Promise<CachedRow[]>;
};

async function safely(
	operation: () => Promise<unknown>,
	what: string,
): Promise<void> {
	try {
		await operation();
	} catch (error) {
		console.warn(`[CLIENTARY] failed to cache ${what}:`, error);
	}
}

export async function cacheRecord<T extends { id: number }>(
	store: UpsertStore<T> | undefined,
	record: T | undefined | null,
	what: string,
): Promise<void> {
	if (!store || !record) return;
	await safely(
		() => store.upsertByEntityId(String(record.id), { ...record }),
		`${what} ${record.id}`,
	);
}

export async function cacheRecords<T extends { id: number }>(
	store: UpsertStore<T> | undefined,
	records: T[],
	what: string,
): Promise<void> {
	if (!store) return;
	await Promise.all(records.map((record) => cacheRecord(store, record, what)));
}

export async function evictEntity(
	store: EvictStore | undefined,
	id: number,
	what: string,
): Promise<void> {
	const remove = store?.deleteByEntityId;
	if (!remove) return;
	await safely(() => remove(String(id)), `${what} ${id}`);
}

function asPositiveInt(value: unknown): number | undefined {
	if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
		return value;
	}
	if (typeof value === 'string' && /^\d+$/.test(value)) {
		return Number(value);
	}
	return undefined;
}

function relatedClientId(data: unknown): number | undefined {
	if (!data || typeof data !== 'object') return undefined;
	const record = data as Record<string, unknown>;
	const nested =
		record.client && typeof record.client === 'object'
			? (record.client as Record<string, unknown>).id
			: undefined;
	return asPositiveInt(record.client_id) ?? asPositiveInt(nested);
}

const RELATED_PAGE_SIZE = 100;

/** Drop cached rows that belong to a client after Clientary cascaded the delete. */
export async function evictRelatedByClientId(
	store: RelatedStore | undefined,
	clientId: number,
	what: string,
): Promise<void> {
	const list = store?.list;
	const remove = store?.deleteByEntityId;
	if (!list || !remove) return;

	await safely(async () => {
		const toDelete: string[] = [];
		let offset = 0;
		for (;;) {
			const rows = await list({
				limit: RELATED_PAGE_SIZE,
				offset,
			});
			for (const row of rows) {
				if (relatedClientId(row.data) === clientId) {
					toDelete.push(row.entity_id);
				}
			}
			if (rows.length < RELATED_PAGE_SIZE) break;
			offset += RELATED_PAGE_SIZE;
		}
		// Delete after listing so OFFSET pagination is not shifted mid-scan.
		await Promise.all(toDelete.map((entityId) => remove(entityId)));
	}, `${what}s for client ${clientId}`);
}
