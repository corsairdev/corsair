import { logEventFromContext } from 'corsair/core';
import type { LangbaseWebhooks } from '..';
import { createLangbaseMatch, verifyLangbaseWebhookSignature } from './types';

export const example: LangbaseWebhooks['example'] = {
	match: createLangbaseMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyLangbaseWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'langbase.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
