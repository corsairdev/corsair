import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { BrowserbaseContext } from '../index';

// Browserbase signs deliveries with Standard Webhooks
// (docs.browserbase.com/platform/webhooks/verifying-deliveries,
// standardwebhooks.com): `webhook-id`, `webhook-timestamp` and
// `webhook-signature` headers, an HMAC-SHA256 of `${id}.${timestamp}.${body}`
// with the endpoint's signing secret. Every event is an envelope
// `{ id, type, resourceId, data }`; Browserbase may add keys, so they pass.

function envelope<T extends string>(type: T, what: string) {
	return z
		.object({
			id: z
				.string()
				.describe('The event id; the same on every retry, so a dedupe key.'),
			type: z.literal(type),
			resourceId: z
				.string()
				.optional()
				.describe(`The ${what} the event is about.`),
			data: z
				.record(z.string(), z.unknown())
				.optional()
				.describe('Event-specific fields.'),
		})
		.passthrough();
}

export const BROWSERBASE_EVENTS = {
	'functions.invocations.pending': envelope(
		'functions.invocations.pending',
		'invocation',
	),
	'functions.invocations.running': envelope(
		'functions.invocations.running',
		'invocation',
	),
	'functions.invocations.completed': envelope(
		'functions.invocations.completed',
		'invocation',
	),
	'functions.invocations.failed': envelope(
		'functions.invocations.failed',
		'invocation',
	),
	'functions.builds.running': envelope('functions.builds.running', 'build'),
	'functions.builds.completed': envelope('functions.builds.completed', 'build'),
	'functions.builds.failed': envelope('functions.builds.failed', 'build'),
} as const;
type EventName = keyof typeof BROWSERBASE_EVENTS;
export type BrowserbaseWebhookEvent = z.infer<
	(typeof BROWSERBASE_EVENTS)[EventName]
>;

function header(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}

// `unknown` because the body is untrusted until a schema parses it.
function bodyOf(request: RawWebhookRequest): unknown {
	if (typeof request.body !== 'string') return request.body;
	try {
		return JSON.parse(request.body);
	} catch {
		return undefined;
	}
}

/** The event a Standard-Webhooks-signed request carries, when Browserbase sends that type. */
export function browserbaseEventName(
	request: RawWebhookRequest,
): EventName | undefined {
	if (!header(request.headers, 'webhook-signature')) return undefined;
	const body = bodyOf(request);
	const type =
		typeof body === 'object' && body !== null && 'type' in body
			? (body as { type?: unknown }).type
			: undefined;
	return typeof type === 'string' && type in BROWSERBASE_EVENTS
		? (type as EventName)
		: undefined;
}

export function matchBrowserbaseWebhook(request: RawWebhookRequest): boolean {
	return browserbaseEventName(request) !== undefined;
}

/**
 * Standard Webhooks: HMAC-SHA256 of `${webhook-id}.${webhook-timestamp}.${raw
 * body}` keyed with the base64 secret (after an optional `whsec_` prefix),
 * compared with every `v1,<base64>` entry of `webhook-signature`. Timestamps
 * more than five minutes off are refused.
 */
export function verifyBrowserbaseSignature(
	request: WebhookRequest<unknown>,
	secret: string,
	now: number = Date.now(),
): boolean {
	const id = header(request.headers, 'webhook-id');
	const timestamp = header(request.headers, 'webhook-timestamp');
	const signatures = header(request.headers, 'webhook-signature');
	if (!id || !timestamp || !signatures || !request.rawBody) return false;
	if (!/^\d+$/.test(timestamp)) return false;
	if (Math.abs(now - Number(timestamp) * 1000) > 300_000) return false;
	const encoded = secret.startsWith('whsec_') ? secret.slice(6) : secret;
	if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return false;
	const key = Buffer.from(encoded, 'base64');
	if (key.length === 0) return false;
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${request.rawBody}`)
		.digest();
	return signatures.split(/\s+/).some((entry) => {
		const [version, signature] = entry.split(',');
		if (version !== 'v1' || !signature) return false;
		const candidate = Buffer.from(signature, 'base64');
		return (
			candidate.length === expected.length &&
			timingSafeEqual(candidate, expected)
		);
	});
}

function webhookFor<Name extends EventName>(
	name: Name,
): CorsairWebhook<
	BrowserbaseContext,
	z.infer<(typeof BROWSERBASE_EVENTS)[Name]>,
	z.infer<(typeof BROWSERBASE_EVENTS)[Name]>
> {
	const schema = BROWSERBASE_EVENTS[name];
	return {
		match: (request) => browserbaseEventName(request) === name,
		handler: async (ctx, request) => {
			if (
				request.hubVerified !== true &&
				!verifyBrowserbaseSignature(request, ctx.key)
			) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid webhook signature',
				};
			}
			// Parse the verified bytes, not a separately parsed payload.
			try {
				if (!request.rawBody) throw new Error('Missing raw body');
				return {
					success: true,
					data: schema.parse(JSON.parse(request.rawBody)) as z.infer<
						(typeof BROWSERBASE_EVENTS)[Name]
					>,
				};
			} catch {
				return {
					success: false,
					statusCode: 400,
					error: 'Invalid webhook payload',
				};
			}
		},
	};
}

export const browserbaseWebhooksNested = {
	invocations: {
		pending: webhookFor('functions.invocations.pending'),
		running: webhookFor('functions.invocations.running'),
		completed: webhookFor('functions.invocations.completed'),
		failed: webhookFor('functions.invocations.failed'),
	},
	builds: {
		running: webhookFor('functions.builds.running'),
		completed: webhookFor('functions.builds.completed'),
		failed: webhookFor('functions.builds.failed'),
	},
} as const;

function entry(name: EventName, description: string) {
	return {
		description,
		payload: BROWSERBASE_EVENTS[name],
		response: BROWSERBASE_EVENTS[name],
	};
}

export const browserbaseWebhookSchemas = {
	'invocations.pending': entry(
		'functions.invocations.pending',
		'Browserbase accepted and queued a Function invocation.',
	),
	'invocations.running': entry(
		'functions.invocations.running',
		'A Function invocation started.',
	),
	'invocations.completed': entry(
		'functions.invocations.completed',
		'A Function invocation finished successfully.',
	),
	'invocations.failed': entry(
		'functions.invocations.failed',
		'A Function invocation failed.',
	),
	'builds.running': entry(
		'functions.builds.running',
		'A Function build started.',
	),
	'builds.completed': entry(
		'functions.builds.completed',
		'A Function build finished successfully.',
	),
	'builds.failed': entry('functions.builds.failed', 'A Function build failed.'),
} as const;
