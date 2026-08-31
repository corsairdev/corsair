import { logEventFromContext } from 'corsair/core';
import { makeNewsApiRequest } from '../client';
import type { NewsApiEndpoints } from '../index';
import {
	NewsApiEndpointInputSchemas,
	NewsApiEndpointOutputSchemas,
} from './types';

function toCsv(value: string | string[] | undefined): string | undefined {
	if (value === undefined) return undefined;
	return Array.isArray(value) ? value.join(',') : value;
}

export const getTop: NewsApiEndpoints['headlinesGetTop'] = async (
	ctx,
	rawInput,
) => {
	const input = NewsApiEndpointInputSchemas.headlinesGetTop.parse(rawInput);

	const raw = await makeNewsApiRequest('v2/top-headlines', ctx.key, {
		query: {
			country: input.country,
			category: input.category,
			sources: toCsv(input.sources),
			q: input.q,
			pageSize: input.pageSize,
			page: input.page,
		},
	});
	const response = NewsApiEndpointOutputSchemas.headlinesGetTop.parse(raw);

	if (ctx.db.articles) {
		try {
			for (const article of response.articles) {
				if (article.url) {
					await ctx.db.articles.upsertByEntityId(article.url, { ...article });
				}
			}
		} catch (error) {
			console.warn('Failed to save top headlines to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'newsapi.headlines.getTop',
		{ ...input },
		'completed',
	);
	return response;
};
