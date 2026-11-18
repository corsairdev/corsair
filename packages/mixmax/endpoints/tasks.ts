import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { omit } from './omit';
import type { MixmaxEndpointOutputs } from './types';

export const tasksList: MixmaxEndpoints['tasksList'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['tasksList']>(
		ctx,
		'/v1/tasks',
		{
			method: 'GET',
			query: {
				search: input.search,
				query: input.query,
				limit: input.limit,
				next: input.next,
				previous: input.previous,
				tz: input.tz,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.tasks.list',
		// Search text and the query can name contacts; log presence only.
		{
			...omit(input, 'search', 'query'),
			hasSearch: input.search !== undefined,
			hasQuery: input.query !== undefined,
		},
		'completed',
	);
	return result;
};
