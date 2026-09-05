import { logEventFromContext } from 'corsair/core';
import type { CloudflareApiKeyWebhooks } from '..';
import { createCloudflareApiKeyMatch, verifyCloudflareApiKeyWebhookSignature } from './types';

export const example: CloudflareApiKeyWebhooks['example'] = {
	match: createCloudflareApiKeyMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCloudflareApiKeyWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'cloudflareapikey.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
