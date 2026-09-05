import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import type { HumanitixEndpointOutputs } from './types';

export const get: HumanitixEndpoints['getEvent'] = async (ctx, input) => {
	const response = await makeHumanitixRequest<
		HumanitixEndpointOutputs['getEvent']
	>(`events/${input.event_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'humanitix.event.get',
		{ ...input },
		'completed',
	);
	return response;
};
