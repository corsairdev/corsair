import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import { cacheModels } from './persist';
import type {
	ListEmbeddingModelsResponse,
	ListModelsCountResponse,
	ListModelsResponse,
	ListUserModelsResponse,
} from './types';

export const listModels: OpenRouterEndpoints['modelsList'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenRouterRequest<ListModelsResponse>(
		'models',
		ctx.key,
		{ query: { offset: input.offset, limit: input.limit } },
	);

	await cacheModels(ctx, result.data);
	return result;
};

export const listModelsCount: OpenRouterEndpoints['modelsCount'] = async (
	ctx,
	_input,
) => {
	const result = await makeOpenRouterRequest<ListModelsCountResponse>(
		'models/count',
		ctx.key,
	);

	return result;
};

export const listEmbeddingModels: OpenRouterEndpoints['modelsEmbeddingsList'] =
	async (ctx, input) => {
		const result = await makeOpenRouterRequest<ListEmbeddingModelsResponse>(
			'embeddings/models',
			ctx.key,
			{
				query: {
					offset: input.offset,
					limit: input.limit,
				},
			},
		);

		await cacheModels(ctx, result.data);
		return result;
	};

export const listUserModels: OpenRouterEndpoints['modelsUserList'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenRouterRequest<ListUserModelsResponse>(
		'models/user',
		ctx.key,
		{ query: { offset: input.offset, limit: input.limit } },
	);

	await cacheModels(ctx, result.data);
	return result;
};
