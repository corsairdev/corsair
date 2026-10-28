import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';
import {
	AccountSchema,
	MessageSchema,
	UserRelationSchema,
} from '../endpoints/types';

// Event object and payloads:
//   https://developer.unipile.com/v2.0/reference/event-types-1
// Signature (unipile-signature: t=<unix seconds>,v0=<hex HMAC-SHA256 of
// "<t>.<raw body>" keyed with the endpoint secret>):
//   https://developer.unipile.com/v2.0/docs/configure-a-webhook#secure-your-endpoint

export const UNIPILE_SIGNATURE_HEADER = 'unipile-signature';

/** Deliveries older (or newer) than this are rejected as replays. */
export const UNIPILE_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

const str = z.string().nullish();

/** Fields every Unipile event carries around its `payload`. */
const EventEnvelope = {
	id: z.string().describe('Event ID (evt_…); deliveries can repeat it'),
	type: z.string(),
	created_at: z.string(),
	account_id: z.string().describe('Account the event happened on (acc_…)'),
	account_provider: str,
	account_name: str,
	account_scope_id: str,
	application_id: str,
	application_production: z.boolean().nullish(),
};

function event<T extends string, P extends z.ZodTypeAny>(type: T, payload: P) {
	return z.object({ ...EventEnvelope, type: z.literal(type), payload }).loose();
}

const StatusPayload = z
	.object({
		timestamp: z.string(),
		product: str.describe(
			'LinkedIn product that changed, on multi-product accounts',
		),
	})
	.loose();

const ErroredPayload = StatusPayload.extend({
	reason: str.describe('unipile, proxy or provider'),
});

const TimestampPayload = z.object({ timestamp: z.string() }).loose();

const AccountAddedPayload = z
	.object({
		account: AccountSchema,
		state: str.describe('The state passed to accounts.createAuthLink'),
	})
	.loose();

export const RelationNewEventSchema = event('relation.new', UserRelationSchema);

export const MessageNewEventSchema = event('message.new', MessageSchema);

export const MessageReceiptReadEventSchema = event(
	'message.receipt.read',
	z
		.object({
			chat_id: z.string(),
			message_id: z.string(),
			user_id: z.string().describe('Who read the message'),
			timestamp: z.string(),
		})
		.loose(),
);

export const AccountStatusRunningEventSchema = event(
	'account.status.running',
	StatusPayload,
);
export const AccountStatusPartialEventSchema = event(
	'account.status.partial',
	StatusPayload,
);
export const AccountStatusDegradedEventSchema = event(
	'account.status.degraded',
	ErroredPayload,
);
export const AccountStatusErroredEventSchema = event(
	'account.status.errored',
	ErroredPayload,
);
export const AccountStatusDisconnectedEventSchema = event(
	'account.status.disconnected',
	StatusPayload,
);
export const AccountAddEventSchema = event('account.add', AccountAddedPayload);
export const AccountReconnectEventSchema = event(
	'account.reconnect',
	AccountAddedPayload,
);
export const AccountRemoveEventSchema = event(
	'account.remove',
	z.object({ account: z.object({ id: z.string() }).loose() }).loose(),
);
export const AccountLockedEventSchema = event(
	'account.locked',
	TimestampPayload,
);
export const AccountUnlockedEventSchema = event(
	'account.unlocked',
	TimestampPayload,
);

export type RelationNewEvent = z.infer<typeof RelationNewEventSchema>;
export type MessageNewEvent = z.infer<typeof MessageNewEventSchema>;
export type MessageReceiptReadEvent = z.infer<
	typeof MessageReceiptReadEventSchema
>;
export type AccountStatusRunningEvent = z.infer<
	typeof AccountStatusRunningEventSchema
>;
export type AccountStatusPartialEvent = z.infer<
	typeof AccountStatusPartialEventSchema
>;
export type AccountStatusDegradedEvent = z.infer<
	typeof AccountStatusDegradedEventSchema
>;
export type AccountStatusErroredEvent = z.infer<
	typeof AccountStatusErroredEventSchema
>;
export type AccountStatusDisconnectedEvent = z.infer<
	typeof AccountStatusDisconnectedEventSchema
>;
export type AccountAddEvent = z.infer<typeof AccountAddEventSchema>;
export type AccountReconnectEvent = z.infer<typeof AccountReconnectEventSchema>;
export type AccountRemoveEvent = z.infer<typeof AccountRemoveEventSchema>;
export type AccountLockedEvent = z.infer<typeof AccountLockedEventSchema>;
export type AccountUnlockedEvent = z.infer<typeof AccountUnlockedEventSchema>;

