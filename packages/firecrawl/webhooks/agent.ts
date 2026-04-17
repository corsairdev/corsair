import { logEventFromContext } from 'corsair/core';
import type {
	AgentActionEvent,
	AgentCancelledEvent,
	AgentCompletedEvent,
	AgentFailedEvent,
	AgentStartedEvent,
	FirecrawlWH,
} from './types';
import { createFirecrawlMatch, verifyFirecrawlWebhookSignature } from './types';

export const started: FirecrawlWH<AgentStartedEvent> = {
	match: createFirecrawlMatch('agent.started'),

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
		if (event.type !== 'agent.started') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.agent.started',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const action: FirecrawlWH<AgentActionEvent> = {
	match: createFirecrawlMatch('agent.action'),

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
		if (event.type !== 'agent.action') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.agent.action',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const completed: FirecrawlWH<AgentCompletedEvent> = {
	match: createFirecrawlMatch('agent.completed'),

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
		if (event.type !== 'agent.completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.agent.completed',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const failed: FirecrawlWH<AgentFailedEvent> = {
	match: createFirecrawlMatch('agent.failed'),

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
		if (event.type !== 'agent.failed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.agent.failed',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const cancelled: FirecrawlWH<AgentCancelledEvent> = {
	match: createFirecrawlMatch('agent.cancelled'),

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
		if (event.type !== 'agent.cancelled') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'firecrawl.webhook.agent.cancelled',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
