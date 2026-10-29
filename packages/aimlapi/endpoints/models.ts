import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const list: AimlApiEndpoints['modelsList'] = async (ctx) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['modelsList']
	>(`/models`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.modelsList,
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.models.list',
		{
			resultCount: Array.isArray(response)
				? response.length
				: Array.isArray(response?.data)
					? response.data.length
					: 0,
		},
		'completed',
	);

	return response;
};

export const listWithDetails: AimlApiEndpoints['modelsListWithDetails'] =
	async (ctx, input) => {
		// AIMLAPI has no /models/with-details; /models already returns detailed info.
		const response = await makeAimlApiRequest<
			AimlApiEndpointOutputs['modelsListWithDetails']
		>(`/models`, ctx.key, {
			schema: AimlApiEndpointOutputSchemas.modelsListWithDetails,
			method: 'GET',
			query: {
				limit: input.limit,
				order: input.order,
				before: input.before,
				after: input.after,
				model: input.model,
			},
		});

		await logEventFromContext(
			ctx,
			'aimlapi.api.models.listWithDetails',
			{
				resultCount: Array.isArray(response)
					? response.length
					: Array.isArray(response?.data)
						? response.data.length
						: 0,
			},
			'completed',
		);

		return response;
	};
