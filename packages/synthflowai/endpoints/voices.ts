import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const list: SynthflowAiEndpoints['voicesList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['voicesList']
	>('voices', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.voices.list',
		input ? { limit: input.limit, offset: input.offset } : {},
		'completed',
	);

	return response;
};
