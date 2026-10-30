import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const list: SynthflowAiEndpoints['voicesList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {
		workspace: input.workspace,
	};
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.offset !== undefined) query.offset = input.offset;
	if (input.search !== undefined) query.search = input.search;
	if (input.provider !== undefined) query.provider = input.provider;

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['voicesList']
	>('voices', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.voices.list',
		{ workspace: input.workspace },
		'completed',
	);

	return response;
};
