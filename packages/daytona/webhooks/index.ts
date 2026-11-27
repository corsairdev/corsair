import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { DaytonaContext } from '../index';

/**
 * Daytona sends webhooks through Svix (its endpoints are managed in the Svix
 * app portal that webhooks.getAppPortalAccess opens), and Svix signs every
 * delivery (https://docs.svix.com/receiving/verifying-payloads/how-manual):
 *
 *   svix-id: msg_...                (the same on every retry)
 *   svix-timestamp: <unix seconds>
 *   svix-signature: v1,<base64 HMAC-SHA256 of "<id>.<timestamp>.<raw body>">
 *
 * keyed with the base64-decoded part of the endpoint's signing secret after
 * `whsec_` (shown on the endpoint's page in the portal). The same values may
 * come as `webhook-id`, `webhook-timestamp` and `webhook-signature`. After a
 * rotation the header lists several signatures (space separated); any one
 * counts. A timestamp more than 5 minutes off is refused.
 */
export const DAYTONA_SIGNATURE_TOLERANCE_SECONDS = 300;

export type DaytonaWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

function keyOf(secret: string): Buffer {
	// Callers check for an empty result: `whsec_` alone is no key.
	const encoded = secret.startsWith('whsec_')
		? secret.slice('whsec_'.length)
		: secret;
	return Buffer.from(encoded, 'base64');
}

