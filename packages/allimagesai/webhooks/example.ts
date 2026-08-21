import { logEventFromContext } from 'corsair/core';
import type { AllImagesAiWebhooks } from '..';
import {
	createAllImagesAiMatch,
	verifyAllImagesAiWebhookSignature,
} from './types';

export const example: AllImagesAiWebhooks['example'] = {
	match: createAllImagesAiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAllImagesAiWebhookSignature(request, ctx.key);
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
			'allimagesai.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
