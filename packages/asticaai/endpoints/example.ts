import { logEventFromContext } from 'corsair/core';
import type { AsticaAiEndpoints } from '..';
import { makeAsticaAiRequest } from '../client';
import type { AsticaAiEndpointOutputs } from './types';

export const get: AsticaAiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAsticaAiRequest<
		AsticaAiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'asticaai.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
