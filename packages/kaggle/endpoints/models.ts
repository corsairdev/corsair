import { logEventFromContext } from 'corsair/core';
import { makeKaggleRequest } from '../client';
import type { KaggleEndpoints } from '../index';
import type { KaggleEndpointOutputs } from './types';

export const list: KaggleEndpoints['modelsList'] = async (ctx, input) => {
	// Kaggle v1: GET /models (no /list suffix — /models/list 404s)
	const result = await makeKaggleRequest<KaggleEndpointOutputs['modelsList']>(
		'/models',
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

	await logEventFromContext(ctx, 'kaggle.models.list', {}, 'completed');
	return result;
};

export const get: KaggleEndpoints['modelsGet'] = async (ctx, input) => {
	// Kaggle v1: GET /models/{ownerSlug}/{modelSlug} (no /get prefix)
	const result = await makeKaggleRequest<KaggleEndpointOutputs['modelsGet']>(
		`/models/${input.ownerSlug}/${input.modelSlug}`,
		ctx.key,
		{ method: 'GET', username: ctx.options.username },
	);

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
	// Kaggle v1: GET /models/{owner}/{model}/{framework}/{instance} (no trailing /get)
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['modelsGetInstance']
	>(
		`/models/${input.ownerSlug}/${input.modelSlug}/${input.framework}/${input.instanceSlug}`,
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
			`/models/${input.ownerSlug}/${input.modelSlug}/${input.framework}/${input.instanceSlug}/${input.versionNumber}/files`,
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
