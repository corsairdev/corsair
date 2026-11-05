import { logEventFromContext } from 'corsair/core';
import { makeWorldNewsApiRequest } from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { SearchNewsOutputSchema } from './types';

export const searchNews: WorldNewsApiEndpoints['newsSearchNews'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		text: input.text,
		'text-match-indexes': input.textMatchIndexes,
		'source-country': input.sourceCountry,
		language: input.language,
		'min-sentiment': input.minSentiment,
		'max-sentiment': input.maxSentiment,
		'earliest-publish-date': input.earliestPublishDate,
		'latest-publish-date': input.latestPublishDate,
		'news-sources': input.newsSources,
		authors: input.authors,
		categories: input.categories,
		entities: input.entities,
		'location-filter': input.locationFilter,
		sort: input.sort,
		'sort-direction': input.sortDirection,
		offset: input.offset,
		number: input.number,
	};

	const response = await makeWorldNewsApiRequest(
		'search-news',
		ctx.key,
		{
			method: 'GET',
			query,
		},
		SearchNewsOutputSchema,
	);

	if (response.news && Array.isArray(response.news)) {
		for (const article of response.news) {
			try {
				await ctx.db.articles.upsertByEntityId(String(article.id), {
					...article,
					createdAt: new Date(),
				});
			} catch (error) {
				// Ignore DB cache errors
			}
		}
	}

	await logEventFromContext(
		ctx,
		'worldnewsapi.news.searchNews',
		{
			query: input.text,
			resultCount: response.news?.length ?? 0,
			available: response.available,
		},
		'completed',
	);

	return response;
};
