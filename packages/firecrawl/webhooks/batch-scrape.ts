import { logEventFromContext } from 'corsair/core';
import type {
	BatchScrapeCompletedEvent,
	BatchScrapePageEvent,
	BatchScrapeStartedEvent,
	FirecrawlWH,
} from './types';
import { createFirecrawlMatch, verifyFirecrawlWebhookSignature } from './types';

export const started: FirecrawlWH<BatchScrapeStartedEvent> = {
	match: createFirecrawlMatch('batch_scrape.started'),

	handler: async (ctx, request) => {
		const verification = verifyFirecrawlWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'batch_scrape.started') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.batch_scrape.started',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const page: FirecrawlWH<BatchScrapePageEvent> = {
	match: createFirecrawlMatch('batch_scrape.page'),

	handler: async (ctx, request) => {
		const verification = verifyFirecrawlWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'batch_scrape.page') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.batch_scrape.page',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const completed: FirecrawlWH<BatchScrapeCompletedEvent> = {
	match: createFirecrawlMatch('batch_scrape.completed'),

	handler: async (ctx, request) => {
		const verification = verifyFirecrawlWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'batch_scrape.completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.batch_scrape.completed',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
