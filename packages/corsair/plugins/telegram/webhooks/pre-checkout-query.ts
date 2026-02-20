import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { PreCheckoutQueryEvent, TelegramUpdate } from './types';

export const preCheckoutQuery: TelegramWebhooks['preCheckoutQuery'] = {
	match: createTelegramMatch('pre_checkout_query'),

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

		const update = request.payload as TelegramUpdate;

		if (!update || !update.pre_checkout_query) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: PreCheckoutQueryEvent = {
			update_id: update.update_id,
			pre_checkout_query: update.pre_checkout_query,
		};

		await logEventFromContext(
			ctx,
			'telegram.webhook.preCheckoutQuery',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
