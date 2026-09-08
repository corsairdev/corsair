import { logEventFromContext } from 'corsair/core';
import type { ReplyioWebhooks } from '..';
import { createReplyioMatch, verifyReplyioWebhookSignature } from './types';

export const example: ReplyioWebhooks['example'] = {
	match: createReplyioMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyReplyioWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'replyio.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
