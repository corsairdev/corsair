import { logEventFromContext } from 'corsair/core';
import type { ChatfaiWebhooks } from '..';
import { createChatfaiMatch, verifyChatfaiWebhookSignature } from './types';

export const example: ChatfaiWebhooks['example'] = {
	match: createChatfaiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyChatfaiWebhookSignature(request, ctx.key);
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
			'chatfai.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
