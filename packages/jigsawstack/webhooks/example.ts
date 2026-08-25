import { logEventFromContext } from 'corsair/core';
import type { JigsawstackWebhooks } from '..';
import {
	createJigsawstackMatch,
	verifyJigsawstackWebhookSignature,
} from './types';

export const example: JigsawstackWebhooks['example'] = {
	match: createJigsawstackMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyJigsawstackWebhookSignature(request, ctx.key);
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
			'jigsawstack.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
