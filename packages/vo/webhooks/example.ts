import { logEventFromContext } from 'corsair/core';
import type { VoWebhooks } from '..';
import { createVoMatch, verifyVoWebhookSignature } from './types';

export const example: VoWebhooks['example'] = {
	match: createVoMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyVoWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'vo.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
