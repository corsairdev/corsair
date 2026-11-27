import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { MaritimeContext } from '../index';

/**
 * Maritime sends two kinds of signed deliveries
 * (https://maritime.sh/docs/sdk/webhooks):
 *
 * - Account events, from a subscription made with webhooks.create: agent,
 *   message, exec and end-user events. `X-Maritime-Event` names the event and
 *   `X-Maritime-Signature: sha256=<hex>` is the HMAC-SHA256 of the raw body
 *   keyed by the subscription's secret. `X-Maritime-Delivery` stays the same on
 *   every retry.
 * - Virtual machine events, from an endpoint made with sandboxWebhooks.create:
 *   `Maritime-Signature: t=<unix seconds>,v1=<hex>`, the HMAC-SHA256 of
 *   `<t>.<raw body>`; a timestamp more than 5 minutes off is refused (the
 *   same check maritime-sdk 0.13.0 makes).
 */
export const MARITIME_SIGNATURE_TOLERANCE_SECONDS = 300;

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

function hmacHex(secret: string, data: string): string {
	return createHmac('sha256', secret).update(data).digest('hex');
}

export type MaritimeWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyMaritimeWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	nowSeconds: number = Math.floor(Date.now() / 1000),
): MaritimeWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		// Fail closed: never verify against an empty key.
		return {
			valid: false,
			error:
				'No Maritime webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	const raw = request.rawBody;
	if (raw === undefined) return { valid: false, error: 'Missing raw body' };

	const account = getHeader(request.headers, 'x-maritime-signature');
	if (account) {
		const value = account.trim();
		if (!value.startsWith('sha256=')) {
			return { valid: false, error: 'Malformed X-Maritime-Signature header' };
		}
		return safeEqual(
			value.slice('sha256='.length).toLowerCase(),
			hmacHex(secret, raw),
		)
			? { valid: true }
			: { valid: false, error: 'Invalid Maritime webhook signature' };
	}

	const machine = getHeader(request.headers, 'maritime-signature');
	if (!machine)
		return { valid: false, error: 'Missing Maritime signature header' };
	let timestamp: string | undefined;
	const signatures: string[] = [];
	for (const part of machine.split(',')) {
		const at = part.indexOf('=');
		if (at === -1) continue;
		const name = part.slice(0, at).trim();
		const value = part.slice(at + 1).trim();
		if (name === 't') timestamp = value;
		else if (name === 'v1') signatures.push(value.toLowerCase());
	}
	if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0) {
		return { valid: false, error: 'Malformed Maritime-Signature header' };
	}
	if (
		Math.abs(nowSeconds - Number(timestamp)) >
		MARITIME_SIGNATURE_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'Maritime-Signature timestamp is too old' };
	}
	const expected = hmacHex(secret, `${timestamp}.${raw}`);
	return signatures.some((candidate) => safeEqual(candidate, expected))
		? { valid: true }
		: { valid: false, error: 'Invalid Maritime webhook signature' };
}

// ── Payloads ────────────────────────────────────────────────────────────────

/**
 * An account event: `{ event, agent_id, external_id, end_user, timestamp,
 * data }` (docs). Fields stay optional and unknown ones pass through.
 */
export const MaritimeAccountEventSchema = z
	.object({
		event: z.string().describe('The event name, such as agent.error.'),
		agent_id: z.string().nullish().describe('The agent the event is about.'),
		external_id: z
			.string()
			.nullish()
			.describe("The agent's external_id: your own customer's id."),
		end_user: z
			.object({})
			.passthrough()
			.nullish()
			.describe('The end user the agent belongs to, or null.'),
		timestamp: z.string().nullish().describe('When it happened (ISO 8601).'),
		data: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe(
				'Event fields: failure_kind on agent.error; execution_id, status, exit_code on exec.finished.',
			),
	})
	.passthrough();

/** A virtual machine event: `{ id, type, createdAt, sandboxId, endUser, data }` (maritime-sdk). */
export const MaritimeSandboxEventSchema = z
	.object({
		id: z.string().describe('The event id.'),
		type: z.string().describe('The event type, such as sandbox.ended.'),
		createdAt: z.string().nullish(),
		sandboxId: z.string().nullish(),
		endUser: z.string().nullish(),
		data: z.record(z.string(), z.string().nullable()).nullish(),
	})
	.passthrough();

