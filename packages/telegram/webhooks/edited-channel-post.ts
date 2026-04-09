import { logEventFromContext } from 'corsair/core';
import type { TelegramWebhooks } from '..';
import type { TelegramUpdate } from './types';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';

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

		// payload arrives as unknown from the generic webhook handler; structure is guaranteed by verifyTelegramWebhookSignature above
		const update = request.payload as TelegramUpdate;

		if (!update || !update.edited_channel_post) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event = {
			update_id: update.update_id,
			edited_channel_post: update.edited_channel_post,
		};

		if (ctx.db.messages && event.edited_channel_post.message_id) {
			try {
				await ctx.db.messages.upsertByEntityId(
					event.edited_channel_post.message_id.toString(),
					{
						...event.edited_channel_post,
						id: event.edited_channel_post.message_id.toString(),
						chat_id: event.edited_channel_post.chat.id.toString(),
						createdAt: new Date(event.edited_channel_post.date * 1000),
					},
				);
			} catch (error) {
				console.warn(
					'Failed to update edited channel post in database:',
					error,
				);
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
