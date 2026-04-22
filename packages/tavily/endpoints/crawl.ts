import { logEventFromContext } from 'corsair/core';
import { makeTavilyRequest } from '../client';
import type { TavilyEndpoints } from '../index';
import type { TavilyCrawlResponse } from './types';

export const crawl: TavilyEndpoints['crawl'] = async (ctx, input) => {
	const response = await makeTavilyRequest<TavilyCrawlResponse>(
		'crawl',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	for (const result of response.results) {
		try {
			await ctx.db.crawlResults.upsertByEntityId(result.url, {
				...result,
				baseUrl: response.base_url,
				crawledAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[tavily] Failed to save crawl result ${result.url}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tavily.crawl.crawl',
		{ baseUrl: input.url, resultCount: response.results.length },
		'completed',
	);

	return response;
};
