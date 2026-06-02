import { logEventFromContext } from 'corsair/core';
import type { ZendeskWebhooks } from '..';
import { createZendeskMatch, verifyZendeskWebhookSignature } from './types';

export const example: ZendeskWebhooks['example'] = {
	match: createZendeskMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyZendeskWebhookSignature(request, ctx.key);
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
			'zendesk.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
