import { logEventFromContext } from 'corsair/core';
import type { PipedriveWebhooks } from '..';
import { createPipedriveMatch, verifyPipedriveWebhookSignature } from './types';

export const example: PipedriveWebhooks['example'] = {
	match: createPipedriveMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyPipedriveWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'pipedrive.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
