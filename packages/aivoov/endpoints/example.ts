import { logEventFromContext } from 'corsair/core';
import type { AivoovEndpoints } from '..';
import { makeAivoovRequest } from '../client';
import type { AivoovEndpointOutputs } from './types';

export const get: AivoovEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAivoovRequest<AivoovEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'aivoov.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
