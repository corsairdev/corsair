import { logEventFromContext } from 'corsair/core';
import type { ZohoMailWebhooks } from '../index';
import {
	createZohoMailMatch,
	getZohoWebhookSignature,
	resolveZohoId,
	verifyZohoWebhookSignature,
} from './types';

export const messageReceived: ZohoMailWebhooks['messageReceived'] = {
	match: createZohoMailMatch(),
	handler: async (ctx, request) => {
		const secret = ctx.key;
		const signature = getZohoWebhookSignature(request.headers ?? {});

		if (signature) {
			if (!secret) {
				return {
					success: false,
					statusCode: 401,
					error: 'Webhook secret is not configured',
				};
			}

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
		}

		const event = request.payload;
		const messageId = resolveZohoId(
			request.rawBody,
			'messageId',
			event?.messageId,
		);
		const folderId = resolveZohoId(
			request.rawBody,
			'folderId',
			event?.folderId,
		);

		let corsairEntityId = '';
		if (ctx.db.messages && messageId) {
			try {
				const entity = await ctx.db.messages.upsertByEntityId(messageId, {
					id: messageId,
					messageId,
					folderId,
					subject: event?.subject,
					summary: event?.summary,
					fromAddress: event?.fromAddress,
					toAddress: event?.toAddress,
					ccAddress: event?.ccAddress,
					sender: event?.sender,
					sentDateInGMT: event?.sentDateInGMT,
					receivedTime: event?.receivedTime,
					content: event?.html,
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
