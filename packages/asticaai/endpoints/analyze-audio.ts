import { logEventFromContext } from 'corsair/core';
import type { AsticaAiEndpoints } from '..';
import { makeAsticaAiRequest } from '../client';
import type { AsticaAiEndpointOutputs } from './types';

export const analyze: AsticaAiEndpoints['analyzeAudio'] = async (
	ctx,
	input,
) => {
	const response = await makeAsticaAiRequest<
		AsticaAiEndpointOutputs['analyzeAudio']
	>('/transcribe', ctx.key, {
		baseUrl: 'https://listen.astica.ai',
		method: 'POST',
		body: {
			input: input.input,
			modelVersion: input.modelVersion,
			doStream: input.doStream,
			low_priority: input.low_priority,
		},
	});

	await logEventFromContext(
		ctx,
		'asticaai.analyze_audio',
		{ ...input },
		'completed',
	);

	return response;
};
