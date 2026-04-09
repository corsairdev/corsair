import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import { persistSiteMap } from './persist';
import type { FirecrawlEndpointOutputs } from './types';

export const run: FirecrawlEndpoints['mapRun'] = async (ctx, input) => {
	const body = input as Record<string, unknown>;
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['mapRun']
	>('v2/map', ctx.key, {
		method: 'POST',
		body,
	});

	await persistSiteMap(ctx, body, response);

	await logEventFromContext(
		ctx,
		'firecrawl.map.run',
		{ ...input },
		'completed',
	);
	return response;
};
