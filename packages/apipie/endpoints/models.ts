import { logEventFromContext } from 'corsair/core';
import { makeApipieRequest } from '../client';
import type { ApipieEndpoints } from '../index';
import { cacheModelDetails, cacheModels } from './persist';
import type { ApipieEndpointOutputs } from './types';
import { ApipieEndpointOutputSchemas } from './types';

export const list: ApipieEndpoints['modelsList'] = async (ctx, input) => {
	const response = await makeApipieRequest<ApipieEndpointOutputs['modelsList']>(
		`/v1/models`,
		ctx.key,
		{
			schema: ApipieEndpointOutputSchemas.modelsList,
			method: 'GET',
			query: {
				type: input.type,
				subtype: input.subtype,
				provider: input.provider,
				model: input.model,
				enabled: input.enabled,
			},
		},
	);

	const items = Array.isArray(response) ? response : (response?.data ?? []);
	await cacheModels(ctx.db?.models, items);

	await logEventFromContext(
		ctx,
		'apipie.api.models.list',
		{
			resultCount: items.length,
		},
		'completed',
	);

	return response;
};

export const listDetailed: ApipieEndpoints['modelsListDetailed'] = async (
	ctx,
	input,
) => {
	const response = await makeApipieRequest<
		ApipieEndpointOutputs['modelsListDetailed']
	>(`/v1/models/detailed`, ctx.key, {
		schema: ApipieEndpointOutputSchemas.modelsListDetailed,
		method: 'GET',
		query: {
			type: input.type,
			provider: input.provider,
			model: input.model,
		},
	});

	await cacheModelDetails(ctx.db?.modelDetails, response?.data ?? []);

	await logEventFromContext(
		ctx,
		'apipie.api.models.listDetailed',
		{
			resultCount: Array.isArray(response?.data) ? response.data.length : 0,
		},
		'completed',
	);

	return response;
};
