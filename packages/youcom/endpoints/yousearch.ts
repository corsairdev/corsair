import { logEventFromContext } from 'corsair/core';
import { makeYoucomSearchRequest } from '../client';
import type { YoucomEndpoints } from '../index';
import type { YouSearchResponse } from './types';

export const youSearch: YoucomEndpoints['youSearch'] = async (ctx, input) => {
	const response = await makeYoucomSearchRequest<YouSearchResponse>(
		ctx.key,
		input,
	);

	const webResults = response.results.web ?? [];
	for (const result of webResults) {
		try {
			await ctx.db.searchResults.upsertByEntityId(result.url, {
				...result,
				resultType: 'web' as const,
				query: input.query,
				searchedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[youcom] Failed to save web search result ${result.url}:`,
				error,
			);
		}
	}

	const newsResults = response.results.news ?? [];
	for (const result of newsResults) {
		try {
			await ctx.db.searchResults.upsertByEntityId(result.url, {
				...result,
				resultType: 'news' as const,
				query: input.query,
				searchedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[youcom] Failed to save news search result ${result.url}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'youcom.yousearch.youSearch',
		{
			query: input.query,
			webResultCount: webResults.length,
			newsResultCount: newsResults.length,
		},
		'completed',
	);

	return response;
};
