import { logEventFromContext } from 'corsair/core';
import { kagglePath, makeKaggleRequest } from '../client';
import type { KaggleEndpoints } from '../index';
import { cacheModels } from './persist';
import type { KaggleEndpointOutputs } from './types';

export const list: KaggleEndpoints['modelsList'] = async (ctx, input) => {
	// Kaggle v1: GET /models/list (verified live — returns 200)
	const result = await makeKaggleRequest<KaggleEndpointOutputs['modelsList']>(
		'/models/list',
		ctx.key,
		{
			method: 'GET',
			query: {
				search: input.search,
				owner: input.owner,
				sortBy: input.sortBy,
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
			username: ctx.options.username,
		},
	);

	await cacheModels(ctx, result);
	await logEventFromContext(ctx, 'kaggle.models.list', {}, 'completed');
	return result;
};

export const get: KaggleEndpoints['modelsGet'] = async (ctx, input) => {
	// Kaggle v1: GET /models/{ownerSlug}/{modelSlug}/get (verified live — 200)
	const result = await makeKaggleRequest<KaggleEndpointOutputs['modelsGet']>(
		kagglePath('models', input.ownerSlug, input.modelSlug, 'get'),
		ctx.key,
		{ method: 'GET', username: ctx.options.username },
	);

	await cacheModels(ctx, result, `${input.ownerSlug}/${input.modelSlug}`);
	await logEventFromContext(
		ctx,
		'kaggle.models.get',
		{ ownerSlug: input.ownerSlug, modelSlug: input.modelSlug },
		'completed',
	);
	return result;
};

export const getInstance: KaggleEndpoints['modelsGetInstance'] = async (
	ctx,
	input,
) => {
	// Kaggle v1: GET /models/{owner}/{model}/{framework}/{instance}/get (verified live — 400 on bad slug, /get variant exists)
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['modelsGetInstance']
	>(
		kagglePath(
			'models',
			input.ownerSlug,
			input.modelSlug,
			input.framework,
			input.instanceSlug,
			'get',
		),
		ctx.key,
		{ method: 'GET', username: ctx.options.username },
	);

	await logEventFromContext(
		ctx,
		'kaggle.models.getInstance',
		{
			ownerSlug: input.ownerSlug,
			modelSlug: input.modelSlug,
			framework: input.framework,
		},
		'completed',
	);
	return result;
};

export const listInstanceVersionFiles: KaggleEndpoints['modelsListInstanceVersionFiles'] =
	async (ctx, input) => {
		const result = await makeKaggleRequest<
			KaggleEndpointOutputs['modelsListInstanceVersionFiles']
		>(
			kagglePath(
				'models',
				input.ownerSlug,
				input.modelSlug,
				input.framework,
				input.instanceSlug,
				String(input.versionNumber),
				'files',
			),
			ctx.key,
			{
				method: 'GET',
				query: {
					pageSize: input.pageSize,
					pageToken: input.pageToken,
				},
				username: ctx.options.username,
			},
		);

		await logEventFromContext(
			ctx,
			'kaggle.models.listInstanceVersionFiles',
			{
				ownerSlug: input.ownerSlug,
				modelSlug: input.modelSlug,
				versionNumber: input.versionNumber,
			},
			'completed',
		);
		return result;
	};
