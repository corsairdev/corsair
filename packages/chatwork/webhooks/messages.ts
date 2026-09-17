import { logEventFromContext } from 'corsair/core';
import type { ChatworkWebhooks } from '../index';
import { createChatworkMatch, verifyChatworkWebhookSignature } from './types';

export const created: ChatworkWebhooks['messageCreated'] = {
	match: createChatworkMatch('message_created'),
	handler: async (ctx, request) => {
		const { valid, error } = verifyChatworkWebhookSignature(request, ctx.key);
		if (!valid) {
			return {
				success: false,
				statusCode: 401,
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
					update_time: event.update_time,
					account: {
						account_id: event.account_id,
						name: '',
					},
				});
			} catch (dbError) {
				console.warn(
					'Failed to save Chatwork message_created webhook:',
					dbError,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'chatwork.webhook.messageCreated',
			{ ...request.payload },
			'completed',
		);

		return {
			success: true,
			data: request.payload,
		};
	},
};

export const updated: ChatworkWebhooks['messageUpdated'] = {
	match: createChatworkMatch('message_updated'),
	handler: async (ctx, request) => {
		const { valid, error } = verifyChatworkWebhookSignature(request, ctx.key);
		if (!valid) {
			return {
				success: false,
				statusCode: 401,
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
					update_time: event.update_time,
					account: {
						account_id: event.account_id,
						name: '',
					},
				});
			} catch (dbError) {
				console.warn(
					'Failed to save Chatwork message_updated webhook:',
					dbError,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'chatwork.webhook.messageUpdated',
			{ ...request.payload },
			'completed',
		);

		return {
			success: true,
			data: request.payload,
		};
	},
};
