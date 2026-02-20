import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { EditedChannelPostEvent, TelegramUpdate } from './types';

export const editedChannelPost: TelegramWebhooks['editedChannelPost'] = {
	match: createTelegramMatch('edited_channel_post'),

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

		if (!update || !update.edited_channel_post) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: EditedChannelPostEvent = {
			update_id: update.update_id,
			edited_channel_post: update.edited_channel_post,
		};

		if (ctx.db.messages && event.edited_channel_post.message_id) {
			try {
				await ctx.db.messages.upsertByEntityId(
					event.edited_channel_post.message_id.toString(),
					{
						id: event.edited_channel_post.message_id.toString(),
						message_id: event.edited_channel_post.message_id,
						chat_id: event.edited_channel_post.chat.id.toString(),
						date: event.edited_channel_post.date,
						text: event.edited_channel_post.text,
						caption: event.edited_channel_post.caption,
						edit_date: event.edited_channel_post.edit_date,
						createdAt: new Date(event.edited_channel_post.date * 1000),
					},
				);
			} catch (error) {
				console.warn('Failed to update edited channel post in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'telegram.webhook.editedChannelPost',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
