import { logEventFromContext } from 'corsair/core';
import type { LemlistWebhooks } from '..';
import { createLemlistMatch, verifyLemlistWebhookSignature } from './types';

export const example: LemlistWebhooks['example'] = {
	match: createLemlistMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyLemlistWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'lemlist.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
