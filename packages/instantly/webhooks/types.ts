import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

// ── Verification ──────────────────────────────────────────────────────────
//
// Instantly does not sign webhook deliveries. A webhook can carry custom
// HTTP headers instead ("Attach custom HTTP headers for authentication",
// https://help.instantly.ai/en/articles/6261906-webhooks; the `headers`
// field of POST /api/v2/webhooks,
// https://developer.instantly.ai/api-reference/webhook/create-webhook).
// So the plugin's webhook secret is sent as a header on every delivery and
// compared in constant time here. webhooks.create attaches it by default; a
// webhook made in the Instantly UI needs the header added by hand.

/** Header that carries the webhook secret on each delivery. */
export const INSTANTLY_WEBHOOK_SECRET_HEADER = 'x-corsair-webhook-secret';

function headerValue(
	// Header values are string | string[] | undefined depending on the
	// HTTP adapter.
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
	// Compare bytes: two strings of equal length can differ in byte length,
	// and timingSafeEqual throws on unequal buffers.
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyInstantlyWebhook(
	// The payload stays unknown until the event schema parses it; this only
	// reads headers.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const expected = secret?.trim();
	if (!expected) {
		return {
			valid: false,
			error:
				'No Instantly webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}

	const provided = headerValue(
		request.headers,
		INSTANTLY_WEBHOOK_SECRET_HEADER,
	);
	if (provided !== undefined && safeEqual(provided.trim(), expected)) {
		return { valid: true };
	}

	// Also accept `Authorization: Bearer <secret>` (any case), the header
	// Instantly's own example uses.
	const authorization = headerValue(request.headers, 'authorization');
	const bearer = authorization?.match(/^\s*bearer\s+(.+)$/i)?.[1];
	if (bearer !== undefined && safeEqual(bearer.trim(), expected)) {
		return { valid: true };
	}

	return {
		valid: false,
		error:
			provided === undefined && authorization === undefined
				? `Missing ${INSTANTLY_WEBHOOK_SECRET_HEADER} header`
				: 'Invalid webhook secret',
	};
}

// ── Payloads ──────────────────────────────────────────────────────────────
//
// Schema: https://developer.instantly.ai/guides/webhook-events. Every
// delivery has timestamp, event_type, workspace and (for campaign events)
// campaign_id/campaign_name; the rest depends on the event, and lead fields
// from the workspace are merged in as extra keys.

const str = z.string().nullish();
// Documented as numbers; strings are accepted too, since a failed parse
// would drop a real event.
const count = z.union([z.number(), z.string()]).nullish();

export const InstantlyWebhookPayloadSchema = z
	.object({
		event_type: z.string(),
		timestamp: z.string().describe('When the event happened (ISO 8601)'),
		workspace: z.string().describe('Workspace ID'),
		campaign_id: str,
		campaign_name: str,
		lead_email: str,
		email_account: str.describe('Sending account involved'),
		step: count.describe('Sequence step, from 1'),
		variant: count.describe('Step variant, from 1'),
		is_first: z
			.boolean()
			.nullish()
			.describe('First event of this type for the lead'),
		email_id: str.describe(
			'Email ID; pass as reply_to_uuid to emails.reply to answer it',
		),
		email_subject: str,
		email_text: str,
		email_html: str,
		unibox_url: str,
		reply_subject: str,
		reply_text_snippet: str,
		reply_text: str,
		reply_html: str,
	})
	.loose();

export type InstantlyWebhookPayload = z.infer<
	typeof InstantlyWebhookPayloadSchema
>;

function eventSchema<const T extends readonly [string, ...string[]]>(types: T) {
	return InstantlyWebhookPayloadSchema.extend({ event_type: z.enum(types) });
}

/**
 * Corsair webhook path → the `event_type` values it handles. Instantly's
 * subscription API calls a click `email_link_clicked`, while its payload
 * guide says `link_clicked`; both are accepted. `auto_reply_received` is in
 * the payload guide but cannot be subscribed to on its own (see
 * WEBHOOK_SUBSCRIPTION_EVENTS), so it only arrives on all_events webhooks.
 */
export const INSTANTLY_WEBHOOK_EVENTS = {
	emailSent: ['email_sent'],
	emailOpened: ['email_opened'],
	emailLinkClicked: ['email_link_clicked', 'link_clicked'],
	emailBounced: ['email_bounced'],
	replyReceived: ['reply_received'],
	autoReplyReceived: ['auto_reply_received'],
	leadUnsubscribed: ['lead_unsubscribed'],
	leadInterested: ['lead_interested'],
	leadNotInterested: ['lead_not_interested'],
	leadNeutral: ['lead_neutral'],
	leadMeetingBooked: ['lead_meeting_booked'],
	leadMeetingCompleted: ['lead_meeting_completed'],
	leadClosed: ['lead_closed'],
	leadOutOfOffice: ['lead_out_of_office'],
	leadWrongPerson: ['lead_wrong_person'],
	leadNoShow: ['lead_no_show'],
	campaignCompleted: ['campaign_completed'],
	accountError: ['account_error'],
} as const satisfies Record<string, readonly [string, ...string[]]>;

export type InstantlyKnownWebhookEvent = keyof typeof INSTANTLY_WEBHOOK_EVENTS;

const KNOWN_EVENT_TYPES: ReadonlySet<string> = new Set(
	Object.values(INSTANTLY_WEBHOOK_EVENTS).flat(),
);

export const InstantlyWebhookEventSchemas = {
	emailSent: eventSchema(INSTANTLY_WEBHOOK_EVENTS.emailSent),
	emailOpened: eventSchema(INSTANTLY_WEBHOOK_EVENTS.emailOpened),
	emailLinkClicked: eventSchema(INSTANTLY_WEBHOOK_EVENTS.emailLinkClicked),
	emailBounced: eventSchema(INSTANTLY_WEBHOOK_EVENTS.emailBounced),
	replyReceived: eventSchema(INSTANTLY_WEBHOOK_EVENTS.replyReceived),
	autoReplyReceived: eventSchema(INSTANTLY_WEBHOOK_EVENTS.autoReplyReceived),
	leadUnsubscribed: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadUnsubscribed),
	leadInterested: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadInterested),
	leadNotInterested: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadNotInterested),
	leadNeutral: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadNeutral),
	leadMeetingBooked: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadMeetingBooked),
	leadMeetingCompleted: eventSchema(
		INSTANTLY_WEBHOOK_EVENTS.leadMeetingCompleted,
	),
	leadClosed: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadClosed),
	leadOutOfOffice: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadOutOfOffice),
	leadWrongPerson: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadWrongPerson),
	leadNoShow: eventSchema(INSTANTLY_WEBHOOK_EVENTS.leadNoShow),
	campaignCompleted: eventSchema(INSTANTLY_WEBHOOK_EVENTS.campaignCompleted),
	accountError: eventSchema(INSTANTLY_WEBHOOK_EVENTS.accountError),
	// Anything else: a custom lead label (Instantly sends the label's name as
	// event_type, https://developer.instantly.ai/guides/webhook-events) or an
	// event type added after this plugin. The payload has no field that tells
	// the two apart, so they share one handler and keep their event_type.
	other: InstantlyWebhookPayloadSchema,
} as const;

