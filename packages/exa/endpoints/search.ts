import { logEventFromContext } from 'corsair/core';
import type { ExaEndpoints } from '..';
import { makeExaRequest } from '../client';
import type { ExaEndpointOutputs } from './types';

export const search: ExaEndpoints['searchSearch'] = async (ctx, input) => {
	const result = await makeExaRequest<ExaEndpointOutputs['searchSearch']>(
		'search',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	if (result.results && ctx.db.searchResults) {
		try {
			for (const searchResult of result.results) {
				await ctx.db.searchResults.upsertByEntityId(searchResult.id, {
					...searchResult,
					query: input.query,
					createdAt: searchResult.publishedDate
						? new Date(searchResult.publishedDate)
						: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.search.search',
		{ query: input.query, resultCount: result.results?.length ?? 0 },
		'completed',
	);
	return result;
};

export const findSimilar: ExaEndpoints['searchFindSimilar'] = async (
	ctx,
	input,
) => {
	const result = await makeExaRequest<ExaEndpointOutputs['searchFindSimilar']>(
		'findSimilar',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	if (result.results && ctx.db.searchResults) {
		try {
			for (const searchResult of result.results) {
				await ctx.db.searchResults.upsertByEntityId(searchResult.id, {
					...searchResult,
					createdAt: searchResult.publishedDate
						? new Date(searchResult.publishedDate)
						: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.search.findSimilar',
		{ url: input.url, resultCount: result.results?.length ?? 0 },
		'completed',
	);
	return result;
};
