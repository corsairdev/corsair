import { logEventFromContext } from 'corsair/core';
import type {
	ExtractCompletedEvent,
	ExtractFailedEvent,
	ExtractStartedEvent,
	FirecrawlWH,
} from './types';
import { createFirecrawlMatch, verifyFirecrawlWebhookSignature } from './types';

export const started: FirecrawlWH<ExtractStartedEvent> = {
	match: createFirecrawlMatch('extract.started'),

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
		if (event.type !== 'extract.started') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.extract.started',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const completed: FirecrawlWH<ExtractCompletedEvent> = {
	match: createFirecrawlMatch('extract.completed'),

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
		if (event.type !== 'extract.completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.extract.completed',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const failed: FirecrawlWH<ExtractFailedEvent> = {
	match: createFirecrawlMatch('extract.failed'),

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
		if (event.type !== 'extract.failed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.extract.failed',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
