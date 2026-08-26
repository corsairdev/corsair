import { logEventFromContext } from 'corsair/core';
import type { ArynWebhooks } from '..';
import { createArynMatch, verifyArynWebhookSignature } from './types';

export const taskDone: ArynWebhooks['taskDone'] = {
	match: createArynMatch(),

	handler: async (ctx, request) => {
		const verification = verifyArynWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'aryn.webhook.taskDone',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
