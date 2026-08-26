import { logEventFromContext } from 'corsair/core';
import type { OcrWebServiceWebhooks } from '..';
import {
	createOcrWebServiceMatch,
	verifyOcrWebServiceWebhookSignature,
} from './types';

export const example: OcrWebServiceWebhooks['example'] = {
	match: createOcrWebServiceMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyOcrWebServiceWebhookSignature(request, ctx.key);
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
			'ocrwebservice.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
