import { logEventFromContext } from 'corsair/core';
import type { WisepopsWebhooks } from '..';
import { createWisepopsMatch, verifyWisepopsWebhookSignature } from './types';

export const example: WisepopsWebhooks['example'] = {
	match: createWisepopsMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyWisepopsWebhookSignature(request, ctx.key);
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
			'wisepops.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
