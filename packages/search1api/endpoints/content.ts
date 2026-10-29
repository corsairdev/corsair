import type { Search1APIEndpoints } from '..';
import { makeSearch1APIRequest, requestSearch1APIScreenshot } from '../client';
import { callSearch1API } from './call';
import {
	Search1APIEndpointInputSchemas,
	Search1APIEndpointOutputSchemas,
} from './types';

export const crawl: Search1APIEndpoints['crawl'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.content.crawl',
		Search1APIEndpointInputSchemas.crawl,
		Search1APIEndpointOutputSchemas.crawl,
		input,
		(validated) =>
			makeSearch1APIRequest('/crawl', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			url: validated.url,
			title: response.results.title,
			contentLength: response.results.content.length,
		}),
	);
};

export const crawlBatch: Search1APIEndpoints['crawlBatch'] = async (
	ctx,
	input,
) => {
	return callSearch1API(
		ctx,
		'search1api.content.crawlBatch',
		Search1APIEndpointInputSchemas.crawlBatch,
		Search1APIEndpointOutputSchemas.crawlBatch,
		input,
		(validated) =>
			makeSearch1APIRequest('/crawl', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			urlCount: validated.length,
			resultCount: response.length,
		}),
	);
};

export const screenshot: Search1APIEndpoints['screenshot'] = async (
	ctx,
	input,
) => {
	return callSearch1API(
		ctx,
		'search1api.content.screenshot',
		Search1APIEndpointInputSchemas.screenshot,
		Search1APIEndpointOutputSchemas.screenshot,
		input,
		(validated) => requestSearch1APIScreenshot(validated, ctx.key),
		(validated, response) => ({
			url: validated.url,
			format: validated.format ?? 'png',
			contentType: response.contentType,
			sizeBytes: response.sizeBytes,
		}),
	);
};

export const sitemap: Search1APIEndpoints['sitemap'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.content.sitemap',
		Search1APIEndpointInputSchemas.sitemap,
		Search1APIEndpointOutputSchemas.sitemap,
		input,
		(validated) =>
			makeSearch1APIRequest('/sitemap', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			url: validated.url,
			linkCount: response.links.length,
		}),
	);
};

export const extract: Search1APIEndpoints['extract'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.content.extract',
		Search1APIEndpointInputSchemas.extract,
		Search1APIEndpointOutputSchemas.extract,
		input,
		(validated) =>
			makeSearch1APIRequest('/extract', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			url: validated.url,
			hasResults: response.results != null,
		}),
	);
};
