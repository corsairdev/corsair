import { logEventFromContext } from 'corsair/core';
import type { HiggsfieldWebhooks } from '..';
import {
	matchRequestCompleted,
	RequestCompletedEventSchema,
	verifyHiggsfieldWebhookSignature,
	webhookIdOf,
} from './types';

export const completed: HiggsfieldWebhooks['requestCompleted'] = {
	match: matchRequestCompleted,

	handler: async (ctx, request) => {
		if (request.hubVerified !== true) {
			// Throwing makes processWebhook report a failure, so the HTTP handler can
			// answer non-2xx and Higgsfield retries for two hours, in which time the
			// secret can be set. A refusal here would be acknowledged and lost.
			if (!ctx.key) {
				throw new Error(
					'No Higgsfield webhook secret is set, so this delivery cannot be verified. Reveal the whsec_ secret under Settings in the Higgsfield Console, then store it with keys.set_webhook_signature or higgsfield({ webhookSecret }).',
				);
			}
			const verification = verifyHiggsfieldWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error:
						verification.error ??
						'Higgsfield webhook signature verification failed',
				};
			}
		}

		const parsed = RequestCompletedEventSchema.safeParse({
			...request.payload,
			webhook_id: webhookIdOf(request),
		});
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'The delivery does not match the Higgsfield webhook envelope',
			};
		}

		const event = parsed.data;
		await logEventFromContext(
			ctx,
			'higgsfield.webhook.requests.completed',
			{ requestId: event.request_id, status: event.status },
			'completed',
		);
		return { success: true, data: event };
	},
};
