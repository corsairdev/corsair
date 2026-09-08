import { logEventFromContext } from 'corsair/core';
import type { HookdeckWebhooks } from '..';
import { createHookdeckMatch, verifyHookdeckWebhookSignature } from './types';

export const example: HookdeckWebhooks['example'] = {
	match: createHookdeckMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHookdeckWebhookSignature(request, ctx.key);
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

		await logEventFromContext(
			ctx,
			'hookdeck.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
