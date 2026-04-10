import { logEventFromContext } from 'corsair/core';
import type { StripeWebhooks } from '..';
import { createStripeEventMatch, verifyStripeWebhookSignature } from './types';

export const ping: StripeWebhooks['ping'] = {
	match: createStripeEventMatch('v2.core.event_destination.ping'),

	handler: async (ctx, request) => {
		const verification = verifyStripeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'stripe.webhook.ping',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
