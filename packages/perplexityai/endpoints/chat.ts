import { logEventFromContext } from 'corsair/core';
import type { PerplexityAiEndpoints } from '..';
import { makePerplexityAiRequest } from '../client';
import type { PerplexityAiEndpointOutputs } from './types';

export const completions: PerplexityAiEndpoints['chatCompletions'] = async (
	ctx,
	input,
) => {
	const response = await makePerplexityAiRequest<
		PerplexityAiEndpointOutputs['chatCompletions']
	>(`/chat/completions`, ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'perplexityai.chat.completions',
		{ ...input },
		'completed',
	);
	return response;
};
