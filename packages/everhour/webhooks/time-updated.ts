import { logEventFromContext } from 'corsair/core';
import type { EverhourContext } from '../index';
import type {
	EverhourWebhookPayload,
	EverhourWebhooks,
	TimeUpdatedEvent,
	WebhookRequest,
} from './types';
import { createEverhourMatch, verifyEverhourWebhookSignature } from './types';

export const timeUpdated: EverhourWebhooks['api:time:updated'] = {
	match: createEverhourMatch('api:time:updated'),

	handler: async (
		ctx: EverhourContext,
		request: WebhookRequest<EverhourWebhookPayload>,
	) => {
		const verification = verifyEverhourWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload as TimeUpdatedEvent;
		await logEventFromContext(
			ctx,
			'everhour.webhook.time_updated',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
