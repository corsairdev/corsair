import { logEventFromContext } from 'corsair/core';
import type { AllImagesAiEndpoints } from '..';
import { makeAllImagesAiRequest } from '../client';
import type { AllImagesAiEndpointOutputs } from './types';

export const get: AllImagesAiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAllImagesAiRequest<
		AllImagesAiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'allimagesai.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
