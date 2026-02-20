import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { InlineQueryEvent, TelegramUpdate } from './types';

export const inlineQuery: TelegramWebhooks['inlineQuery'] = {
	match: createTelegramMatch('inline_query'),

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

		if (!update || !update.inline_query) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: InlineQueryEvent = {
			update_id: update.update_id,
			inline_query: update.inline_query,
		};

		await logEventFromContext(
			ctx,
			'telegram.webhook.inlineQuery',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
