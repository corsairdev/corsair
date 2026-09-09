import { logEventFromContext } from 'corsair/core';
import type { CurrentsApiEndpoints } from '..';
import { makeCurrentsApiRequest } from '../client';
import type { CurrentsApiEndpointOutputs } from './types';

export const get: CurrentsApiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCurrentsApiRequest<
		CurrentsApiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'currentsapi.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
