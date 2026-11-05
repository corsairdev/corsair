import { logEventFromContext } from 'corsair/core';
import type { BannerbearWebhooks } from '..';
import {
	createBannerbearImageCompletedMatch,
	verifyBannerbearWebhookSignature,
} from './types';

export const imageCompleted: BannerbearWebhooks['imageCompleted'] = {
	match: createBannerbearImageCompletedMatch(),

	handler: async (ctx, request) => {
		const verification = verifyBannerbearWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.status !== 'completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'bannerbear.webhook.image_completed',
			{ uid: event.uid },
			'completed',
		);

		return { success: true, data: event };
	},
};
