import { logEventFromContext } from 'corsair/core';
import type { ClassmarkerWebhooks } from '..';
import {
	createClassmarkerMatch,
	verifyClassmarkerWebhookSignature,
} from './types';

export const example: ClassmarkerWebhooks['example'] = {
	match: createClassmarkerMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyClassmarkerWebhookSignature(request, ctx.key);
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
			'classmarker.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
