import type { CalWebhooks } from '..';
import { createCalMatch, verifyCalWebhookSignature } from './types';

export const ping: CalWebhooks['ping'] = {
	match: createCalMatch('PING'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyCalWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		return {
			success: true,
			data: request.payload,
		};
	},
};