export type UnipileWebhookOutputs = {
	relationNew: RelationNewEvent;
	messageNew: MessageNewEvent;
	messageReceiptRead: MessageReceiptReadEvent;
	accountStatusRunning: AccountStatusRunningEvent;
	accountStatusPartial: AccountStatusPartialEvent;
	accountStatusDegraded: AccountStatusDegradedEvent;
	accountStatusErrored: AccountStatusErroredEvent;
	accountStatusDisconnected: AccountStatusDisconnectedEvent;
	accountAdd: AccountAddEvent;
	accountReconnect: AccountReconnectEvent;
	accountRemove: AccountRemoveEvent;
	accountLocked: AccountLockedEvent;
	accountUnlocked: AccountUnlockedEvent;
};

// `body` is unknown because webhook transport may deliver a raw JSON string or
// an already-parsed object; neither shape is knowable at the type boundary.
export function parseBody(body: unknown): Record<string, unknown> | null {
	let value = body;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return null;
		}
	}
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}
	// Narrowed to a plain object by the checks above.
	return value as Record<string, unknown>;
}

function getHeader(
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== lower) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

/** Matches one Unipile event type. */
export function createUnipileMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) =>
		parseBody(request.body)?.type === eventType;
}

/**
 * Plugin-level matcher: a unipile-signature header and the Unipile event
 * envelope (string `type` and `account_id`). Requiring the header keeps other
 * providers' `type`-tagged webhooks out.
 */
export function matchUnipilePluginWebhook(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, UNIPILE_SIGNATURE_HEADER)) return false;
	const body = parseBody(request.body);
	return (
		body !== null &&
		typeof body.type === 'string' &&
		typeof body.account_id === 'string'
	);
}

/** Splits `t=…,v0=…` (one or more v0 values) into its parts. */
export function parseUnipileSignatureHeader(header: string): {
	timestamp?: string;
	signatures: string[];
} {
	let timestamp: string | undefined;
	const signatures: string[] = [];
	for (const part of header.split(',')) {
		const index = part.indexOf('=');
		if (index === -1) continue;
		const key = part.slice(0, index).trim();
		const value = part.slice(index + 1).trim();
		if (key === 't' && value) timestamp = value;
		if (key === 'v0' && value) signatures.push(value);
	}
	return { timestamp, signatures };
}

/** Hex HMAC-SHA256 of `<timestamp>.<rawBody>`, as Unipile signs deliveries. */
export function signUnipilePayload(
	secret: string,
	timestamp: string,
	rawBody: string,
): string {
	return crypto
		.createHmac('sha256', secret)
		.update(`${timestamp}.${rawBody}`)
		.digest('hex');
}

export function verifyUnipileWebhookSignature(
	// Payload stays unknown until the event schema parses it; verification
	// only needs headers and the raw body.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	options: { nowSeconds?: number; toleranceSeconds?: number } = {},
): { valid: boolean; error?: string } {
	// processWebhook already checked the provider signature for Hub deliveries,
	// and no plugin key is built for them.
	if (request.hubVerified === true) return { valid: true };

	if (!secret) {
		return {
			valid: false,
			error:
				'No Unipile webhook secret is configured (set webhookSecret or the stored webhook signature)',
		};
	}

	const header = getHeader(request.headers, UNIPILE_SIGNATURE_HEADER);
	if (!header) {
		return { valid: false, error: 'Missing unipile-signature header' };
	}

	const rawBody = request.rawBody;
	if (rawBody === undefined) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const { timestamp, signatures } = parseUnipileSignatureHeader(header);
	if (!timestamp || signatures.length === 0) {
		return { valid: false, error: 'Malformed unipile-signature header' };
	}

	const sentAt = Number(timestamp);
	const now = options.nowSeconds ?? Math.floor(Date.now() / 1000);
	const tolerance =
		options.toleranceSeconds ?? UNIPILE_SIGNATURE_TOLERANCE_SECONDS;
	if (!Number.isFinite(sentAt) || Math.abs(now - sentAt) > tolerance) {
		return { valid: false, error: 'Webhook timestamp is too old or invalid' };
	}

	const expected = Buffer.from(
		signUnipilePayload(secret, timestamp, rawBody),
		'utf8',
	);
	const matches = signatures.some((signature) => {
		const received = Buffer.from(signature.toLowerCase(), 'utf8');
		return (
			received.length === expected.length &&
			crypto.timingSafeEqual(received, expected)
		);
	});

	return matches
		? { valid: true }
		: { valid: false, error: 'Invalid signature' };
}
