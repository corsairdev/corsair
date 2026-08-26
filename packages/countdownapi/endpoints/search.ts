import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { makeCountdownApiRequest } from '../client';
import type { SearchResponse } from './types';

export const get: CountdownApiEndpoints['search'] = async (ctx, input) => {
	const response = await makeCountdownApiRequest<SearchResponse>(
		'/request',
		ctx.key,
		{
			type: 'search',
			query: input.query,
			ebay_domain: input.ebay_domain,
		},
	);

	await logEventFromContext(
		ctx,
		'countdownapi.search.get',
		{ ...input },
		'completed',
	);

	return response;
};
