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

export const getEverything: NewsApiEndpoints['articlesGetEverything'] = async (
	ctx,
	rawInput,
) => {
	const input =
		NewsApiEndpointInputSchemas.articlesGetEverything.parse(rawInput);

	const raw = await makeNewsApiRequest('v2/everything', ctx.key, {
		query: {
			q: input.q,
			qInTitle: input.qInTitle,
			searchIn: input.searchIn,
			sources: toCsv(input.sources),
			domains: toCsv(input.domains),
			excludeDomains: toCsv(input.excludeDomains),
			from: input.from,
			to: input.to,
			language: input.language,
			sortBy: input.sortBy,
			pageSize: input.pageSize,
			page: input.page,
		},
	});
	const response =
		NewsApiEndpointOutputSchemas.articlesGetEverything.parse(raw);

	if (ctx.db.articles) {
		try {
			for (const article of response.articles) {
				if (article.url) {
					await ctx.db.articles.upsertByEntityId(article.url, { ...article });
				}
			}
		} catch (error) {
			console.warn('Failed to save articles to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'newsapi.articles.getEverything',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTopHeadlines: NewsApiEndpoints['articlesGetTopHeadlines'] =
	async (ctx, rawInput) => {
		const input =
			NewsApiEndpointInputSchemas.articlesGetTopHeadlines.parse(rawInput);

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
		const response =
			NewsApiEndpointOutputSchemas.articlesGetTopHeadlines.parse(raw);

		if (ctx.db.articles) {
			try {
				for (const article of response.articles) {
					if (article.url) {
						await ctx.db.articles.upsertByEntityId(article.url, {
							...article,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save top headlines to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'newsapi.articles.getTopHeadlines',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getV1: NewsApiEndpoints['articlesGetV1'] = async (
	ctx,
	rawInput,
) => {
	const input = NewsApiEndpointInputSchemas.articlesGetV1.parse(rawInput);

	const raw = await makeNewsApiRequest('v1/articles', ctx.key, {
		query: {
			source: input.source,
			sortBy: input.sortBy,
		},
	});
	const response = NewsApiEndpointOutputSchemas.articlesGetV1.parse(raw);

	await logEventFromContext(
		ctx,
		'newsapi.articles.getV1',
		{ ...input },
		'completed',
	);
	return response;
};
