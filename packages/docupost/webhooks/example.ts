import { logEventFromContext } from 'corsair/core';
import type { DocupostWebhooks } from '..';
import { createDocupostMatch, verifyDocupostWebhookSignature } from './types';

export const example: DocupostWebhooks['example'] = {
	match: createDocupostMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDocupostWebhookSignature(request, ctx.key);
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
			'docupost.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
