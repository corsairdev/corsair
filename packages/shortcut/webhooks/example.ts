import { logEventFromContext } from 'corsair/core';
import type { ShortcutWebhooks } from '..';
import { createShortcutMatch, verifyShortcutWebhookSignature } from './types';

export const example: ShortcutWebhooks['example'] = {
	match: createShortcutMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyShortcutWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'shortcut.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
