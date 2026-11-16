import type { CorsairWebhook, CorsairWebhookMatcher } from 'corsair/core';
import type { z } from 'zod';
import type { HappyScribeContext } from '..';
import { safeLog } from '../endpoints/call';
import type { HappyScribeWebhookPayload } from './types';
import {
	createHappyScribeMatch,
	eventSchema,
	HappyScribeWebhookPayloadSchema,
	matchOtherEvent,
	verifyHappyScribeWebhook,
} from './types';

/**
 * One handler per Corsair webhook path: verify both signature headers,
 * parse the payload, log IDs only (payloads carry meeting content) and
 * return the event. A logging failure does not fail the delivery.
 */
function handlerFor<S extends z.ZodType<HappyScribeWebhookPayload>>(
	event: string,
	schema: S,
	match: CorsairWebhookMatcher,
): CorsairWebhook<HappyScribeContext, HappyScribeWebhookPayload, z.output<S>> {
	return {
		match,
		handler: async (ctx, request) => {
			const verification = verifyHappyScribeWebhook(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Webhook verification failed',
				};
			}

			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid HappyScribe ${event} payload`,
				};
			}

			const data = parsed.data;
			// unknown: the embedded Meeting varies by state; only the id and
			// status are logged.
			const meeting = data.data.object as Record<string, unknown>;
			await safeLog(ctx, `happyscribe.webhook.${event}`, () => ({
				eventId: data.id,
				eventType: data.type,
				meetingId: typeof meeting.id === 'string' ? meeting.id : undefined,
				meetingStatus:
					typeof meeting.status === 'string' ? meeting.status : undefined,
			}));

			return { success: true, data };
		},
	};
}

function known<S extends z.ZodType<HappyScribeWebhookPayload>>(
	event: string,
	schema: S,
) {
	return handlerFor(event, schema, createHappyScribeMatch(event));
}

export const recordingStarted = known(
	'recordingStarted',
	eventSchema(['meeting.recording_started']),
);
export const recordingCompleted = known(
	'recordingCompleted',
	eventSchema(['meeting.recording_completed']),
);
export const transcriptReady = known(
	'transcriptReady',
	eventSchema(['meeting.transcript_ready']),
);
export const summaryReady = known(
	'summaryReady',
	eventSchema(['meeting.summary_ready']),
);
export const failed = known('failed', eventSchema(['meeting.failed']));
export const cancelled = known('cancelled', eventSchema(['meeting.cancelled']));

// Event types this plugin does not know yet. Check `type` before acting.
export const otherEvent = handlerFor(
	'other',
	HappyScribeWebhookPayloadSchema,
	matchOtherEvent,
);
