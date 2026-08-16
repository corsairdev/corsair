import { logEventFromContext } from 'corsair/core';
import type { BotpressWebhooks } from '..';
import { createBotpressMatch, verifyBotpressWebhookSignature } from './types';

export const example: BotpressWebhooks['example'] = {
	match: createBotpressMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBotpressWebhookSignature(request, ctx.key);
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
			'botpress.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