export function verifyDaytonaWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	nowSeconds: number = Math.floor(Date.now() / 1000),
): DaytonaWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		// Fail closed: never verify against an empty key.
		return {
			valid: false,
			error:
				'No Daytona webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	const raw = request.rawBody;
	if (raw === undefined) return { valid: false, error: 'Missing raw body' };
	const id =
		getHeader(request.headers, 'svix-id') ??
		getHeader(request.headers, 'webhook-id');
	const timestamp =
		getHeader(request.headers, 'svix-timestamp') ??
		getHeader(request.headers, 'webhook-timestamp');
	const header =
		getHeader(request.headers, 'svix-signature') ??
		getHeader(request.headers, 'webhook-signature');
	if (!id || !timestamp || !header) {
		return { valid: false, error: 'Missing Daytona (Svix) signature headers' };
	}
	if (!/^\d+$/.test(timestamp)) {
		return { valid: false, error: 'Malformed svix-timestamp header' };
	}
	if (
		Math.abs(nowSeconds - Number(timestamp)) >
		DAYTONA_SIGNATURE_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'svix-timestamp is too old' };
	}
	const key = keyOf(secret);
	if (key.length === 0) {
		return { valid: false, error: 'The Daytona webhook secret is empty' };
	}
	const want = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${raw}`)
		.digest();
	const ok = header.split(' ').some((part) => {
		if (!part.startsWith('v1,')) return false;
		const got = Buffer.from(part.slice(3), 'base64');
		return got.length === want.length && timingSafeEqual(got, want);
	});
	return ok
		? { valid: true }
		: { valid: false, error: 'Invalid Daytona webhook signature' };
}

/**
 * An event: `{ event, timestamp, id, organizationId, ... }` with the
 * event's own fields (state, oldState and newState, name, sandboxClass).
 * Fields stay optional and unknown ones pass through.
 */
export const DaytonaEventSchema = z
	.object({
		event: z
			.string()
			.describe('The event type, such as sandbox.state.updated.'),
		timestamp: z.string().nullish().describe('When it happened (ISO 8601).'),
		id: z.string().nullish().describe('The sandbox, snapshot or volume id.'),
		organizationId: z.string().nullish(),
		name: z.string().nullish().describe('Snapshot or volume name.'),
		state: z.string().nullish(),
		oldState: z.string().nullish(),
		newState: z.string().nullish(),
		sandboxClass: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.passthrough();

export type DaytonaEvent = z.infer<typeof DaytonaEventSchema>;

/** Every event Daytona documents (https://www.daytona.io/docs/en/webhooks.md). */
export const DAYTONA_WEBHOOK_EVENTS = {
	'sandbox.created': 'A sandbox was created',
	'sandbox.state.updated': "A sandbox's state changed (oldState, newState)",
	'snapshot.created': 'A snapshot was created',
	'snapshot.state.updated': "A snapshot's state changed",
	'snapshot.removed': 'A snapshot was removed',
	'volume.created': 'A volume was created',
	'volume.state.updated': "A volume's state changed",
} as const;

export type DaytonaEventType = keyof typeof DAYTONA_WEBHOOK_EVENTS;

const EVENT_TYPES = Object.keys(DAYTONA_WEBHOOK_EVENTS) as DaytonaEventType[];

/** The body as an object: matchers may see the raw string or the parsed JSON. */
// `unknown` because the body is untrusted JSON until the payload schema parses it.
function parsedBody(body: unknown): Record<string, unknown> {
	let value = body;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return {};
		}
	}
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? // `unknown` because each field is narrowed where it's read.
			(value as Record<string, unknown>)
		: {};
}

/**
 * The delivery's event type: the body's `event`, on a delivery that carries
 * Svix (or Standard Webhooks) signature headers.
 */
export function daytonaEventTypeOf(
	request: Pick<RawWebhookRequest, 'headers' | 'body'>,
): DaytonaEventType | undefined {
	const signed =
		getHeader(request.headers, 'svix-signature') ??
		getHeader(request.headers, 'webhook-signature');
	if (!signed) return undefined;
	const body = parsedBody(request.body);
	return EVENT_TYPES.find((type) => type === body.event);
}

/** Any Daytona event this plugin handles (the plugin's webhook matcher). */
export function isDaytonaDelivery(request: RawWebhookRequest): boolean {
	return daytonaEventTypeOf(request) !== undefined;
}

export type DaytonaWebhook = CorsairWebhook<
	DaytonaContext,
	DaytonaEvent,
	DaytonaEvent
>;

/**
 * One webhook per event. It matches its event, checks the signature with the
 * endpoint secret, and returns the event parsed leniently.
 */
function daytonaWebhook(type: DaytonaEventType): DaytonaWebhook {
	return {
		match: (request) => daytonaEventTypeOf(request) === type,
		handler: async (ctx, request) => {
			const verification = verifyDaytonaWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = DaytonaEventSchema.safeParse(request.payload);
			if (!parsed.success) {
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `Daytona ${type} payload did not match its documented schema (${where})`,
				};
			}
			await logEventFromContext(
				ctx,
				`daytona.webhook.${type}`,
				// The event type and message id only.
				{
					eventType: type,
					messageId:
						getHeader(request.headers, 'svix-id') ??
						getHeader(request.headers, 'webhook-id'),
				},
				'completed',
			);
			return { success: true, data: parsed.data };
		},
	};
}

export const daytonaWebhooksNested = {
	sandbox: {
		created: daytonaWebhook('sandbox.created'),
		stateUpdated: daytonaWebhook('sandbox.state.updated'),
	},
	snapshot: {
		created: daytonaWebhook('snapshot.created'),
		stateUpdated: daytonaWebhook('snapshot.state.updated'),
		removed: daytonaWebhook('snapshot.removed'),
	},
	volume: {
		created: daytonaWebhook('volume.created'),
		stateUpdated: daytonaWebhook('volume.state.updated'),
	},
} as const;

function entry(type: DaytonaEventType) {
	return {
		description: `${DAYTONA_WEBHOOK_EVENTS[type]} (event ${type})`,
		payload: DaytonaEventSchema,
		response: DaytonaEventSchema,
	};
}

export const daytonaWebhookSchemas = {
	'sandbox.created': entry('sandbox.created'),
	'sandbox.stateUpdated': entry('sandbox.state.updated'),
	'snapshot.created': entry('snapshot.created'),
	'snapshot.stateUpdated': entry('snapshot.state.updated'),
	'snapshot.removed': entry('snapshot.removed'),
	'volume.created': entry('volume.created'),
	'volume.stateUpdated': entry('volume.state.updated'),
};
