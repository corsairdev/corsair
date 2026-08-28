import { logEventFromContext } from 'corsair/core';
import type { FlexisignWebhooks } from '..';
import { createFlexisignMatch, verifyFlexisignWebhookSignature } from './types';

export const example: FlexisignWebhooks['example'] = {
	match: createFlexisignMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFlexisignWebhookSignature(request, ctx.key);
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
			'flexisign.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
