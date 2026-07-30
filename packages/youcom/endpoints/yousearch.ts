import { logEventFromContext } from 'corsair/core';
import { makeYoucomSearchRequest } from '../client';
import type { YoucomEndpoints } from '../index';
import { YouSearchRequestSchema, YouSearchResponseSchema } from './types';

export const youSearch: YoucomEndpoints['youSearch'] = async (ctx, input) => {
	const request = YouSearchRequestSchema.parse(input);
	const response = YouSearchResponseSchema.parse(
		await makeYoucomSearchRequest<unknown>(ctx.key, request),
	);

	const webResults = response.results.web ?? [];
	for (const result of webResults) {
		try {
			await ctx.db.searchResults.upsertByEntityId(result.url, {
				...result,
				resultType: 'web' as const,
				query: request.query,
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
				query: request.query,
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
			query: request.query,
			webResultCount: webResults.length,
			newsResultCount: newsResults.length,
		},
		'completed',
	);

	return response;
};
