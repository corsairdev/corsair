import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { ChannelPostEvent, TelegramUpdate } from './types';

export const channelPost: TelegramWebhooks['channelPost'] = {
	match: createTelegramMatch('channel_post'),

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

		if (!update || !update.channel_post) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: ChannelPostEvent = {
			update_id: update.update_id,
			channel_post: update.channel_post,
		};

		let corsairEntityId = '';

		if (ctx.db.messages && event.channel_post.message_id) {
			try {
				const entity = await ctx.db.messages.upsertByEntityId(
					event.channel_post.message_id.toString(),
					{
						id: event.channel_post.message_id.toString(),
						message_id: event.channel_post.message_id,
						chat_id: event.channel_post.chat.id.toString(),
						date: event.channel_post.date,
						text: event.channel_post.text,
						caption: event.channel_post.caption,
						createdAt: new Date(event.channel_post.date * 1000),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save channel post to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'telegram.webhook.channelPost',
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
