import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiWebhooks } from '..';
import { createAsinDataApiMatch, verifyAsinDataApiWebhookSignature } from './types';

export const example: AsinDataApiWebhooks['example'] = {
	match: createAsinDataApiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAsinDataApiWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'asindataapi.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
