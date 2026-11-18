import { logEventFromContext } from 'corsair/core';
import type { ListenNotesWebhooks } from '..';
import { createListenNotesMatch, verifyListenNotesWebhookSignature } from './types';

export const example: ListenNotesWebhooks['example'] = {
	match: createListenNotesMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyListenNotesWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'listennotes.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
