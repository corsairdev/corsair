import { logEventFromContext } from 'corsair/core';
import { makeWorldNewsApiRequest } from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { TopNewsOutputSchema } from './types';

export const topNews: WorldNewsApiEndpoints['newsTopNews'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		'source-country': input.sourceCountry,
		language: input.language,
		date: input.date,
		'headlines-only': input.headlinesOnly,
		'max-news-per-cluster': input.maxNewsPerCluster,
	};

	const response = await makeWorldNewsApiRequest(
		'top-news',
		ctx.key,
		{
			method: 'GET',
			query,
		},
		TopNewsOutputSchema,
	);

	// Persist articles if db is available
	if (response.top_news && Array.isArray(response.top_news)) {
		for (const cluster of response.top_news) {
			if (cluster.news && Array.isArray(cluster.news)) {
				for (const article of cluster.news) {
					try {
						await ctx.db.articles.upsertByEntityId(String(article.id), {
							...article,
							createdAt: new Date(),
						});
					} catch (error) {
						// Database caching error should not fail the API call
					}
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'worldnewsapi.news.topNews',
		{
			sourceCountry: input.sourceCountry,
			language: input.language,
			clustersCount: response.top_news?.length ?? 0,
		},
		'completed',
	);

	return response;
};
