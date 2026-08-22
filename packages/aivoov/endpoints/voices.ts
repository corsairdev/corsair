import { logEventFromContext } from 'corsair/core';
import { makeAivoovRequest } from '../client';
import type { AivoovEndpoints } from '../index';
import type { AivoovEndpointOutputs } from './types';

export const listVoices: AivoovEndpoints['listVoices'] = async (ctx, input) => {
	const response = await makeAivoovRequest<AivoovEndpointOutputs['listVoices']>(
		'/voices',
		ctx.key,
		{
			method: 'GET',
			query: {
				language_code: input.language_code,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'aivoov.voices.list',
		{ language_code: input.language_code },
		'completed',
	);

	return response;
};
