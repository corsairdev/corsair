import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { makeCountdownApiRequest } from '../client';
import type { CountdownApiEndpointOutputs } from './types';

export const get: CountdownApiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCountdownApiRequest<
		CountdownApiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'countdownapi.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
