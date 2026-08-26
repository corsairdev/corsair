import type {
	OpenRouterGenerationEntity,
	OpenRouterModelEntity,
	OpenRouterProviderEntity,
} from '../schema/database';

type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

type CacheCtx = {
	db?: {
		models?: EntityStore<OpenRouterModelEntity>;
		providers?: EntityStore<OpenRouterProviderEntity>;
		generations?: EntityStore<OpenRouterGenerationEntity>;
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
		console.warn(`[OPENROUTER] failed to cache ${what}:`, error);
	}
}

export async function cacheModels(
	ctx: unknown,
	models:
		| Array<{
				id: string;
				name?: string;
				description?: string;
				context_length?: number;
				created?: number;
		  }>
		| undefined,
) {
	const store = entityDb(ctx).models;
	if (!store || !models) return;
	for (const model of models) {
		if (!model.id) continue;
		await safely(
			() =>
				store.upsertByEntityId(model.id, {
					id: model.id,
					name: model.name,
					description: model.description,
					context_length: model.context_length,
					created: model.created,
				}),
			`model ${model.id}`,
		);
	}
}

export async function cacheProviders(
	ctx: unknown,
	providers:
		| Array<{ slug: string; name: string; headquarters?: string | null }>
		| undefined,
) {
	const store = entityDb(ctx).providers;
	if (!store || !providers) return;
	for (const provider of providers) {
		if (!provider.slug) continue;
		await safely(
			() =>
				store.upsertByEntityId(provider.slug, {
					slug: provider.slug,
					name: provider.name,
					headquarters: provider.headquarters,
				}),
			`provider ${provider.slug}`,
		);
	}
}

export async function cacheGeneration(
	ctx: unknown,
	generation:
		| {
				id: string;
				model?: string;
				provider?: string;
				total_cost?: number | null;
				prompt_tokens?: number;
				completion_tokens?: number;
				created_at?: string;
		  }
		| undefined,
) {
	const store = entityDb(ctx).generations;
	if (!store || !generation?.id) return;
	await safely(
		() =>
			store.upsertByEntityId(generation.id, {
				id: generation.id,
				model: generation.model,
				provider: generation.provider,
				total_cost: generation.total_cost,
				prompt_tokens: generation.prompt_tokens,
				completion_tokens: generation.completion_tokens,
				created_at: generation.created_at,
			}),
		`generation ${generation.id}`,
	);
}
