import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import {
	HumanitixEndpointInputSchemas,
	HumanitixEndpointOutputSchemas,
} from './types';

export const getEvents: HumanitixEndpoints['getEvents'] = async (
	ctx,
	input,
) => {
	const parsed = HumanitixEndpointInputSchemas.getEvents.parse(input);
	// Raw transport payload typed unknown, then validated against the zod
	// output schema below — no narrower static type exists for it.
	const raw = await makeHumanitixRequest<unknown>('/events', ctx.key, {
		method: 'GET',
		query: {
			page: parsed.page,
			pageSize: parsed.pageSize,
			inFutureOnly: parsed.inFutureOnly,
			since: parsed.since,
			overrideLocation: parsed.overrideLocation,
		},
	});
	const response = HumanitixEndpointOutputSchemas.getEvents.parse(raw);

	await logEventFromContext(
		ctx,
		'humanitix.events.list',
		{ ...parsed },
		'completed',
	);
	return response;
};
