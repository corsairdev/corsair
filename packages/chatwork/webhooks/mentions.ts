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
				statusCode: 401,
				error: error || 'Signature verification failed',
			};
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
