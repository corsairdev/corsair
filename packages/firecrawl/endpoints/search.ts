import { logEventFromContext } from 'corsair/core';
import { makeFirecrawlRequest } from '../client';
import type { FirecrawlEndpoints } from '../index';
import type { SearchRunResponse } from './types';

export const run: FirecrawlEndpoints['searchRun'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<SearchRunResponse>(
		'v2/search',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (ctx.db.searches) {
		try {
			await ctx.db.searches.upsertByEntityId(input.query, {
				id: input.query,
				success: response.success,
				payload: response,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save search result to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.search.run',
		{ ...input },
		'completed',
	);
	return response;
};
