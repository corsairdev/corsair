import { logEventFromContext } from 'corsair/core';
import type { KibanaWebhooks } from '..';
import { createKibanaMatch, verifyKibanaWebhookSignature } from './types';

export const example: KibanaWebhooks['example'] = {
	match: createKibanaMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyKibanaWebhookSignature(request, ctx.key);
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
			'kibana.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
