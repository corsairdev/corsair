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
			// Every refusal here throws. processWebhook acknowledges a returned
			// refusal as success, which would lose the delivery; a throw makes it
			// report a failure, so the HTTP handler can answer 5xx and Higgsfield
			// retries for up to two hours (it never retries a 4xx), in which time a missing or rotated secret
			// can be fixed. No after hook runs on a throw.
			if (!ctx.key) {
				throw new Error(
					'No Higgsfield webhook secret is set, so this delivery cannot be verified. Reveal the whsec_ secret under Settings in the Higgsfield Console, then store it with keys.set_webhook_signature or higgsfield({ webhookSecret }).',
				);
			}
			const verification = verifyHiggsfieldWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				throw new Error(
					`Higgsfield webhook refused: ${verification.error ?? 'signature verification failed'}`,
				);
			}
		}

		const parsed = RequestCompletedEventSchema.safeParse({
			...request.payload,
			webhook_id: webhookIdOf(request),
		});
		if (!parsed.success) {
			throw new Error(
				'Higgsfield webhook refused: the delivery does not match the webhook envelope',
			);
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
