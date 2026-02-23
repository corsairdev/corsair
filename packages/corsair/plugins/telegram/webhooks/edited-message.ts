import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';

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

		const event = {
			update_id: update.update_id,
			edited_message: update.edited_message,
		};

		if (ctx.db.messages && event.edited_message.message_id) {
			try {
				await ctx.db.messages.upsertByEntityId(
					event.edited_message.message_id.toString(),
					{
						...event.edited_message,
						id: event.edited_message.message_id.toString(),
						chat_id: event.edited_message.chat.id.toString(),
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
