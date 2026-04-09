import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import { persistScrape } from './persist';
import type { FirecrawlEndpointOutputs } from './types';

export const run: FirecrawlEndpoints['scrapeRun'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['scrapeRun']
	>('v2/scrape', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	await persistScrape(ctx, response);

	await logEventFromContext(
		ctx,
		'firecrawl.scrape.run',
		{ ...input },
		'completed',
	);
	return response;
};
