import { logEventFromContext } from 'corsair/core';
import type { ChMeetingsWebhooks } from '..';
import {
	createChMeetingsMatch,
	verifyChMeetingsWebhookSignature,
} from './types';

export const example: ChMeetingsWebhooks['example'] = {
	match: createChMeetingsMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyChMeetingsWebhookSignature(request, ctx.key);
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
			'chmeetings.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
