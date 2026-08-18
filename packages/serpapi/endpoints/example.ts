import { logEventFromContext } from 'corsair/core';
import type { SerpapiEndpoints } from '..';
import { makeSerpapiRequest } from '../client';
import type { SerpapiEndpointOutputs } from './types';

export const get: SerpapiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeSerpapiRequest<
		SerpapiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'serpapi.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