export type MaritimeAccountEvent = z.infer<typeof MaritimeAccountEventSchema>;
export type MaritimeSandboxEvent = z.infer<typeof MaritimeSandboxEventSchema>;

type Family = 'account' | 'sandbox';

/** Every event Maritime documents, by Corsair webhook id. */
export const MARITIME_WEBHOOK_EVENTS = {
	'agent.deployed': ['account', 'The agent finished deploying and is ready'],
	'agent.error': [
		'account',
		'The agent entered an error state (data.failure_kind tells a failed build apart)',
	],
	'agent.sleeping': ['account', 'The agent auto-slept after going idle'],
	'agent.woken': ['account', 'A sleeping agent was woken'],
	'agent.restarted': ['account', 'The agent was restarted'],
	'agent.stopped': ['account', 'The agent was stopped'],
	'agent.llm_limit_reached': [
		'account',
		'The agent reached its monthly AI spend limit (once per agent per month)',
	],
	'message.reply': ['account', 'An async API message got its reply'],
	'message.failed': ['account', 'An async API message failed'],
	'exec.finished': [
		'account',
		'A detached exec reached a final status (data.execution_id, status, exit_code)',
	],
	'end_user.created': ['account', 'An end user was created'],
	'end_user.suspended': ['account', 'An end user was suspended'],
	'end_user.resumed': ['account', 'A suspended end user was resumed'],
	'end_user.deleted': ['account', 'An end user was deleted with their agents'],
	'sandbox.created': ['sandbox', 'A virtual machine was created'],
	'sandbox.running': ['sandbox', 'A virtual machine is running'],
	'sandbox.paused': ['sandbox', 'A virtual machine paused'],
	'sandbox.resumed': ['sandbox', 'A virtual machine resumed'],
	'sandbox.ended': ['sandbox', 'A virtual machine ended'],
	'sandbox.pause_failed': ['sandbox', 'A virtual machine failed to pause'],
	'sandbox.error': ['sandbox', 'A virtual machine hit an error'],
} as const satisfies Record<string, readonly [Family, string]>;

export type MaritimeEventType = keyof typeof MARITIME_WEBHOOK_EVENTS;

const EVENT_TYPES = Object.keys(MARITIME_WEBHOOK_EVENTS) as MaritimeEventType[];

/**
 * The delivery's event type: `X-Maritime-Event` on account events, else the
 * `type` of a virtual machine event's body.
 */
export function maritimeEventTypeOf(
	request: Pick<RawWebhookRequest, 'headers' | 'body'>,
): MaritimeEventType | undefined {
	const header = getHeader(request.headers, 'x-maritime-event');
	if (header) {
		return EVENT_TYPES.find(
			(type) =>
				type === header && MARITIME_WEBHOOK_EVENTS[type][0] === 'account',
		);
	}
	if (!getHeader(request.headers, 'maritime-signature')) return undefined;
	const body = parsedBody(request.body);
	const type =
		typeof body === 'object' && body !== null && 'type' in body
			? (body as { type?: unknown }).type
			: undefined;
	return EVENT_TYPES.find(
		(candidate) =>
			candidate === type && MARITIME_WEBHOOK_EVENTS[candidate][0] === 'sandbox',
	);
}

/** The body as an object: matchers may see the raw string or the parsed JSON. */
// `unknown` because the body is untrusted JSON until the payload schema parses it.
function parsedBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return undefined;
	}
}

/** Any Maritime event this plugin handles (the plugin's webhook matcher). */
export function isMaritimeDelivery(request: RawWebhookRequest): boolean {
	return maritimeEventTypeOf(request) !== undefined;
}

type AccountType = {
	[K in MaritimeEventType]: (typeof MARITIME_WEBHOOK_EVENTS)[K][0] extends 'account'
		? K
		: never;
}[MaritimeEventType];

type PayloadOf<T extends MaritimeEventType> = T extends AccountType
	? MaritimeAccountEvent
	: MaritimeSandboxEvent;

export type MaritimeWebhook<T extends MaritimeEventType> = CorsairWebhook<
	MaritimeContext,
	PayloadOf<T>,
	PayloadOf<T>
