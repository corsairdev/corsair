import { logEventFromContext } from 'corsair/core';
import type { StudioByAI21LabsEndpoints } from '..';
import { makeStudioByAI21LabsRequest } from '../client';
import type { StudioByAI21LabsEndpointOutputs } from './types';

export const completions: StudioByAI21LabsEndpoints['chatCompletions'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['chatCompletions']
	>('chat/completions', ctx.key, {
		method: 'POST',
		body: {
			model: input.model,
			messages: input.messages,
			tools: input.tools,
			documents: input.documents,
			response_format: input.response_format,
			max_tokens: input.max_tokens,
			temperature: input.temperature,
			top_p: input.top_p,
			stop: input.stop,
			n: input.n,
			stream: false,
		},
	});

	await logEventFromContext(
		ctx,
		'studiobyai21labs.chat.completions',
		{ model: input.model, n: input.n },
		'completed',
	);
	return response;
};
