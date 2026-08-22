import { logEventFromContext } from 'corsair/core';
import { makeTavilyMcpRequest } from '../client';
import type { TavilyMcpEndpoints } from '../index';
import type { TavilySearchResponse } from './types';

export const search: TavilyMcpEndpoints['search'] = async (ctx, input) => {
	const response = await makeTavilyMcpRequest<TavilySearchResponse>(
		'search',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	for (const result of response.results) {
		try {
			await ctx.db.searchResults.upsertByEntityId(result.url, {
				...result,
				query: input.query,
				searchedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[tavilymcp] Failed to save search result ${result.url}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tavilymcp.tavily.search',
		{ query: input.query, resultCount: response.results.length },
		'completed',
	);

	return response;
};
