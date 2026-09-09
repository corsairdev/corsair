import type { AccountKeyManagerFor } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { InstagramWebhooks } from '../index';
import {
	createInstagramWebhookMatcher,
	InstagramMessageReceivedEventSchema,
	verifyInstagramWebhookSignature,
} from './types';

export const messageReceived: InstagramWebhooks['messageReceived'] = {
	match: createInstagramWebhookMatcher('messageReceived'),
	handler: async (ctx, request) => {
		if (ctx.options.authType === 'managed') {
			return {
				success: false,
				statusCode: 501,
				error:
					'Instagram webhook signature verification is not available under managed auth; the Meta app secret is held by the Hub.',
			};
		}
		const credentials = await (
			ctx.keys as AccountKeyManagerFor<'oauth_2'>
		).get_integration_credentials();
		const appSecret = credentials.client_secret;

		const verification = verifyInstagramWebhookSignature(request, appSecret);

		if (!verification.valid)
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};

		const body = request.payload;

		const messaging = body.entry[0]?.messaging[0];

		if (!messaging) {
			console.error('Invalid webhook payload: missing messaging data');
			return { success: false, error: 'Invalid payload' };
		}

		if (
			!messaging?.message?.mid ||
			(!messaging.message.text && !messaging.message.attachments)
		) {
			return {
				success: true,
			};
		}

		const event = InstagramMessageReceivedEventSchema.parse({
			type: 'messageReceived',
			accountId: body?.entry[0]?.id,
			senderId: messaging.sender.id,
			recipientId: messaging.recipient.id,
			messageId: messaging.message?.mid,
			text: messaging.message?.text,
			timestamp: body?.entry[0]?.time,
			isEcho: messaging.message?.is_echo || false,
		});

		if (ctx.db.messages) {
			await ctx.db.messages.upsertByEntityId(event.messageId, {
				senderId: event.senderId,
				recipient: event.recipientId,
				message: event.text,
				messageId: event.messageId,
			});
		}

		await logEventFromContext(
			ctx,
			'instagram.webhook.messageReceived',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
