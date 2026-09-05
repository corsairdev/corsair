import { logEventFromContext } from 'corsair/core';
import type { SnapchatWebhooks } from '..';
import { createSnapchatMatch, verifySnapchatWebhookSignature } from './types';

export const example: SnapchatWebhooks['example'] = {
	match: createSnapchatMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifySnapchatWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'snapchat.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
