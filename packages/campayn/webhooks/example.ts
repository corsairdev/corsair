import { logEventFromContext } from 'corsair/core';
import type { CampaynWebhooks } from '..';
import { createCampaynMatch, verifyCampaynWebhookSignature } from './types';

export const example: CampaynWebhooks['example'] = {
	match: createCampaynMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCampaynWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'campayn.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
