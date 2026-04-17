import { logEventFromContext } from 'corsair/core';
import type {
	CrawlCompletedEvent,
	CrawlPageEvent,
	CrawlStartedEvent,
	FirecrawlWH,
} from './types';
import { createFirecrawlMatch, verifyFirecrawlWebhookSignature } from './types';

export const started: FirecrawlWH<CrawlStartedEvent> = {
	match: createFirecrawlMatch('crawl.started'),

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
		if (event.type !== 'crawl.started') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.crawl.started',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const page: FirecrawlWH<CrawlPageEvent> = {
	match: createFirecrawlMatch('crawl.page'),

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
		if (event.type !== 'crawl.page') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.crawl.page',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const completed: FirecrawlWH<CrawlCompletedEvent> = {
	match: createFirecrawlMatch('crawl.completed'),

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
		if (event.type !== 'crawl.completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.crawl.completed',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
