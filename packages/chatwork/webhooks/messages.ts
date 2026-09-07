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
