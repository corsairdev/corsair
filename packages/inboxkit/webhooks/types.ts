import { createHash, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

export const INBOXKIT_SIGNATURE_HEADER = 'x-inboxkit-signature';

export const INBOXKIT_EVENTS = {
	domain: 'domain.status_changed',
	mailbox: 'mailbox.status_changed',
	consentRequest: 'consent_request.status_changed',
	clientIdRequest: 'client_id_request.status_changed',
} as const;

const KNOWN_EVENTS: readonly string[] = Object.values(INBOXKIT_EVENTS);

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();

const DomainFields = z
	.object({
		uid: z.string(),
		name: str,
		tld: str,
		status: str,
		previous_status: str,
		dns_propagation_status: str,
		nameservers: z.array(z.string()).nullish(),
		renewal_date: str,
		renewal_status: str,
		registration_years: num,
		registration_date: str,
		price: num,
		connection_type: str,
		forwarding_url: str,
		forwarding_email: str,
		forwarding_status: str,
		enable_mask_forwarding: bool,
	})
	.loose();

/** The mailbox as this plugin passes it on: never with its passwords. See removeCredentials. */
const MailboxFields = z
	.object({
		uid: z.string(),
		email: str,
		username: str,
		first_name: str,
		last_name: str,
		profile_picture: str,
		status: str,
		previous_status: str,
		platform: str,
		renewal_date: str,
		renewal_status: str,
		is_admin: bool,
		is_add_on: bool,
	})
	.loose();

const RequestFields = z
	.object({
		uid: z.string(),
		status: str,
		previous_status: str,
		status_text: str,
		status_reason: str,
		retry_count: num,
		max_retries: num,
		completed_at: str,
	})
	.loose();

const ConsentRequestFields = RequestFields.extend({ consent_url: str });

const Metadata = z
	.object({
		updated_at: str,
		workspace_id: str,
		workspace_uid: str,
		domain_id: str,
		domain_uid: str,
		domain_name: str,
	})
	.loose();

function eventSchema<TEvent extends string, TData extends z.ZodRawShape>(
	event: TEvent,
	data: TData,
) {
	return z
		.object({
			event: z.literal(event),
			timestamp: str,
			team_id: str,
			team_name: str,
			data: z.object({ ...data, metadata: Metadata.nullish() }).loose(),
		})
		.loose();
}

export const DomainStatusChangedEventSchema = eventSchema(
	INBOXKIT_EVENTS.domain,
	{
		domain: DomainFields,
	},
);
export const MailboxStatusChangedEventSchema = eventSchema(
	INBOXKIT_EVENTS.mailbox,
	{
		mailbox: MailboxFields,
	},
);
export const ConsentRequestStatusChangedEventSchema = eventSchema(
	INBOXKIT_EVENTS.consentRequest,
	{
		consent_request: ConsentRequestFields,
	},
);
export const ClientIdRequestStatusChangedEventSchema = eventSchema(
	INBOXKIT_EVENTS.clientIdRequest,
	{
		client_id_request: RequestFields,
	},
);

// A delivery holds the same fields as the event a handler returns, before
// removeCredentials has run on it.
export const DomainStatusChangedPayloadSchema = DomainStatusChangedEventSchema;
export const MailboxStatusChangedPayloadSchema =
	MailboxStatusChangedEventSchema;
export const ConsentRequestStatusChangedPayloadSchema =
	ConsentRequestStatusChangedEventSchema;
export const ClientIdRequestStatusChangedPayloadSchema =
	ClientIdRequestStatusChangedEventSchema;

export type DomainStatusChangedEvent = z.infer<
	typeof DomainStatusChangedEventSchema
>;
export type MailboxStatusChangedEvent = z.infer<
	typeof MailboxStatusChangedEventSchema
>;
export type ConsentRequestStatusChangedEvent = z.infer<
	typeof ConsentRequestStatusChangedEventSchema
>;
export type ClientIdRequestStatusChangedEvent = z.infer<
	typeof ClientIdRequestStatusChangedEventSchema
>;

export type DomainStatusChangedPayload = DomainStatusChangedEvent;
export type MailboxStatusChangedPayload = MailboxStatusChangedEvent;
export type ConsentRequestStatusChangedPayload =
	ConsentRequestStatusChangedEvent;
export type ClientIdRequestStatusChangedPayload =
	ClientIdRequestStatusChangedEvent;

export type InboxkitWebhookOutputs = {
	domainStatusChanged: DomainStatusChangedEvent;
	mailboxStatusChanged: MailboxStatusChangedEvent;
	consentRequestStatusChanged: ConsentRequestStatusChangedEvent;
	clientIdRequestStatusChanged: ClientIdRequestStatusChangedEvent;
};

const CREDENTIAL_FIELDS = new Set([
	'password',
	'app_password',
	'secret',
	'refresh_token',
	'access_token',
	'totp_secret',
]);

/**
 * Deletes every credential field, at any depth, in place. mailbox.status_changed
 * carries the decrypted password, app password and 2FA secret unless the team has
 * turned off "Include mailbox credentials" in the dashboard. In place because
 * processWebhook returns this same object to its caller as `body`, so a copy
 * would leave them there; and what a handler returns goes on to hooks, the local
 * database and the HTTP response, none of which should hold them.
 */
// unknown: a parsed delivery of any shape.
export function removeCredentials(value: unknown): void {
	if (Array.isArray(value)) {
		for (const item of value) removeCredentials(item);
		return;
	}
	if (!value || typeof value !== 'object') return;
	// unknown: only the keys matter here, and each value is walked the same way.
	const record = value as Record<string, unknown>;
	for (const key of Object.keys(record)) {
		if (CREDENTIAL_FIELDS.has(key)) delete record[key];
		else removeCredentials(record[key]);
	}
}

// processWebhook lower-cases headers; a caller checking a raw request may not have.
function readHeader(
	// unknown: the payload type plays no part in reading headers.
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
}

/**
 * Checks `X-InboxKit-Signature`, which is `sha256=` and the lowercase hex SHA-256
 * of the team API key. It covers no part of the delivery and is the same on every
 * one, so it shows who sent a delivery and nothing about the body: anyone who has
 * seen one signature can forge deliveries until the key is rotated. HTTPS is what
 * protects it, and it is why events are treated as prompts to look, not as facts.
 */
export function verifyInboxkitSignature(
	// unknown: the payload type plays no part in reading headers.
	headers: WebhookRequest<unknown>['headers'],
	apiKey: string,
): { valid: boolean; error?: string } {
	const key = apiKey.trim();
	if (!key) return { valid: false, error: 'no API key to check against' };
	const received = readHeader(headers, INBOXKIT_SIGNATURE_HEADER);
	if (!received) {
		return { valid: false, error: `no ${INBOXKIT_SIGNATURE_HEADER} header` };
	}
	const expected = `sha256=${createHash('sha256').update(key).digest('hex')}`;
	const a = Buffer.from(received);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) {
		return { valid: false, error: 'the signature does not match the API key' };
	}
	return { valid: true };
}

export function matchEvent(event: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) =>
		readBodyRecord(request)?.event === event;
}

/** Whether a request looks like InboxKit's. Routing only: the handler checks the signature. */
export const isInboxkitWebhook: CorsairWebhookMatcher = (
	request: RawWebhookRequest,
) => {
	const event = readBodyRecord(request)?.event;
	return typeof event === 'string' && KNOWN_EVENTS.includes(event);
};
