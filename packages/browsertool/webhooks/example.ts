import { logEventFromContext } from 'corsair/core';
import type { BrowserToolWebhooks } from '..';
import {
	createBrowserToolMatch,
	verifyBrowserToolWebhookSignature,
} from './types';

export const example: BrowserToolWebhooks['example'] = {
	match: createBrowserToolMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBrowserToolWebhookSignature(request, ctx.key);
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
			'browsertool.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
