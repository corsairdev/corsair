import { logEventFromContext } from 'corsair/core';
import type { ComposioWebhooks } from '..';
import {
	createComposioMatch,
	createComposioProjectEventMatch,
	verifyComposioWebhookSignature,
} from './types';

export const triggerMessage: ComposioWebhooks['triggerMessage'] = {
	match: createComposioMatch('composio.trigger.message'),

	handler: async (ctx, request) => {
		const verification = verifyComposioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				// Hardcode — never forward verification.error (probing).
				error: 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'composio.trigger.message') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'composio.webhook.trigger_message',
			{
				trigger_slug: event.metadata.trigger_slug,
				trigger_id: event.metadata.trigger_id,
			},
			'completed',
		);

		return { success: true, data: event };
	},
};

export const projectEvent: ComposioWebhooks['projectEvent'] = {
	match: createComposioProjectEventMatch(),

	handler: async (ctx, request) => {
		const verification = verifyComposioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				// Hardcode — never forward verification.error (probing).
				error: 'Signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'composio.webhook.project_event',
			{ type: event.type },
			'completed',
		);

		return { success: true, data: event };
	},
};
