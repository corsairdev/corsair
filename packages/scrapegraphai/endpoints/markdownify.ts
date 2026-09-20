import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	MarkdownifyHistoryResponse,
	MarkdownifyStartResponse,
	MarkdownifyStatusResponse,
} from './types';

async function saveJobSnapshot(
	ctx: Parameters<ScrapegraphAiEndpoints['markdownifyStart']>[0],
	response: { request_id?: string; status?: string; website_url?: string },
) {
	if (!response.request_id || !ctx.db.jobs) return;
	try {
		await ctx.db.jobs.upsertByEntityId(response.request_id, {
			id: response.request_id,
			kind: 'markdownify',
			status: response.status,
			websiteUrl: response.website_url,
			snapshot: response,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save markdownify job snapshot:', error);
	}
}

export const start: ScrapegraphAiEndpoints['markdownifyStart'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<MarkdownifyStartResponse>(
		'v1/markdownify',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await saveJobSnapshot(ctx, response);
	const { headers: _headers, ...audit } = input;
	await logEventFromContext(
		ctx,
		'scrapegraphai.markdownify.start',
		audit,
		'completed',
	);
	return response;
};

export const status: ScrapegraphAiEndpoints['markdownifyStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<MarkdownifyStatusResponse>(
		`v1/markdownify/${input.request_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await saveJobSnapshot(ctx, { ...response, request_id: input.request_id });
	await logEventFromContext(
		ctx,
		'scrapegraphai.markdownify.status',
		{ ...input },
		'completed',
	);
	return response;
};

export const history: ScrapegraphAiEndpoints['markdownifyHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<MarkdownifyHistoryResponse>(
		'v1/history/markdownify',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.markdownify.history',
		{ ...input },
		'completed',
	);
	return response;
};
