import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserWebhooks } from '..';
import { createHyperbrowserMatch, verifyHyperbrowserWebhookSignature } from './types';

export const example: HyperbrowserWebhooks['example'] = {
	match: createHyperbrowserMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHyperbrowserWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'hyperbrowser.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
