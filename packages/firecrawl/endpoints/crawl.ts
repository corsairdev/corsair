import { logEventFromContext } from 'corsair/core';
import { makeFirecrawlRequest } from '../client';
import type { FirecrawlEndpoints } from '../index';
import type {
	CrawlCancelResponse,
	CrawlGetResponse,
	CrawlStartResponse,
} from './types';

export const start: FirecrawlEndpoints['crawlStart'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<CrawlStartResponse>(
		'v2/crawl',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (typeof response.id === 'string' && ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(response.id, {
				id: response.id,
				kind: 'crawl',
				success: response.success,
				snapshot: response,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save crawl job to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.crawl.start',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: FirecrawlEndpoints['crawlGet'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<CrawlGetResponse>(
		`v2/crawl/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(input.id, {
				id: input.id,
				kind: 'crawl',
				success: response.success,
				snapshot: response,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save crawl job to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.crawl.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: FirecrawlEndpoints['crawlCancel'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<CrawlCancelResponse>(
		`v2/crawl/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(input.id, {
				id: input.id,
				kind: 'crawl',
				success: response.success,
				snapshot: response,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save crawl job to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.crawl.cancel',
		{ ...input },
		'completed',
	);
	return response;
};
