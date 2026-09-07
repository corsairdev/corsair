import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import type { HumanitixEndpointOutputs } from './types';

export const getEvent: HumanitixEndpoints['getEvent'] = async (ctx, input) => {
	const response = await makeHumanitixRequest<
		HumanitixEndpointOutputs['getEvent']
	>(`/events/${input.eventId}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'humanitix.events.get',
		{ ...input },
		'completed',
	);
	return response;
};
