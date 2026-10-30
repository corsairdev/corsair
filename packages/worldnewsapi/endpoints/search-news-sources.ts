import { logEventFromContext } from 'corsair/core';
import { makeWorldNewsApiRequest } from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { SearchNewsSourcesOutputSchema } from './types';

export const searchNewsSources: WorldNewsApiEndpoints['newsSearchNewsSources'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean | undefined> = {
			name: input.name,
		};

		const response = await makeWorldNewsApiRequest(
			'search-news-sources',
			ctx.key,
			{
				method: 'GET',
				query,
			},
			SearchNewsSourcesOutputSchema,
		);

		if (response.sources && Array.isArray(response.sources)) {
			for (const source of response.sources) {
				try {
					await ctx.db.sources.upsertByEntityId(source.url || source.name, {
						...source,
						searchedAt: new Date(),
					});
				} catch (error) {
					// Ignore DB cache errors
				}
			}
		}

		await logEventFromContext(
			ctx,
			'worldnewsapi.news.searchNewsSources',
			{ name: input.name, availableCount: response.available },
			'completed',
		);

		return response;
	};
