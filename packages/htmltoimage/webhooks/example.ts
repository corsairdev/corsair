import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageWebhooks } from '..';
import {
	createHtmlToImageMatch,
	verifyHtmlToImageWebhookSignature,
} from './types';

export const example: HtmlToImageWebhooks['example'] = {
	match: createHtmlToImageMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHtmlToImageWebhookSignature(request, ctx.key);
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
			'htmltoimage.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
