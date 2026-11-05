import type { AeroleadsLinkedinDetails } from '../schema/database';

type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

type CacheCtx = {
	db?: {
		linkedinDetails?: EntityStore<AeroleadsLinkedinDetails>;
	};
};

function entityDb(ctx: unknown): NonNullable<CacheCtx['db']> {
	if (typeof ctx !== 'object' || ctx === null) return {};
	return (ctx as CacheCtx).db ?? {};
}

async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[AEROLEADS] failed to cache ${what}:`, error);
	}
}

export async function cacheLinkedinDetails(
	ctx: unknown,
	linkedinUrl: string | undefined,
	details: AeroleadsLinkedinDetails | undefined,
) {
	const store = entityDb(ctx).linkedinDetails;
	if (!store || !linkedinUrl || !details) return;
	await safely(
		() =>
			store.upsertByEntityId(linkedinUrl, {
				...details,
				linkedin_url: details.linkedin_url ?? linkedinUrl,
			}),
		`linkedin ${linkedinUrl}`,
	);
}
