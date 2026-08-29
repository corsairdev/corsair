import { logEventFromContext } from 'corsair/core';
import type { CapsuleCrmWebhooks } from '..';
import { createCapsuleCrmMatch, verifyCapsuleCrmWebhookSignature } from './types';

export const example: CapsuleCrmWebhooks['example'] = {
	match: createCapsuleCrmMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCapsuleCrmWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'capsulecrm.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
