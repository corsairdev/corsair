import { logEventFromContext } from 'corsair/core';
import type { FreeAgentWebhooks } from '..';
import { createFreeAgentMatch, verifyFreeAgentWebhookSignature } from './types';

export const example: FreeAgentWebhooks['example'] = {
	match: createFreeAgentMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFreeAgentWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'freeagent.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
