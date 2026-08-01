import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';

export const list: AimlApiEndpoints['modelsList'] = async (ctx) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['modelsList']
	>(`/models`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'aimlapi.api.models.list',
		{ resultCount: Array.isArray(response) ? response.length : 0 },
		'completed',
	);

	return response;
};

export const listWithDetails: AimlApiEndpoints['modelsListWithDetails'] =
	async (ctx, input) => {
		const response = await makeAimlApiRequest<
			AimlApiEndpointOutputs['modelsListWithDetails']
		>(`/v1/models`, ctx.key, {
			method: 'GET',
			query: {
				limit: input.limit,
				order: input.order,
				before: input.before,
				after: input.after,
			},
		});

		await logEventFromContext(
			ctx,
			'aimlapi.api.models.listWithDetails',
			{ resultCount: Array.isArray(response) ? response.length : 0 },
			'completed',
		);

		return response;
	};
