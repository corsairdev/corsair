import { logEventFromContext } from 'corsair/core';
import type { HashnodeWebhooks } from '..';
import { createHashnodeMatch, verifyHashnodeWebhookSignature } from './types';

export const example: HashnodeWebhooks['example'] = {
	match: createHashnodeMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHashnodeWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'hashnode.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
