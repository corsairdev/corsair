import type { Search1APIEndpoints } from '..';
import { makeSearch1APIRequest } from '../client';
import { callSearch1API } from './call';
import {
	Search1APIEndpointInputSchemas,
	Search1APIEndpointOutputSchemas,
} from './types';

export const search: Search1APIEndpoints['search'] = async (ctx, input) => {
	const result = await callSearch1API(
		ctx,
		'search1api.web.search',
		Search1APIEndpointInputSchemas.search,
		Search1APIEndpointOutputSchemas.search,
		input,
		(validated) =>
			makeSearch1APIRequest('/search', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			query: validated.query,
			service: response.searchParameters.search_service,
			resultCount: response.results.length,
		}),
	);

	if (result.results.length > 0 && ctx.db.searchResults) {
		try {
			for (const hit of result.results) {
				if (!hit.link) continue;
				await ctx.db.searchResults.upsertByEntityId(hit.link, {
					title: hit.title,
					link: hit.link,
					snippet: hit.snippet,
					content: hit.content,
					publishedDate: hit.published_date
						? new Date(hit.published_date)
						: undefined,
					service: result.searchParameters.search_service,
					query: input.query,
					createdAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save Search1API results to database:', error);
		}
	}

	return result;
};

export const searchBatch: Search1APIEndpoints['searchBatch'] = async (
	ctx,
	input,
) => {
	return callSearch1API(
		ctx,
		'search1api.web.searchBatch',
		Search1APIEndpointInputSchemas.searchBatch,
		Search1APIEndpointOutputSchemas.searchBatch,
		input,
		(validated) =>
			makeSearch1APIRequest('/search', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			queryCount: validated.length,
			successful: response.summary.successful,
			totalCost: response.summary.totalCost,
		}),
	);
};

export const news: Search1APIEndpoints['news'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.web.news',
		Search1APIEndpointInputSchemas.news,
		Search1APIEndpointOutputSchemas.news,
		input,
		(validated) =>
			makeSearch1APIRequest('/news', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			query: validated.query,
			service: response.searchParameters.search_service,
			resultCount: response.results.length,
		}),
	);
};

export const newsBatch: Search1APIEndpoints['newsBatch'] = async (
	ctx,
	input,
) => {
	return callSearch1API(
		ctx,
		'search1api.web.newsBatch',
		Search1APIEndpointInputSchemas.newsBatch,
		Search1APIEndpointOutputSchemas.newsBatch,
		input,
		(validated) =>
			makeSearch1APIRequest('/news', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			queryCount: validated.length,
			successful: response.summary.successful,
			totalCost: response.summary.totalCost,
		}),
	);
};

export const ask: Search1APIEndpoints['ask'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.web.ask',
		Search1APIEndpointInputSchemas.ask,
		Search1APIEndpointOutputSchemas.ask,
		input,
		(validated) =>
			makeSearch1APIRequest('/ask', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			query: validated.query,
			intent: response.intent.search_query,
			sources: response.intent.sources.length,
			resultCount: response.results.length,
		}),
	);
};

export const trending: Search1APIEndpoints['trending'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.web.trending',
		Search1APIEndpointInputSchemas.trending,
		Search1APIEndpointOutputSchemas.trending,
		input,
		(validated) =>
			makeSearch1APIRequest('/trending', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			service: validated.search_service,
			resultCount: response.results.length,
		}),
	);
};

export const feedback: Search1APIEndpoints['feedback'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.web.feedback',
		Search1APIEndpointInputSchemas.feedback,
		Search1APIEndpointOutputSchemas.feedback,
		input,
		(validated) =>
			makeSearch1APIRequest('/feedback', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(_validated, response) => ({
			id: response.id,
			status: response.status,
		}),
	);
};
