import { logEventFromContext } from 'corsair/core';
import type { AsticaAiEndpoints } from '..';
import { makeAsticaAiRequest } from '../client';
import type { AsticaAiEndpointOutputs } from './types';

export const read: AsticaAiEndpoints['readText'] = async (ctx, input) => {
	const response = await makeAsticaAiRequest<
		AsticaAiEndpointOutputs['readText']
	>('/describe', ctx.key, {
		baseUrl: 'https://vision.astica.ai',
		method: 'POST',
		body: {
			input: input.input,
			modelVersion: input.modelVersion,
			visionParams: 'text_read',
		},
	});

	await logEventFromContext(
		ctx,
		'asticaai.read_text',
		{ ...input },
		'completed',
	);

	return response;
};
