import { logEventFromContext } from 'corsair/core';
import type { DreamStudioWebhooks } from '..';
import {
	createDreamStudioMatch,
	verifyDreamStudioWebhookSignature,
} from './types';

export const example: DreamStudioWebhooks['example'] = {
	match: createDreamStudioMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDreamStudioWebhookSignature(request, ctx.key);
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
			'dreamstudio.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
