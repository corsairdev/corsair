import type { SendGridWebhooks } from '..';
import { createSendGridMatch, verifySendGridWebhookSignature } from './types';

export const emailEvent: SendGridWebhooks['emailEvent'] = {
	match: createSendGridMatch(),
	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySendGridWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const events = Array.isArray(request.payload)
			? request.payload
			: request.payload
				? [request.payload]
				: [];
		return {
			success: true,
			data: {
				events,
			},
		};
	},
};
