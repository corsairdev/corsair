import { logEventFromContext } from 'corsair/core';
import type { TisaneWebhooks } from '..';
import { createTisaneMatch, verifyTisaneWebhookSignature } from './types';

export const analysisCompleted: TisaneWebhooks['analysisCompleted'] = {
	match: createTisaneMatch('analysis.completed'),

	handler: async (ctx, request) => {
		const verification = verifyTisaneWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.event !== 'analysis.completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'tisane.webhook.analysis_completed', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
