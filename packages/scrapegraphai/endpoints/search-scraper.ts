import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	SearchScraperHistoryResponse,
	SearchScraperStartResponse,
	SearchScraperStatusResponse,
} from './types';

async function saveJobSnapshot(
	ctx: Parameters<ScrapegraphAiEndpoints['searchScraperStart']>[0],
	response: { request_id?: string; status?: string },
) {
	if (!response.request_id || !ctx.db.jobs) return;
	try {
		await ctx.db.jobs.upsertByEntityId(response.request_id, {
			id: response.request_id,
			kind: 'searchscraper',
			status: response.status,
			snapshot: response,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save searchscraper job snapshot:', error);
	}
}

export const start: ScrapegraphAiEndpoints['searchScraperStart'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SearchScraperStartResponse>(
		'v1/searchscraper',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await saveJobSnapshot(ctx, response);
	const { headers: _headers, output_schema: _schema, ...audit } = input;
	await logEventFromContext(
		ctx,
		'scrapegraphai.searchScraper.start',
		audit,
		'completed',
	);
	return response;
};

export const status: ScrapegraphAiEndpoints['searchScraperStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SearchScraperStatusResponse>(
		`v1/searchscraper/${input.request_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await saveJobSnapshot(ctx, { ...response, request_id: input.request_id });
	await logEventFromContext(
		ctx,
		'scrapegraphai.searchScraper.status',
		{ ...input },
		'completed',
	);
	return response;
};

export const history: ScrapegraphAiEndpoints['searchScraperHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SearchScraperHistoryResponse>(
		'v1/history/searchscraper',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.searchScraper.history',
		{ ...input },
		'completed',
	);
	return response;
};
