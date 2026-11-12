import { logEventFromContext } from 'corsair/core';
import type { SanityWebhooks } from '..';
import {
	DocumentChangedEventSchema,
	deliveryFields,
	isSanityWebhook,
	verifySanityWebhookSignature,
} from './types';

export const changed: SanityWebhooks['documentChanged'] = {
	match: isSanityWebhook,

	handler: async (ctx, request) => {
		if (request.hubVerified !== true) {
			// Every refusal throws. processWebhook acknowledges a returned refusal as
			// success, which would lose the delivery; a throw makes it report a
			// failure, so the HTTP handler answers 5xx and Sanity retries, in which
			// time a missing or rotated secret can be fixed. No after hook runs on a throw.
			if (!ctx.key) {
				throw new Error(
					"No Sanity webhook secret is set, so this delivery cannot be verified. Set a secret on the webhook (sanity.io/manage > API > Webhooks, or webhooks.create's secret), then store the same value with keys.set_webhook_signature or sanity({ webhookSecret }).",
				);
			}
			const verification = verifySanityWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				throw new Error(
					`Sanity webhook refused: ${verification.error ?? 'signature verification failed'}`,
				);
			}
		}

		const event = DocumentChangedEventSchema.parse({
			...deliveryFields(request),
			body: request.payload ?? null,
		});

		await logEventFromContext(
			ctx,
			'sanity.webhook.documents.changed',
			{
				operation: event.operation,
				documentId: event.documentId,
				dataset: event.dataset,
			},
			'completed',
		);
		return { success: true, data: event };
	},
};
