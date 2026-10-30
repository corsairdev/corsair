import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import {
	HumanitixEndpointInputSchemas,
	HumanitixEndpointOutputSchemas,
} from './types';

export const getEvent: HumanitixEndpoints['getEvent'] = async (ctx, input) => {
	const parsed = HumanitixEndpointInputSchemas.getEvent.parse(input);
	// unknown: raw transport payload is untyped before Zod parsing
	const raw = await makeHumanitixRequest<unknown>(
		`/events/${encodeURIComponent(parsed.eventId)}`,
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
