import { logEventFromContext } from 'corsair/core';
import { makeGroqcloudRequest } from '../client';
import type { GroqcloudContext, GroqcloudEndpoints } from '../index';
import type {
	ModelsListModelsResponse,
	ModelsRetrieveModelResponse,
} from '../schema/models';

/**
 * Mirrors model metadata into the plugin cache, keyed by model ID. Caching is
 * best-effort: a cache failure must never fail the API call.
 */
async function cacheModels(
	ctx: GroqcloudContext,
	models: ReadonlyArray<{ id?: string }>,
): Promise<void> {
	const db = ctx.db as unknown as
		| {
				models?: {
					upsertByEntityId?: (
						id: string,
						data: Record<string, unknown>,
					) => Promise<unknown>;
				};
		  }
		| undefined;
	const client = db?.models;
	if (!client?.upsertByEntityId) return;

	for (const model of models) {
		if (!model?.id) continue;
		try {
			await client.upsertByEntityId(model.id, model as Record<string, unknown>);
		} catch (error) {
			console.warn(`[groqcloud] failed to cache model ${model.id}:`, error);
		}
	}
}

export const listModels: GroqcloudEndpoints['modelsListModels'] = async (
	ctx,
) => {
	const result = await makeGroqcloudRequest<ModelsListModelsResponse>(
		'models',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheModels(ctx, result.data ?? []);

	await logEventFromContext(
		ctx,
		'groqcloud.models.listModels',
		{},
		'completed',
	);

	return result;
};

export const retrieveModel: GroqcloudEndpoints['modelsRetrieveModel'] = async (
	ctx,
	input,
) => {
	const result = await makeGroqcloudRequest<ModelsRetrieveModelResponse>(
		`models/${input.model}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheModels(ctx, [result]);

	await logEventFromContext(
		ctx,
		'groqcloud.models.retrieveModel',
		{ model: input.model },
		'completed',
	);

	return result;
};