export type InstantlyWebhookEvent = keyof typeof InstantlyWebhookEventSchemas;

export type InstantlyWebhookOutputs = {
	[K in InstantlyWebhookEvent]: z.infer<
		(typeof InstantlyWebhookEventSchemas)[K]
	>;
};

// ── Matching ──────────────────────────────────────────────────────────────

// processWebhook parses string bodies before any matcher runs, so the body
// is an object here (readBodyRecord returns null otherwise).

/**
 * Plugin-level matcher: the shape every Instantly delivery shares (string
 * event_type, workspace and timestamp). The secret header is not required
 * here, so a delivery without it still reaches a handler and gets a 401.
 */
export function matchInstantlyWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return (
		body !== null &&
		typeof body.event_type === 'string' &&
		body.event_type.length > 0 &&
		typeof body.workspace === 'string' &&
		typeof body.timestamp === 'string'
	);
}

function eventTypeOf(request: RawWebhookRequest): string | undefined {
	if (!matchInstantlyWebhook(request)) return undefined;
	const eventType = readBodyRecord(request)?.event_type;
	return typeof eventType === 'string' ? eventType : undefined;
}

export function createInstantlyMatch(
	eventTypes: readonly string[],
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const eventType = eventTypeOf(request);
		return eventType !== undefined && eventTypes.includes(eventType);
	};
}

/**
 * Matches a delivery whose event_type has no dedicated handler (custom lead
 * labels and event types Instantly adds later). Never matches a known type.
 */
export const matchOtherEvent: CorsairWebhookMatcher = (request) => {
	const eventType = eventTypeOf(request);
	return eventType !== undefined && !KNOWN_EVENT_TYPES.has(eventType);
};
