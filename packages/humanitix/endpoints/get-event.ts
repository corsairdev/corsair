import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import {
	HumanitixEndpointInputSchemas,
	HumanitixEndpointOutputSchemas,
} from './types';

export const getEvent: HumanitixEndpoints['getEvent'] = async (ctx, input) => {
	const parsed = HumanitixEndpointInputSchemas.getEvent.parse(input);
	// Raw transport payload typed unknown, then validated against the zod
	// output schema below — no narrower static type exists for it.
	const raw = await makeHumanitixRequest<unknown>(
		`/events/${parsed.eventId}`,
		ctx.key,
		{ method: 'GET' },
	);
	const response = HumanitixEndpointOutputSchemas.getEvent.parse(raw);

	await logEventFromContext(
		ctx,
		'humanitix.events.get',
		{ ...parsed },
		'completed',
	);
	return response;
};
