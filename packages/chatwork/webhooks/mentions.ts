import { logEventFromContext } from 'corsair/core';
import type { ChatworkWebhooks } from '../index';
import { createChatworkMatch, verifyChatworkWebhookSignature } from './types';

export const toMe: ChatworkWebhooks['mentionToMe'] = {
	match: createChatworkMatch('mention_to_me'),
	handler: async (ctx, request) => {
		const { valid, error } = verifyChatworkWebhookSignature(request, ctx.key);
		if (!valid) {
			return {
				success: false,
				statusCode: 200,
				error: error || 'Signature verification failed',
			};
		}

		if (ctx.db.messages) {
			try {
				const event = request.payload.webhook_event;
				await ctx.db.messages.upsertByEntityId(event.message_id, {
					message_id: event.message_id,
					room_id: event.room_id,
					body: event.body,
					send_time: event.send_time,
					account: {
						account_id: event.from_account_id,
						name: '',
					},
				});
			} catch (dbError) {
				console.warn('Failed to save Chatwork mention_to_me webhook:', dbError);
			}
		}

		await logEventFromContext(
			ctx,
			'chatwork.webhook.mentionToMe',
			{ ...request.payload },
			'completed',
		);

		return {
			success: true,
			data: request.payload,
		};
	},
};
