import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import type { ScrapeRunResponse } from './types';

export const run: FirecrawlEndpoints['scrapeRun'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<ScrapeRunResponse>(
		'v2/scrape',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	const scrapeId = response.data?.metadata?.scrapeId;
	if (!!scrapeId && ctx.db.scrapes) {
		try {
			await ctx.db.scrapes.upsertByEntityId(scrapeId, {
				id: scrapeId,
				url: response.data?.metadata?.url,
				sourceURL: response.data?.metadata?.sourceURL,
				success: response.success,
				markdown: response.data?.markdown,
				metadata: response.data?.metadata,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save scrape to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.scrape.run',
		{ ...input },
		'completed',
	);
	return response;
};
