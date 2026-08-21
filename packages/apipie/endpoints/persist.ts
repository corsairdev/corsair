import type { ApipieImageEntity, ApipieModelEntity } from '../schema/database';

/**
 * Minimal structural view of a Corsair entity store. Only the operation the
 * APIpie endpoints need is declared, so these helpers stay usable whatever
 * else the concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/**
 * Caching is best-effort: an APIpie call must not fail because the local
 * mirror could not be written. Failures are warned about and swallowed.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[APIPIE] failed to cache ${what}:`, error);
	}
}

/** Shape shared by the plain and detailed model list items. */
type CacheableModel = {
	id?: string | null;
	model?: string | null;
	provider?: string | null;
	type?: string | null;
	subtype?: string | null;
	route?: string | null;
	description?: string | null;
	enabled?: boolean | number | null;
	available?: boolean | number | null;
	avg_cost?: string | null;
	input_cost?: string | null;
	output_cost?: string | null;
	price_type?: string | null;
	latency?: string | null;
	query_count?: string | null;
	max_tokens?: number | null;
	max_response_tokens?: number | null;
};

/** Mirrors one catalogue entry into the local cache. */
export async function cacheModel(
	store: EntityStore<ApipieModelEntity> | undefined,
	model: CacheableModel | undefined | null,
) {
	if (!store || !model?.id) return;
	const id = model.id;
	await safely(
		() =>
			store.upsertByEntityId(id, {
				id,
				model: model.model,
				provider: model.provider,
				type: model.type,
				subtype: model.subtype,
				route: model.route,
				description: model.description,
				enabled: model.enabled,
				available: model.available,
				avg_cost: model.avg_cost,
				input_cost: model.input_cost,
				output_cost: model.output_cost,
				price_type: model.price_type,
				latency: model.latency,
				query_count: model.query_count,
				max_tokens: model.max_tokens,
				max_response_tokens: model.max_response_tokens,
			}),
		`model ${id}`,
	);
}

/** Mirrors a page of catalogue entries, one row per model. */
export async function cacheModels(
	store: EntityStore<ApipieModelEntity> | undefined,
	models: readonly (CacheableModel | undefined | null)[] | undefined,
) {
	if (!store || !models?.length) return;
	for (const model of models) {
		await cacheModel(store, model);
	}
}

/**
 * Mirrors one generated image.
 *
 * The API returns no identifier per image, so the row is keyed by the
 * generation timestamp and the image's index within the batch. `created` is
 * optional in the response; when it is absent the entry is skipped rather
 * than filed under a key that would collide across generations.
 */
export async function cacheImage(
	store: EntityStore<ApipieImageEntity> | undefined,
	image: { url?: string; revised_prompt?: string } | undefined | null,
	context: { created?: number; index: number; model?: string; prompt?: string },
) {
	if (!store || !image || context.created === undefined) return;
	const id = `${context.created}:${context.index}`;
	await safely(
		() =>
			store.upsertByEntityId(id, {
				id,
				prompt: context.prompt,
				model: context.model,
				url: image.url,
				revised_prompt: image.revised_prompt,
				created: context.created,
			}),
		`image ${id}`,
	);
}
