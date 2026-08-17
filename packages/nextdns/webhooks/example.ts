import { logEventFromContext } from 'corsair/core';
import type { NextDNSWebhooks } from '..';
import { createNextDNSMatch, verifyNextDNSWebhookSignature } from './types';

export const example: NextDNSWebhooks['example'] = {
	match: createNextDNSMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyNextDNSWebhookSignature(request, ctx.key);
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
			'nextdns.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
