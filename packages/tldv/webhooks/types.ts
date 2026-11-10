import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import { bodyRecord } from './tenant-matcher';

// ── Verification ──────────────────────────────────────────────────────────
//
// tl;dv does **not** sign webhook deliveries: the published OpenAPI spec has no
// signature scheme, secret field or HMAC section for either trigger. So the
// plugin's webhook secret is sent by the caller as a header on every delivery
// and compared in constant time here. A webhook configured in the tl;dv app
// cannot attach headers, which means enabling one requires a proxy that adds
// this header. With no secret configured every delivery is refused. The check
// proves a delivery came through that proxy, not that tl;dv sent it.

/** Header that carries the shared secret on each delivery. */
export const TLDV_WEBHOOK_SECRET_HEADER = 'x-corsair-webhook-secret';

function headerValue(
	// Header values are string | string[] | undefined depending on the adapter.
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

function safeEqual(left: string, right: string): boolean {
	// Compare bytes: two strings of equal length can differ in byte length, and
	// timingSafeEqual throws on unequal buffers.
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyTldvWebhook(
	// The payload stays unknown until the event schema parses it; this reads
	// headers only.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const expected = secret?.trim();
	if (!expected) {
		return {
			valid: false,
			error:
				'No tl;dv webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}

	const provided = headerValue(request.headers, TLDV_WEBHOOK_SECRET_HEADER);
	if (provided !== undefined && safeEqual(provided.trim(), expected)) {
		return { valid: true };
	}
	return {
		valid: false,
		error:
			provided === undefined
				? `Missing ${TLDV_WEBHOOK_SECRET_HEADER} header`
				: 'Invalid webhook secret',
	};
}

// ── Payloads ──────────────────────────────────────────────────────────────
//
// Both triggers share `{ id, event, data, executedAt }`; `event` names the
// trigger. From the spec's MeetingReadyPayload and TranscriptReadyPayload.

const UserSchema = z.object({ name: z.string(), email: z.string() }).loose();

// The webhook's note and topic are looser than the notes endpoint's: the spec's
// MeetingWebhookNote requires `timestamp` only and MeetingWebhookTopic leaves
// `summary` optional. A stricter schema here rejects a delivery tl;dv is
// allowed to send.
const NoteSchema = z
	.object({
		segmentId: z.string().nullish(),
		timestamp: z.number(),
		text: z.string().nullish(),
		topicId: z.string().nullish(),
	})
	.loose();

const TopicSchema = z
	.object({
		id: z.string(),
		order: z.number(),
		title: z.string(),
		summary: z.string().nullish(),
	})
	.loose();

const TranscriptSchema = z
	.object({
		id: z.string(),
		meetingId: z.string(),
		data: z.array(
			z
				.object({
					speaker: z.string(),
					text: z.string(),
					startTime: z.number(),
					endTime: z.number(),
				})
				.loose(),
		),
	})
	.loose();

/** What a MeetingReady delivery carries under `data`. */
export const MeetingReadyDataSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		happenedAt: z.string(),
		url: z.string(),
		duration: z.number(),
		organizer: UserSchema,
		invitees: z.array(UserSchema),
		template: z
			.object({ id: z.string().nullish(), label: z.string().nullish() })
			.loose()
			.nullish(),
		extraProperties: z
			.object({ conferenceId: z.string().nullish() })
			.loose()
			.nullish(),
		phoneNumber: z.string().nullish(),
		// unknown: the caller supplied this map on import, so its keys are theirs.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		notes: z
			.object({
				markdownContent: z.string().nullish(),
				structuredNotes: z.array(NoteSchema).nullish(),
				topics: z.array(TopicSchema).nullish(),
			})
			.loose()
			.nullish(),
		// Present only when the subscription was created with `include.transcript`,
		// and `null` when the meeting has no completed transcript.
		transcript: TranscriptSchema.nullish(),
	})
	.loose();

export type TldvMeetingReadyData = z.infer<typeof MeetingReadyDataSchema>;

export const MeetingReadyEventSchema = z
	.object({
		id: z.string().describe('Webhook delivery id'),
		event: z.literal('MeetingReady'),
		data: MeetingReadyDataSchema,
		// Required in the spec's schema, absent from the spec's own examples.
		executedAt: z.string().nullish().describe('ISO 8601 timestamp'),
	})
	.loose();

export type TldvMeetingReadyEvent = z.infer<typeof MeetingReadyEventSchema>;

export const TranscriptReadyEventSchema = z
	.object({
		id: z.string().describe('Webhook delivery id'),
		event: z.literal('TranscriptReady'),
		data: TranscriptSchema,
		// Required in the spec's schema, absent from the spec's own examples.
		executedAt: z.string().nullish().describe('ISO 8601 timestamp'),
	})
	.loose();

export type TldvTranscriptReadyEvent = z.infer<
	typeof TranscriptReadyEventSchema
>;

export type TldvWebhookOutputs = {
	meetingReady: TldvMeetingReadyEvent;
	transcriptReady: TldvTranscriptReadyEvent;
};

/** The triggers tl;dv sends, as named in a delivery's `event` field. */
const TLDV_EVENTS: readonly string[] = ['MeetingReady', 'TranscriptReady'];

/** Matches a delivery whose `event` field names the trigger. */
export function matchTldvEvent(event: string): CorsairWebhookMatcher {
	return (request) => bodyRecord(request.body)?.event === event;
}

/**
 * Plugin-level matcher: true only for a body whose `event` is a tl;dv trigger.
 * Tenant discovery stops at the first plugin whose matcher says yes, so a
 * matcher that accepts everything would take other providers' deliveries.
 * tl;dv sends no identifying header, which leaves the body as the only signal.
 */
export const matchTldvWebhook: CorsairWebhookMatcher = (request) => {
	const event = bodyRecord(request.body)?.event;
	return typeof event === 'string' && TLDV_EVENTS.includes(event);
};
