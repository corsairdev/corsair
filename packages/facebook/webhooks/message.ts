import { logEventFromContext } from 'corsair/core';
import type { FacebookWebhooks } from '..';
import type { FacebookWebhookPayload } from './types';
import {
	createFacebookMessagingMatch,
	verifyFacebookWebhookSignature,
} from './types';

export const message: FacebookWebhooks['message'] = {
	match: createFacebookMessagingMatch('message'),

	handler: async (ctx, request) => {
		// Payload type is not inferred from the generic webhook request, so narrow it to the validated Facebook Messenger payload shape.
		const messengerRequest = request as typeof request & {
			payload: FacebookWebhookPayload;
		};
		const verification = verifyFacebookWebhookSignature(
			messengerRequest,
			ctx.key,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Signature verification failed',
			};
		}

		const payload = messengerRequest.payload;
		let corsairEntityId = '';
		const persistedMessages: Array<Record<string, unknown>> = [];

		for (const entry of payload.entry) {
			const events = Array.isArray(entry.messaging)
				? entry.messaging
				: Array.isArray(entry.standby)
					? entry.standby
					: [];

			for (const event of events) {
				if (!event.message) {
					continue;
				}

				const messageId =
					event.message.mid ?? `${entry.id}:${event.timestamp ?? Date.now()}`;
				const normalizedMessage = {
					id: messageId,
					mid: event.message.mid,
					page_id: entry.id,
					from: event.sender,
					to: event.recipient ? [event.recipient] : undefined,
					recipient_id: event.recipient?.id,
					sender_id: event.sender?.id,
					text: event.message.text,
					attachments: event.message.attachments,
					quick_reply: event.message.quick_reply,
					reply_to: event.message.reply_to,
					is_echo: event.message.is_echo,
					app_id: event.message.app_id,
					metadata: event.message.metadata,
					status: 'received' as const,
					direction: event.message.is_echo
						? ('outbound' as const)
						: ('inbound' as const),
					timestamp: event.timestamp,
					authorId: event.sender?.id,
					createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
					raw: event,
				};

				persistedMessages.push(normalizedMessage);

				if (ctx.db.messages) {
					try {
						const entity = await ctx.db.messages.upsertByEntityId(
							messageId,
							normalizedMessage,
						);
						corsairEntityId = entity?.id || corsairEntityId;
					} catch (error) {
						console.warn('Failed to save Facebook webhook message:', error);
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'facebook.webhook.message',
			{ object: payload.object, messages: persistedMessages },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
