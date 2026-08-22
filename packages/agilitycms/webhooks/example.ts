import { logEventFromContext } from 'corsair/core';
import type { AgilityCmsWebhooks } from '..';
import {
	createAgilityCmsMatch,
	verifyAgilityCmsWebhookSignature,
} from './types';

export const contentChanged: AgilityCmsWebhooks['contentChanged'] = {
	match: createAgilityCmsMatch(),

	handler: async (ctx, request) => {
		const verification = verifyAgilityCmsWebhookSignature(request, ctx.key);

		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'agilitycms.webhook.contentChanged',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
