import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import {
	HumanitixEndpointInputSchemas,
	HumanitixEndpointOutputSchemas,
} from './types';

export const getTags: HumanitixEndpoints['getTags'] = async (ctx, input) => {
	const parsed = HumanitixEndpointInputSchemas.getTags.parse(input);
	// Raw transport payload typed unknown, then validated against the zod
	// output schema below — no narrower static type exists for it.
	const raw = await makeHumanitixRequest<unknown>('/tags', ctx.key, {
		method: 'GET',
		query: {
			page: parsed.page,
			pageSize: parsed.pageSize,
		},
	});
	const response = HumanitixEndpointOutputSchemas.getTags.parse(raw);

	await logEventFromContext(
		ctx,
		'humanitix.tags.list',
		{ ...parsed },
		'completed',
	);
	return response;
};
