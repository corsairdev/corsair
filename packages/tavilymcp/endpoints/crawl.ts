import { logEventFromContext } from 'corsair/core';
import { makeTavilyMcpRequest } from '../client';
import type { TavilyMcpEndpoints } from '../index';
import type { TavilyCrawlResponse } from './types';

export const crawl: TavilyMcpEndpoints['crawl'] = async (ctx, input) => {
	const response = await makeTavilyMcpRequest<TavilyCrawlResponse>(
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
				`[tavilymcp] Failed to save crawl result ${result.url}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tavilymcp.tavily.crawl',
		{ baseUrl: input.url, resultCount: response.results.length },
		'completed',
	);

	return response;
};
