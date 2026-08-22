import { logEventFromContext } from 'corsair/core';
import type { ApilioWebhooks } from '..';
import { createApilioMatch, verifyApilioWebhookSignature } from './types';

export const example: ApilioWebhooks['example'] = {
	match: createApilioMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyApilioWebhookSignature(request, ctx.key);
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
			'apilio.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
