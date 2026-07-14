import { logEventFromContext } from 'corsair/core';
import type { DatadogWebhooks } from '..';
import { createDatadogMatch, verifyDatadogWebhookSignature } from './types';

export const example: DatadogWebhooks['example'] = {
	match: createDatadogMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDatadogWebhookSignature(request, ctx.key);
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
			'datadog.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
