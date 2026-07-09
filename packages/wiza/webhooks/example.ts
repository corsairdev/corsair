import { logEventFromContext } from 'corsair/core';
import type { WizaWebhooks } from '..';
import { createWizaMatch, verifyWizaWebhookSignature } from './types';

export const example: WizaWebhooks['example'] = {
	match: createWizaMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyWizaWebhookSignature(request, ctx.key);
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
			'wiza.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
