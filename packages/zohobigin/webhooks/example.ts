import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginWebhooks } from '..';
import { createZohoBiginMatch, verifyZohoBiginWebhookSignature } from './types';

export const example: ZohoBiginWebhooks['example'] = {
	match: createZohoBiginMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyZohoBiginWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'zohobigin.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
