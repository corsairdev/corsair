import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import { persistSearch } from './persist';
import type { FirecrawlEndpointOutputs } from './types';

export const run: FirecrawlEndpoints['searchRun'] = async (ctx, input) => {
	const body = input as Record<string, unknown>;
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['searchRun']
	>('v2/search', ctx.key, {
		method: 'POST',
		body,
	});

	await persistSearch(ctx, body, response);

	await logEventFromContext(
		ctx,
		'firecrawl.search.run',
		{ ...input },
		'completed',
	);
	return response;
};
