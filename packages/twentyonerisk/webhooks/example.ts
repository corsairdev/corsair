import { logEventFromContext } from 'corsair/core';
import type { TwentyOneRiskWebhooks } from '..';
import {
	createTwentyOneRiskMatch,
	verifyTwentyOneRiskWebhookSignature,
} from './types';

export const example: TwentyOneRiskWebhooks['example'] = {
	match: createTwentyOneRiskMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyTwentyOneRiskWebhookSignature(request, ctx.key);
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
			'twentyonerisk.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
