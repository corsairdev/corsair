import { logEventFromContext } from 'corsair/core';
import type { PineconeWebhooks } from '..';
import { createPineconeMatch, verifyPineconeWebhookSignature } from './types';

export const example: PineconeWebhooks['example'] = {
	match: createPineconeMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyPineconeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'pinecone.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
