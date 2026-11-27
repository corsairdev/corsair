import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import {
	getNetlifyWebhookPayloadSchema,
	netlifyWebhookFor,
} from '../endpoints/openapi-schema';
import type { NetlifyWebhookPayloads } from '../endpoints/operation-types';
import type { NetlifyContext } from '../index';

/**
 * Netlify signs an outgoing webhook (hooks.create with type `url`) when it
 * has a JWS secret (`data.signature_secret`):
 *
 *   X-Webhook-Signature: <JWT, HS256, keyed by the secret>
 *
 * whose claims are `iss: "netlify"` and `sha256`, the hex SHA-256 of the raw
 * body. The event goes out as X-Netlify-Event (`deploy_created`,
 * `submission_created` ...). https://docs.netlify.com/deploy/deploy-notifications/#payload-signature
 */
function safeEqual(left: Buffer, right: Buffer): boolean {
	return left.length === right.length && timingSafeEqual(left, right);
}

function base64UrlDecode(part: string): Buffer | undefined {
	if (!/^[A-Za-z0-9_-]*$/.test(part)) return undefined;
	return Buffer.from(part, 'base64url');
}

// `unknown` because a JWT segment is untrusted JSON until its fields are checked.
function jsonOf(part: Buffer): Record<string, unknown> | undefined {
	try {
		const value: unknown = JSON.parse(part.toString('utf8'));
		return typeof value === 'object' && value !== null && !Array.isArray(value)
			? (value as Record<string, unknown>)
			: undefined;
	} catch {
		return undefined;
	}
}

export type NetlifyWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

/** Checks X-Webhook-Signature against the secret and the raw body. */
export function verifyNetlifyWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): NetlifyWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Netlify webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const token = getHeader(request.headers, 'x-webhook-signature')?.trim();
	if (!token) {
		// Netlify sends no signature for a hook without a JWS secret.
		return { valid: false, error: 'Missing X-Webhook-Signature header' };
	}
	const parts = token.split('.');
	if (parts.length !== 3) {
		return { valid: false, error: 'Malformed Netlify webhook signature' };
	}
	const [head, claims, signature] = parts as [string, string, string];
	const headBytes = base64UrlDecode(head);
	const claimBytes = base64UrlDecode(claims);
	const signatureBytes = base64UrlDecode(signature);
	if (!headBytes || !claimBytes || !signatureBytes) {
		return { valid: false, error: 'Malformed Netlify webhook signature' };
	}
	const header = jsonOf(headBytes);
	if (header?.alg !== 'HS256') {
		// Only HS256 is accepted: `none` or another algorithm is never trusted.
		return { valid: false, error: 'Unexpected Netlify signature algorithm' };
	}
	const expected = createHmac('sha256', secret)
		.update(`${head}.${claims}`)
		.digest();
	if (!safeEqual(signatureBytes, expected)) {
		return { valid: false, error: 'Invalid Netlify webhook signature' };
	}
	const payload = jsonOf(claimBytes);
	if (payload?.iss !== 'netlify') {
		return { valid: false, error: 'Netlify signature has the wrong issuer' };
	}
	const digest = createHash('sha256').update(request.rawBody).digest('hex');
	if (
		typeof payload.sha256 !== 'string' ||
		!safeEqual(Buffer.from(payload.sha256.toLowerCase()), Buffer.from(digest))
	) {
		return {
			valid: false,
			error: 'Netlify signature does not match the body',
		};
	}
	return { valid: true };
}

export type NetlifyWebhookId = keyof NetlifyWebhookPayloads;

const WEBHOOK_IDS = [
	'deploy',
	'devServer',
	'splitTest',
	'submission',
] as const satisfies readonly NetlifyWebhookId[];

/** The delivery's event (X-Netlify-Event: `deploy_created`, `submission_created` ...). */
export function netlifyEventTypeOf(
	request: Pick<RawWebhookRequest, 'headers'>,
): string | undefined {
	return getHeader(request.headers, 'x-netlify-event') || undefined;
}

/** Which webhook handles an event (`deploy_failed` → `deploy`). */
export function webhookIdFor(eventType: string): NetlifyWebhookId | undefined {
	return WEBHOOK_IDS.find((id) =>
		netlifyWebhookFor(id).eventTypes.includes(eventType),
	);
}

/** Any Netlify event this plugin handles (used as the plugin's webhook matcher). */
export function isNetlifyDelivery(request: RawWebhookRequest): boolean {
	const eventType = netlifyEventTypeOf(request);
	return eventType !== undefined && webhookIdFor(eventType) !== undefined;
}

export type NetlifyWebhook<Id extends NetlifyWebhookId> = CorsairWebhook<
	NetlifyContext,
	NetlifyWebhookPayloads[Id],
	NetlifyWebhookPayloads[Id]
>;

/**
 * One webhook per kind of payload: `deploy` (every deploy event, the body is
 * the deploy), `submission` (a form submission), `splitTest` and
 * `devServer`. It matches its events,
 * checks the JWS signature with the hook's secret, and returns the delivery
 * parsed leniently against Netlify's swagger definitions.
 */
function netlifyWebhook<Id extends NetlifyWebhookId>(
	id: Id,
): NetlifyWebhook<Id> {
	return {
		match: (request) => {
			const eventType = netlifyEventTypeOf(request);
			return eventType !== undefined && webhookIdFor(eventType) === id;
		},
		handler: async (ctx, request) => {
			const verification = verifyNetlifyWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = getNetlifyWebhookPayloadSchema(id).safeParse(
				request.payload,
			);
			if (!parsed.success) {
				// Paths only: the payload holds form submissions and commit details.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `Netlify ${id} payload did not match its documented schema (${where})`,
				};
			}
			const event = parsed.data as NetlifyWebhookPayloads[Id];
			await logEventFromContext(
				ctx,
				`netlify.webhook.${id}`,
				// The event type only: the payload holds form submissions and commit details.
				{ eventType: netlifyEventTypeOf(request) },
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const netlifyWebhooksNested = {
	deploy: netlifyWebhook('deploy'),
	devServer: netlifyWebhook('devServer'),
	splitTest: netlifyWebhook('splitTest'),
	submission: netlifyWebhook('submission'),
} as const;

function describe(id: NetlifyWebhookId): string {
	const webhook = netlifyWebhookFor(id);
	return `${webhook.summary} (X-Netlify-Event ${webhook.eventTypes.join(', ')})`;
}

/** Schemas are getters, so a payload schema is built only when something reads it. */
function webhookSchemaEntry(id: NetlifyWebhookId) {
	return {
		description: describe(id),
		get payload() {
			return getNetlifyWebhookPayloadSchema(id);
		},
		get response() {
			return getNetlifyWebhookPayloadSchema(id);
		},
	};
}

export const netlifyWebhookSchemas = Object.fromEntries(
	WEBHOOK_IDS.map((id) => [id, webhookSchemaEntry(id)]),
) as { [Id in NetlifyWebhookId]: ReturnType<typeof webhookSchemaEntry> };
