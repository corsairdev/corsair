import { logEventFromContext } from 'corsair/core';
import type { CloudinaryWebhooks } from '..';
import { createCloudinaryMatch, verifyCloudinaryWebhookSignature } from './types';

export const example: CloudinaryWebhooks['example'] = {
	match: createCloudinaryMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCloudinaryWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'cloudinary.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
