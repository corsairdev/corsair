import { logEventFromContext } from 'corsair/core';
import type { SemanticScholarWebhooks } from '..';
import { createSemanticScholarMatch, verifySemanticScholarWebhookSignature } from './types';

export const example: SemanticScholarWebhooks['example'] = {
	match: createSemanticScholarMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifySemanticScholarWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'semanticscholar.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
