import { logEventFromContext } from 'corsair/core';
import type { ReplyWebhooks } from '..';
import { createReplyMatch, verifyReplyWebhookSignature } from './types';

export const example: ReplyWebhooks['example'] = {
	match: createReplyMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyReplyWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'reply.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
