import type {
	ApipieImageEntity,
	ApipieModelDetailEntity,
	ApipieModelEntity,
} from '../schema/database';

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

/** Fields carried by a `GET /v1/models/detailed` entry. */
type CacheableModelDetail = Omit<
	ApipieModelDetailEntity,
	'id' | keyof Record<string, never>
> & { id?: string | null };

/**
 * Mirrors one detailed catalogue entry.
 *
 * Written to its own table rather than shared with `cacheModel`: the entity
 * store replaces the stored payload wholesale, so writing this narrower field
 * set over a plain-list row would erase that row's cost columns.
 */
export async function cacheModelDetail(
	store: EntityStore<ApipieModelDetailEntity> | undefined,
	model: CacheableModelDetail | undefined | null,
) {
	if (!store || !model?.id) return;
	const id = model.id;
	await safely(
		() => store.upsertByEntityId(id, { ...model, id }),
		`model ${id}`,
	);
}

/** Mirrors a page of detailed catalogue entries, one row per model. */
export async function cacheModelDetails(
	store: EntityStore<ApipieModelDetailEntity> | undefined,
	models: readonly (CacheableModelDetail | undefined | null)[] | undefined,
) {
	if (!store || !models?.length) return;
	for (const model of models) {
		await cacheModelDetail(store, model);
	}
}

/**
 * Mirrors one generated image.
 *
 * The API returns no identifier per image, so rows are keyed by a generation
 * id minted once per request plus the image's index within the batch. The
 * response timestamp is deliberately not used for this: it has one-second
 * resolution, so two generations finishing in the same second would collide
 * and the later one would overwrite the earlier.
 */
export async function cacheImage(
	store: EntityStore<ApipieImageEntity> | undefined,
	image: { url?: string; revised_prompt?: string } | undefined | null,
	context: {
		generationId: string;
		index: number;
		created?: number;
		model?: string;
		prompt?: string;
	},
) {
	if (!store || !image) return;
	const id = `${context.generationId}:${context.index}`;
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
