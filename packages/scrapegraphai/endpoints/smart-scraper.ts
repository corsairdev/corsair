import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	SmartScraperHistoryResponse,
	SmartScraperStartResponse,
	SmartScraperStatusResponse,
} from './types';

async function saveJobSnapshot(
	ctx: Parameters<ScrapegraphAiEndpoints['smartScraperStart']>[0],
	response: {
		request_id?: string;
		status?: string;
		website_url?: string | null;
	},
) {
	if (!response.request_id || !ctx.db.jobs) return;
	try {
		await ctx.db.jobs.upsertByEntityId(response.request_id, {
			id: response.request_id,
			kind: 'smartscraper',
			status: response.status,
			websiteUrl: response.website_url,
			snapshot: response,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save smartscraper job snapshot:', error);
	}
}

export const start: ScrapegraphAiEndpoints['smartScraperStart'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SmartScraperStartResponse>(
		'v1/smartscraper',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await saveJobSnapshot(ctx, response);
	await logEventFromContext(
		ctx,
		'scrapegraphai.smartScraper.start',
		{ ...input },
		'completed',
	);
	return response;
};

export const status: ScrapegraphAiEndpoints['smartScraperStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SmartScraperStatusResponse>(
		`v1/smartscraper/${input.request_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await saveJobSnapshot(ctx, { ...response, request_id: input.request_id });
	await logEventFromContext(
		ctx,
		'scrapegraphai.smartScraper.status',
		{ ...input },
		'completed',
	);
	return response;
};

export const history: ScrapegraphAiEndpoints['smartScraperHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SmartScraperHistoryResponse>(
		'v1/history/smartscraper',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.smartScraper.history',
		{ ...input },
		'completed',
	);
	return response;
};
