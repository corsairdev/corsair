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
				const existing = await ctx.db.messages.findByEntityId(event.message_id);
				await ctx.db.messages.upsertByEntityId(event.message_id, {
					...existing?.data,
					message_id: event.message_id,
					room_id: event.room_id,
					body: event.body,
					send_time: event.send_time,
					account: {
						...existing?.data?.account,
						account_id: event.from_account_id,
						name: existing?.data?.account?.name ?? '',
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
