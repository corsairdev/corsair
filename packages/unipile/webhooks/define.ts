import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { UnipileWebhook } from '..';
import type { UnipileWebhookOutputs } from './types';
import { createUnipileMatch, verifyUnipileWebhookSignature } from './types';

/**
 * One Unipile event type: match on `type`, verify the unipile-signature
 * header, validate the payload, log the ids and hand the event to
 * webhookHooks. Payload contents (message text, names) are not logged.
 */
export function defineUnipileWebhook<K extends keyof UnipileWebhookOutputs>(
	name: K,
	eventType: UnipileWebhookOutputs[K]['type'],
	schema: z.ZodType<UnipileWebhookOutputs[K]>,
): UnipileWebhook<K> {
	return {
		match: createUnipileMatch(eventType),
		handler: async (ctx, request) => {
			const verification = verifyUnipileWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Signature verification failed',
				};
			}

			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid Unipile ${eventType} payload`,
				};
			}

			const event = parsed.data;
			await logEventFromContext(
				ctx,
				`unipile.webhook.${name}`,
				{ event_id: event.id, type: event.type, account_id: event.account_id },
				'completed',
			);

			return { success: true, data: event };
		},
	};
}
