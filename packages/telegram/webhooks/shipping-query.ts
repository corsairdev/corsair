import { logEventFromContext } from 'corsair/core';
import type { TelegramWebhooks } from '../index';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';

export const shippingQuery: TelegramWebhooks['shippingQuery'] = {
	match: createTelegramMatch('shipping_query'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTelegramWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const update = request.payload;

		if (!update || !update.shipping_query) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event = {
			update_id: update.update_id,
			shipping_query: update.shipping_query,
		};

		await logEventFromContext(
			ctx,
			'telegram.webhook.shippingQuery',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
