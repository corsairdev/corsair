import { logEventFromContext } from 'corsair/core';
import type { ZohoMailWebhooks } from '../index';
import {
	createZohoMailMatch,
	getZohoWebhookSignature,
	verifyZohoWebhookSignature,
} from './types';

export const messageReceived: ZohoMailWebhooks['messageReceived'] = {
	match: createZohoMailMatch(),
	handler: async (ctx, request) => {
		const secret = ctx.key;
		const signature = getZohoWebhookSignature(request.headers ?? {});

		// Signed delivery — verify when we hold the secret.
		if (signature) {
			if (secret) {
				const rawBody = request.rawBody;
				if (!rawBody) {
					return {
						success: false,
						statusCode: 401,
						error: 'Missing raw body for signature verification',
					};
				}
				if (!verifyZohoWebhookSignature(rawBody, secret, signature)) {
					return {
						success: false,
						statusCode: 401,
						error: 'Invalid signature',
					};
				}
			} else {
				console.warn(
					'[corsair:zohomail] Received signed webhook but no webhook secret is configured — skipping verification.',
				);
			}
		}
		// No signature → first/handshake request. Zoho saves the webhook only on a
		// 200, so fall through and acknowledge.

		const event = request.payload;

		let corsairEntityId = '';
		if (ctx.db.messages && event?.messageId) {
			try {
				const entity = await ctx.db.messages.upsertByEntityId(event.messageId, {
					id: event.messageId,
					messageId: event.messageId,
					folderId: event.folderId,
					subject: event.subject,
					summary: event.summary,
					fromAddress: event.fromAddress,
					toAddress: event.toAddress,
					ccAddress: event.ccAddress,
					sender: event.sender,
					sentDateInGMT: event.sentDateInGMT,
					receivedTime: event.receivedTime,
					content: event.html,
					createdAt: new Date(),
				});
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('Failed to save webhook message to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zohomail.webhook.messageReceived',
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
