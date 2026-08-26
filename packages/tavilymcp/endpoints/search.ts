import { logEventFromContext } from 'corsair/core';
import { makeTavilyMcpRequest } from '../client';
import type { TavilyMcpEndpoints } from '../index';
import type { TavilySearchResponse } from './types';
import { TavilySearchRequestSchema, TavilySearchResponseSchema } from './types';

// Scoped by query: the same URL scores differently per query, and keying on the
// URL alone would let a later search overwrite an earlier one. Both halves are
// encoded so the separator cannot occur inside either: a raw `${query}:${url}`
// lets ('read mailto:foo', 'https://a.com') and ('read mailto',
// 'foo:https://a.com') collide, and both of those URLs pass z.string().url().
const searchResultEntityId = (query: string, url: string) =>
	`${encodeURIComponent(query)}:${encodeURIComponent(url)}`;

export const search: TavilyMcpEndpoints['search'] = async (ctx, input) => {
	const query = TavilySearchRequestSchema.parse(input);

	const response = TavilySearchResponseSchema.parse(
		await makeTavilyMcpRequest<TavilySearchResponse>('search', ctx.key, {
			method: 'POST',
			body: query,
		}),
	);

	for (const result of response.results) {
		try {
			await ctx.db.searchResults.upsertByEntityId(
				searchResultEntityId(query.query, result.url),
				{
					...result,
					query: query.query,
					searchedAt: new Date(),
				},
			);
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
		{ query: query.query, resultCount: response.results.length },
		'completed',
	);

	return response;
};
