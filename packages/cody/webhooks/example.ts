import { logEventFromContext } from 'corsair/core';
import type { CodyWebhooks } from '..';
import { createCodyMatch, verifyCodyWebhookSignature } from './types';

export const example: CodyWebhooks['example'] = {
	match: createCodyMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCodyWebhookSignature(request, ctx.key);
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
			'cody.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
