import { logEventFromContext } from 'corsair/core';
import type { FreshdeskWebhooks } from '..';
import { createFreshdeskMatch, verifyFreshdeskWebhookSignature } from './types';

export const example: FreshdeskWebhooks['example'] = {
	match: createFreshdeskMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFreshdeskWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'freshdesk.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
