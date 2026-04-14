import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import type { TavilySearchResponse } from './types';

export const search: TavilyEndpoints['search'] = async (ctx, input) => {
	const response = await makeTavilyRequest<TavilySearchResponse>('search', ctx.key, {
		method: 'POST',
		body: input,
	});

	for (const result of response.results) {
		try {
			await ctx.db.searchResults.upsertByEntityId(result.url, {
				...result,
				query: input.query,
				searchedAt: new Date(),
			});
		} catch (error) {
			console.warn(`[tavily] Failed to save search result ${result.url}:`, error);
		}
	}

	await logEventFromContext(
		ctx,
		'tavily.search',
		{ query: input.query, resultCount: response.results.length },
		'completed',
	);

	return response;
};
