import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import type { HumanitixEndpointOutputs } from './types';

export const get: HumanitixEndpoints['getEvents'] = async (ctx, input) => {
	const response = await makeHumanitixRequest<
		HumanitixEndpointOutputs['getEvents']
	>('events', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			since: input.since,
			pageSize: input.pageSize,
			inFutureOnly: input.inFutureOnly,
			overrideLocation: input.overrideLocation,
		},
	});

	await logEventFromContext(
		ctx,
		'humanitix.events.list',
		{ ...input },
		'completed',
	);
	return response;
};
