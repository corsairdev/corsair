import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { InstaboxContext } from '../index';

/**
 * InstaBox signs every delivery the Standard Webhooks way
 * (https://instabox.sh/docs/integrations/webhooks.md):
 *
 *   webhook-id: evt_...            (the same on every retry)
 *   webhook-timestamp: <unix seconds>
 *   webhook-signature: v1,<base64 HMAC-SHA256 of "<id>.<timestamp>.<raw body>">
 *
 * keyed with the base64-decoded part of the endpoint secret after `whsec_`.
 * After a rotation the header lists two signatures (space separated) for 24
 * hours; either one counts. A timestamp more than 5 minutes off is refused.
 */
export const INSTABOX_SIGNATURE_TOLERANCE_SECONDS = 300;

export type InstaboxWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

function keyOf(secret: string): Buffer {
	const encoded = secret.startsWith('whsec_')
		? secret.slice('whsec_'.length)
		: secret;
	return Buffer.from(encoded, 'base64');
}

export function verifyInstaboxWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	nowSeconds: number = Math.floor(Date.now() / 1000),
): InstaboxWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		// Fail closed: never verify against an empty key.
		return {
			valid: false,
			error:
				'No InstaBox webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	const raw = request.rawBody;
	if (raw === undefined) return { valid: false, error: 'Missing raw body' };
	const id = getHeader(request.headers, 'webhook-id');
	const timestamp = getHeader(request.headers, 'webhook-timestamp');
	const header = getHeader(request.headers, 'webhook-signature');
	if (!id || !timestamp || !header) {
		return { valid: false, error: 'Missing InstaBox signature headers' };
	}
	if (!/^\d+$/.test(timestamp)) {
		return { valid: false, error: 'Malformed webhook-timestamp header' };
	}
	if (
		Math.abs(nowSeconds - Number(timestamp)) >
		INSTABOX_SIGNATURE_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'webhook-timestamp is too old' };
	}
	const key = keyOf(secret);
	if (key.length === 0) {
		// `whsec_` alone (or a secret that decodes to nothing) is no key.
		return { valid: false, error: 'The InstaBox webhook secret is empty' };
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
		: { valid: false, error: 'Invalid InstaBox webhook signature' };
}

/**
 * An event: `{ id, type, createdAt, orgId, data }`, where `data` describes
 * the machine (or snapshot) and the change (`state`, `previousState`,
 * `reason`, `operationId`). Fields stay optional and unknown ones pass through.
 */
export const InstaboxEventSchema = z
	.object({
		id: z.string().describe('The event id, the same on every retry.'),
		type: z.string().describe('The event type, such as sandbox.suspended.'),
		createdAt: z.string().nullish(),
		orgId: z.string().nullish().describe('The workspace the event is from.'),
		data: z
			.object({
				sandbox: z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						metadata: z.record(z.string(), z.unknown()).nullish(),
					})
					.passthrough()
					.nullish(),
				previousState: z.string().nullish(),
				state: z.string().nullish(),
				reason: z
					.string()
					.nullish()
					.describe('What moved it: user, idle, archive, wake or system.'),
				operationId: z.string().nullish(),
			})
			.passthrough()
			.nullish(),
	})
	.passthrough();

export type InstaboxEvent = z.infer<typeof InstaboxEventSchema>;

/** Every event InstaBox documents. */
export const INSTABOX_WEBHOOK_EVENTS = {
	'sandbox.created': 'A machine was accepted (state creating)',
	'sandbox.started':
		'A machine is running and ready for exec and SSH (after create, start, resume or wake)',
	'sandbox.stopped': 'A machine stopped',
	'sandbox.suspended':
		'A machine paused: by you, when idle, or by a plan limit',
	'sandbox.error': 'A machine is in error',
	'sandbox.deleted': 'A machine was deleted',
	'sandbox.queued': "A GPU machine's create or start joined the GPU queue",
	'sandbox.queue_ended':
		'A request in the GPU queue expired, was cancelled or failed (data.reason)',
	'snapshot.created': 'A snapshot is ready',
	'snapshot.failed': 'A snapshot failed to upload',
	'snapshot.deleted': 'A snapshot was deleted',
	'webhook.test': 'A test delivery (orgs.webhooks.test)',
} as const;

