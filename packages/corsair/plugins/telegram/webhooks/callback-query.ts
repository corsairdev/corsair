import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { CallbackQueryEvent, TelegramUpdate } from './types';

export const callbackQuery: TelegramWebhooks['callbackQuery'] = {
	match: createTelegramMatch('callback_query'),

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

		if (!update || !update.callback_query) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: CallbackQueryEvent = {
			update_id: update.update_id,
			callback_query: update.callback_query,
		};

		await logEventFromContext(
			ctx,
			'telegram.webhook.callbackQuery',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
