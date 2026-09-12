import { logEventFromContext } from 'corsair/core';
import type { ExtractaaiWebhooks } from '..';
import {
	createExtractaaiMatch,
	verifyExtractaaiWebhookSignature,
} from './types';

export const example: ExtractaaiWebhooks['example'] = {
	match: createExtractaaiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyExtractaaiWebhookSignature(request, ctx.key);
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
			'extractaai.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