>;

function schemaFor(type: MaritimeEventType) {
	return MARITIME_WEBHOOK_EVENTS[type][0] === 'account'
		? MaritimeAccountEventSchema
		: MaritimeSandboxEventSchema;
}

/**
 * One webhook per Maritime event. It matches its event, checks the signature
 * with the webhook secret, and returns the delivery parsed leniently.
 */
function maritimeWebhook<T extends MaritimeEventType>(
	type: T,
): MaritimeWebhook<T> {
	return {
		match: (request) => maritimeEventTypeOf(request) === type,
		handler: async (ctx, request) => {
			const verification = verifyMaritimeWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = schemaFor(type).safeParse(request.payload);
			if (!parsed.success) {
				// Paths only: the payload holds your customers' ids.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `Maritime ${type} payload did not match its documented schema (${where})`,
				};
			}
			await logEventFromContext(
				ctx,
				`maritime.webhook.${type}`,
				// The event and delivery id only: the payload holds customer ids.
				{
					eventType: type,
					deliveryId:
						getHeader(request.headers, 'x-maritime-delivery') ??
						getHeader(request.headers, 'webhook-id'),
				},
				'completed',
			);
			return { success: true, data: parsed.data as PayloadOf<T> };
		},
	};
}

export const maritimeWebhooksNested = {
	agent: {
		deployed: maritimeWebhook('agent.deployed'),
		error: maritimeWebhook('agent.error'),
		sleeping: maritimeWebhook('agent.sleeping'),
		woken: maritimeWebhook('agent.woken'),
		restarted: maritimeWebhook('agent.restarted'),
		stopped: maritimeWebhook('agent.stopped'),
		llmLimitReached: maritimeWebhook('agent.llm_limit_reached'),
	},
	message: {
		reply: maritimeWebhook('message.reply'),
		failed: maritimeWebhook('message.failed'),
	},
	exec: {
		finished: maritimeWebhook('exec.finished'),
	},
	endUser: {
		created: maritimeWebhook('end_user.created'),
		suspended: maritimeWebhook('end_user.suspended'),
		resumed: maritimeWebhook('end_user.resumed'),
		deleted: maritimeWebhook('end_user.deleted'),
	},
	sandbox: {
		created: maritimeWebhook('sandbox.created'),
		running: maritimeWebhook('sandbox.running'),
		paused: maritimeWebhook('sandbox.paused'),
		resumed: maritimeWebhook('sandbox.resumed'),
		ended: maritimeWebhook('sandbox.ended'),
		pauseFailed: maritimeWebhook('sandbox.pause_failed'),
		error: maritimeWebhook('sandbox.error'),
	},
} as const;

function entry(type: MaritimeEventType) {
	const [family, text] = MARITIME_WEBHOOK_EVENTS[type];
	const schema = schemaFor(type);
	return {
		description: `${text} (${family === 'account' ? 'X-Maritime-Event' : 'type'} ${type})`,
		payload: schema,
		response: schema,
	};
}

export const maritimeWebhookSchemas = {
	'agent.deployed': entry('agent.deployed'),
	'agent.error': entry('agent.error'),
	'agent.sleeping': entry('agent.sleeping'),
	'agent.woken': entry('agent.woken'),
	'agent.restarted': entry('agent.restarted'),
	'agent.stopped': entry('agent.stopped'),
	'agent.llmLimitReached': entry('agent.llm_limit_reached'),
	'message.reply': entry('message.reply'),
	'message.failed': entry('message.failed'),
	'exec.finished': entry('exec.finished'),
	'endUser.created': entry('end_user.created'),
	'endUser.suspended': entry('end_user.suspended'),
	'endUser.resumed': entry('end_user.resumed'),
	'endUser.deleted': entry('end_user.deleted'),
	'sandbox.created': entry('sandbox.created'),
	'sandbox.running': entry('sandbox.running'),
	'sandbox.paused': entry('sandbox.paused'),
	'sandbox.resumed': entry('sandbox.resumed'),
	'sandbox.ended': entry('sandbox.ended'),
	'sandbox.pauseFailed': entry('sandbox.pause_failed'),
	'sandbox.error': entry('sandbox.error'),
};
