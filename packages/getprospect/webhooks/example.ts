import { logEventFromContext } from 'corsair/core';
import type { GetProspectWebhooks } from '..';
import { createGetProspectMatch, verifyGetProspectWebhookSignature } from './types';

export const example: GetProspectWebhooks['example'] = {
	match: createGetProspectMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGetProspectWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'getprospect.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
