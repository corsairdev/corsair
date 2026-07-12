import { logEventFromContext } from 'corsair/core';
import type { ConfluenceWebhooks } from '..';
import {
	createConfluenceMatch,
	verifyConfluenceWebhookSignature,
} from './types';

export const example: ConfluenceWebhooks['example'] = {
	match: createConfluenceMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyConfluenceWebhookSignature(request, ctx.key);
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
			'confluence.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
