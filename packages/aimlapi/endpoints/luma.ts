import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';

export const getGeneration: AimlApiEndpoints['lumaGetGeneration'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['lumaGetGeneration']
	>(`/v2/video/generations`, ctx.key, {
		method: 'GET',
		query: {
			generation_id: input.generationId,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.luma.getGeneration',
		{ generationId: input.generationId },
		'completed',
	);

	return response;
};

export const listGenerations: AimlApiEndpoints['lumaListGenerations'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['lumaListGenerations']
	>(`/v2/video/generations`, ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.luma.listGenerations',
		{ resultCount: Array.isArray(response) ? response.length : 0 },
		'completed',
	);

	return response;
};
