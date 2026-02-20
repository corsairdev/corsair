import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { EditedMessageEvent, TelegramUpdate } from './types';

export const editedMessage: TelegramWebhooks['editedMessage'] = {
	match: createTelegramMatch('edited_message'),

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

		if (!update || !update.edited_message) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: EditedMessageEvent = {
			update_id: update.update_id,
			edited_message: update.edited_message,
		};

		if (ctx.db.messages && event.edited_message.message_id) {
			try {
				await ctx.db.messages.upsertByEntityId(
					event.edited_message.message_id.toString(),
					{
						id: event.edited_message.message_id.toString(),
						message_id: event.edited_message.message_id,
						chat_id: event.edited_message.chat.id.toString(),
						date: event.edited_message.date,
						text: event.edited_message.text,
						caption: event.edited_message.caption,
						edit_date: event.edited_message.edit_date,
						createdAt: new Date(event.edited_message.date * 1000),
					},
				);
			} catch (error) {
				console.warn('Failed to update edited message in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'telegram.webhook.editedMessage',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
