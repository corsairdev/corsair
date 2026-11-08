import type { CorsairWebhook, CorsairWebhookMatcher } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TldvContext } from '..';
import type { TldvWebhookOutputs } from './types';
import {
	MeetingReadyEventSchema,
	matchTldvEvent,
	TranscriptReadyEventSchema,
	verifyTldvWebhook,
} from './types';

/**
 * One handler per trigger: verify the shared secret, parse the payload, log
 * identifiers only (a delivery carries meeting content) and return the event.
 *
 * A failed verification **throws** rather than returning `success: false`.
 * `processWebhook` answers `{ success: true }` for a returned failure and keeps
 * only a thrown error's message, so a throw is the only way a rejected delivery
 * reaches the HTTP handler as a non-2xx.
 */
function handlerFor<Schema extends z.ZodType>(
	event: string,
	schema: Schema,
	match: CorsairWebhookMatcher,
	log: (
		data: z.output<Schema>,
	) => Record<string, string | number | boolean | undefined>,
): CorsairWebhook<TldvContext, z.output<Schema>, z.output<Schema>> {
	return {
		match,
		handler: async (ctx, request) => {
			const verification = verifyTldvWebhook(request, ctx.key);
			if (!verification.valid) {
				throw new Error(
					verification.error ?? 'tl;dv webhook verification failed',
				);
			}

			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				throw new Error(`Invalid tl;dv ${event} payload`);
			}

			const data = parsed.data;
			await logEventFromContext(
				ctx,
				`tldv.webhook.${event}`,
				log(data),
				'completed',
			);
			return { success: true, data };
		},
	};
}

export const meetingReady: CorsairWebhook<
	TldvContext,
	TldvWebhookOutputs['meetingReady'],
	TldvWebhookOutputs['meetingReady']
> = handlerFor(
	'MeetingReady',
	MeetingReadyEventSchema,
	matchTldvEvent('MeetingReady'),
	(event) => ({
		webhookId: event.id,
		meetingId: event.data.id,
		duration: event.data.duration,
		notes: event.data.notes?.structuredNotes?.length ?? 0,
		// `!= null` on purpose: the key is absent when `include.transcript` is off
		// and `null` when the subscription asked but no transcript exists, and
		// both mean "no transcript". A strict `!== null` reports an absent key as
		// present, because `undefined !== null` is true.
		hasTranscript: event.data.transcript != null,
	}),
);

export const transcriptReady: CorsairWebhook<
	TldvContext,
	TldvWebhookOutputs['transcriptReady'],
	TldvWebhookOutputs['transcriptReady']
> = handlerFor(
	'TranscriptReady',
	TranscriptReadyEventSchema,
	matchTldvEvent('TranscriptReady'),
	(event) => ({
		webhookId: event.id,
		meetingId: event.data.meetingId,
		sentences: event.data.data.length,
	}),
);
