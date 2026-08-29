import { logEventFromContext } from 'corsair/core';
import type { DynapicturesWebhooks } from '..';
import {
	createDynapicturesMatch,
	verifyDynapicturesWebhookSignature,
} from './types';

export const example: DynapicturesWebhooks['example'] = {
	match: createDynapicturesMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDynapicturesWebhookSignature(request, ctx.key);
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
			'dynapictures.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
