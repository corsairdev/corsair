import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	SmartCrawlerHistoryResponse,
	SmartCrawlerStartResponse,
	SmartCrawlerStatusResponse,
	SmartCrawlerWebhookLogsResponse,
} from './types';

async function saveJobSnapshot(
	ctx: Parameters<ScrapegraphAiEndpoints['smartCrawlerStart']>[0],
	id: string | undefined,
	response: { status?: string },
) {
	if (!id || !ctx.db.jobs) return;
	try {
		await ctx.db.jobs.upsertByEntityId(id, {
			id,
			kind: 'smartcrawler',
			status: response.status,
			snapshot: response,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save smartcrawler job snapshot:', error);
	}
}

export const start: ScrapegraphAiEndpoints['smartCrawlerStart'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SmartCrawlerStartResponse>(
		'v1/crawl',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await saveJobSnapshot(ctx, response.task_id ?? response.request_id, response);
	const { schema: _schema, webhook_url: _hook, ...audit } = input;
	await logEventFromContext(
		ctx,
		'scrapegraphai.smartCrawler.start',
		audit,
		'completed',
	);
	return response;
};

export const status: ScrapegraphAiEndpoints['smartCrawlerStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SmartCrawlerStatusResponse>(
		`v1/crawl/${input.task_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await saveJobSnapshot(ctx, input.task_id, response);
	await logEventFromContext(
		ctx,
		'scrapegraphai.smartCrawler.status',
		{ ...input },
		'completed',
	);
	return response;
};

export const history: ScrapegraphAiEndpoints['smartCrawlerHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SmartCrawlerHistoryResponse>(
		'v1/history/crawl',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.smartCrawler.history',
		{ ...input },
		'completed',
	);
	return response;
};

export const webhookLogs: ScrapegraphAiEndpoints['smartCrawlerWebhookLogs'] =
	async (ctx, input) => {
		const response =
			await makeScrapegraphAiRequest<SmartCrawlerWebhookLogsResponse>(
				`v1/webhook/logs/${input.crawler_id}`,
				ctx.key,
				{ method: 'GET' },
			);

		await logEventFromContext(
			ctx,
			'scrapegraphai.smartCrawler.webhookLogs',
			{ ...input },
			'completed',
		);
		return response;
	};
