import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { MessageEvent, TelegramUpdate } from './types';

export const message: TelegramWebhooks['message'] = {
	match: createTelegramMatch('message'),

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

		if (!update || !update.message) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: MessageEvent = {
			update_id: update.update_id,
			message: update.message,
		};

		let corsairEntityId = '';

		if (ctx.db.messages && event.message.message_id) {
			try {
				const entity = await ctx.db.messages.upsertByEntityId(
					event.message.message_id.toString(),
					{
						id: event.message.message_id.toString(),
						message_id: event.message.message_id,
						chat_id: event.message.chat.id.toString(),
						authorId: event.message.from?.id.toString(),
						date: event.message.date,
						text: event.message.text,
						caption: event.message.caption,
						createdAt: new Date(event.message.date * 1000),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'telegram.webhook.message',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
