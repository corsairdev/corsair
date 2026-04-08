import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import type { FirecrawlEndpointOutputs } from './types';

export const run: FirecrawlEndpoints['searchRun'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['searchRun']
	>('v2/search', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'firecrawl.search.run',
		{ ...input },
		'completed',
	);
	return response;
};
