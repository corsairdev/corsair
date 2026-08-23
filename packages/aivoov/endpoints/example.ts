import { logEventFromContext } from 'corsair/core';
import type { AivoovEndpoints } from '..';
import { makeAivoovRequest } from '../client';
import type { AivoovEndpointOutputs } from './types';

export const listVoices: AivoovEndpoints['listVoices'] = async (ctx, input) => {
	const response = await makeAivoovRequest<AivoovEndpointOutputs['listVoices']>(
		'voices',
		ctx.key,
		{
			method: 'GET',
			query: input.language_code
				? { language_code: input.language_code }
				: undefined,
		},
	);

	await logEventFromContext(
		ctx,
		'aivoov.list.voices',
		{ ...input },
		'completed',
	);

	return response;
};
