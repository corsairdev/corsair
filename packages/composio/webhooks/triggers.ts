import { logEventFromContext } from 'corsair/core';
import type { ComposioWebhooks } from '..';
import { createComposioMatch, verifyComposioWebhookSignature } from './types';

export const triggerFired: ComposioWebhooks['triggerFired'] = {
	match: createComposioMatch('trigger.fired'),

	handler: async (ctx, request) => {
		const verification = verifyComposioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'trigger.fired') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'composio.webhook.trigger_fired', { ...event }, 'completed');

		return { success: true, data: event };
	},
};

export const connectionStatus: ComposioWebhooks['connectionStatus'] = {
	match: createComposioMatch('connection.status'),

	handler: async (ctx, request) => {
		const verification = verifyComposioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'connection.status') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'composio.webhook.connection_status', { ...event }, 'completed');

		return { success: true, data: event };
	},
};

export const actionCompleted: ComposioWebhooks['actionCompleted'] = {
	match: createComposioMatch('action.completed'),

	handler: async (ctx, request) => {
		const verification = verifyComposioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'action.completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'composio.webhook.action_completed', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
