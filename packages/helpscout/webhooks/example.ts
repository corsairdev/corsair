import { logEventFromContext } from 'corsair/core';
import type { HelpScoutWebhooks } from '..';
import { createHelpScoutMatch, verifyHelpScoutWebhookSignature } from './types';

export const example: HelpScoutWebhooks['example'] = {
	match: createHelpScoutMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHelpScoutWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'helpscout.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