export type InstaboxEventType = keyof typeof INSTABOX_WEBHOOK_EVENTS;

const EVENT_TYPES = Object.keys(INSTABOX_WEBHOOK_EVENTS) as InstaboxEventType[];

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
 * The delivery's event type. Other senders use Standard Webhooks headers too,
 * so a delivery counts as InstaBox's only with them, an `orgId` and a type
 * InstaBox documents.
 */
export function instaboxEventTypeOf(
	request: Pick<RawWebhookRequest, 'headers' | 'body'>,
): InstaboxEventType | undefined {
	if (
		!getHeader(request.headers, 'webhook-signature') ||
		!getHeader(request.headers, 'webhook-id')
	) {
		return undefined;
	}
	const body = parsedBody(request.body);
	if (typeof body.orgId !== 'string') return undefined;
	return EVENT_TYPES.find((type) => type === body.type);
}

/** Any InstaBox event this plugin handles (the plugin's webhook matcher). */
export function isInstaboxDelivery(request: RawWebhookRequest): boolean {
	return instaboxEventTypeOf(request) !== undefined;
}

export type InstaboxWebhook = CorsairWebhook<
	InstaboxContext,
	InstaboxEvent,
	InstaboxEvent
>;

/**
 * One webhook per event. It matches its event, checks the signature with the
 * endpoint secret, and returns the event parsed leniently.
 */
function instaboxWebhook(type: InstaboxEventType): InstaboxWebhook {
	return {
		match: (request) => instaboxEventTypeOf(request) === type,
		handler: async (ctx, request) => {
			const verification = verifyInstaboxWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = InstaboxEventSchema.safeParse(request.payload);
			if (!parsed.success) {
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `InstaBox ${type} payload did not match its documented schema (${where})`,
				};
			}
			await logEventFromContext(
				ctx,
				`instabox.webhook.${type}`,
				// The event type and id only: the payload names machines and metadata.
				{ eventType: type, eventId: getHeader(request.headers, 'webhook-id') },
				'completed',
			);
			return { success: true, data: parsed.data };
		},
	};
}

export const instaboxWebhooksNested = {
	sandbox: {
		created: instaboxWebhook('sandbox.created'),
		started: instaboxWebhook('sandbox.started'),
		stopped: instaboxWebhook('sandbox.stopped'),
		suspended: instaboxWebhook('sandbox.suspended'),
		error: instaboxWebhook('sandbox.error'),
		deleted: instaboxWebhook('sandbox.deleted'),
		queued: instaboxWebhook('sandbox.queued'),
		queueEnded: instaboxWebhook('sandbox.queue_ended'),
	},
	snapshot: {
		created: instaboxWebhook('snapshot.created'),
		failed: instaboxWebhook('snapshot.failed'),
		deleted: instaboxWebhook('snapshot.deleted'),
	},
	webhook: {
		test: instaboxWebhook('webhook.test'),
	},
} as const;

function entry(type: InstaboxEventType) {
	return {
		description: `${INSTABOX_WEBHOOK_EVENTS[type]} (type ${type})`,
		payload: InstaboxEventSchema,
		response: InstaboxEventSchema,
	};
}

export const instaboxWebhookSchemas = {
	'sandbox.created': entry('sandbox.created'),
	'sandbox.started': entry('sandbox.started'),
	'sandbox.stopped': entry('sandbox.stopped'),
	'sandbox.suspended': entry('sandbox.suspended'),
	'sandbox.error': entry('sandbox.error'),
	'sandbox.deleted': entry('sandbox.deleted'),
	'sandbox.queued': entry('sandbox.queued'),
	'sandbox.queueEnded': entry('sandbox.queue_ended'),
	'snapshot.created': entry('snapshot.created'),
	'snapshot.failed': entry('snapshot.failed'),
	'snapshot.deleted': entry('snapshot.deleted'),
	'webhook.test': entry('webhook.test'),
};
