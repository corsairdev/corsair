import { logEventFromContext } from 'corsair/core';
import type { RevAIWebhooks } from '..';
import { createRevAIMatch, verifyRevAIWebhookSignature } from './types';

export const example: RevAIWebhooks['example'] = {
	match: createRevAIMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyRevAIWebhookSignature(request, ctx.key);
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

		await logEventFromContext(
			ctx,
			'revai.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
