import type {
	KaggleCompetitionEntity,
	KaggleDatasetEntity,
	KaggleKernelEntity,
	KaggleModelEntity,
} from '../schema/database';

type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

type CacheCtx = {
	db?: {
		datasets?: EntityStore<KaggleDatasetEntity>;
		models?: EntityStore<KaggleModelEntity>;
		competitions?: EntityStore<KaggleCompetitionEntity>;
		kernels?: EntityStore<KaggleKernelEntity>;
	};
};

function entityDb(ctx: unknown): NonNullable<CacheCtx['db']> {
	if (typeof ctx !== 'object' || ctx === null) return {};
	return (ctx as CacheCtx).db ?? {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function catalogItems(
	payload: unknown,
	fallbackRef?: string,
): Array<{ ref: string; title?: string }> {
	const records = Array.isArray(payload)
		? payload.filter(isRecord)
		: isRecord(payload)
			? Array.isArray(payload.results)
				? payload.results.filter(isRecord)
				: Array.isArray(payload.data)
					? payload.data.filter(isRecord)
					: Array.isArray(payload.list)
						? payload.list.filter(isRecord)
						: [payload]
			: [];

	const items: Array<{ ref: string; title?: string }> = [];
	for (const record of records) {
		const ref =
			typeof record.ref === 'string' && record.ref ? record.ref : fallbackRef;
		if (!ref) continue;
		items.push({
			ref,
			title: typeof record.title === 'string' ? record.title : undefined,
		});
	}
	return items;
}

async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[KAGGLE] failed to cache ${what}:`, error);
	}
}

async function cacheRefs<T extends { ref: string; title?: string }>(
	store: EntityStore<T> | undefined,
	payload: unknown,
	what: string,
	fallbackRef?: string,
) {
	if (!store) return;
	for (const item of catalogItems(payload, fallbackRef)) {
		await safely(
			() => store.upsertByEntityId(item.ref, item as T),
			`${what} ${item.ref}`,
		);
	}
}

export async function cacheDatasets(
	ctx: unknown,
	payload: unknown,
	fallbackRef?: string,
) {
	await cacheRefs(entityDb(ctx).datasets, payload, 'dataset', fallbackRef);
}

export async function cacheModels(
	ctx: unknown,
	payload: unknown,
	fallbackRef?: string,
) {
	await cacheRefs(entityDb(ctx).models, payload, 'model', fallbackRef);
}

export async function cacheCompetitions(ctx: unknown, payload: unknown) {
	await cacheRefs(entityDb(ctx).competitions, payload, 'competition');
}

export async function cacheKernels(
	ctx: unknown,
	payload: unknown,
	fallbackRef?: string,
) {
	await cacheRefs(entityDb(ctx).kernels, payload, 'kernel', fallbackRef);
}
