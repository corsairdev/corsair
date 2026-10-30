import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const getGeneration: AimlApiEndpoints['lumaGetGeneration'] = async (
	ctx,
	input,
) => {
	const generationId = (input.generationId ?? input.ids ?? '').trim();
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['lumaGetGeneration']
	>(`/v2/video/generations`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.lumaGetGeneration,
		method: 'GET',
		query: {
			generation_id: generationId,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.luma.getGeneration',
		{ generationId },
		'completed',
	);

	return response;
};
