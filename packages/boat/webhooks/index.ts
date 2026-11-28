import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { BoatContext } from '../index';

// Boat posts sandbox lifecycle events to every endpoint made with
// webhooks.create (https://docs.boat.dev/webhooks.md, and the `webhooks`
// section of the OpenAPI spec). Each request carries X-Ascii-Event,
// X-Ascii-Delivery (the event id), X-Ascii-Timestamp, X-Ascii-Signature
// (`v1=<hex HMAC-SHA256>`) and X-Ascii-Attempt; the header names keep the
// old Ascii prefix. The secret is the `whsec_...` value webhooks.create and
// webhooks.rotateSecret return, used as is.

export const BoatWebhookEventTypeSchema = z.enum([
	'sandbox.ready',
	'sandbox.error',
	'sandbox.archived',
	'sandbox.hydrated',
	'sandbox.degraded',
	'sandbox.recovered',
]);
export type BoatWebhookEventType = z.infer<typeof BoatWebhookEventTypeSchema>;

/** The documented body; fields Boat adds later pass through. */
function eventSchema<T extends BoatWebhookEventType>(type: T) {
	return z
		.object({
			id: z
				.string()
				.describe(
					'The event id (evt_ + 32 hex), the same as X-Ascii-Delivery: use it to drop repeats.',
				),
			type: z.literal(type),
			createdAt: z.string().describe('ISO 8601 time Boat created the event.'),
			data: z
				.object({
					sandbox: z
						.object({
							id: z.string().describe('The public sandbox id (bx_...).'),
							name: z.string().nullish().describe('The sandbox name.'),
						})
						.passthrough(),
					previousState: z
						.string()
						.nullish()
						.describe(
							'The state before the change (on ready, error and archived).',
						),
					state: z
						.string()
						.nullish()
						.describe('The state now (absent on hydrated).'),
					reason: z
						.string()
						.nullish()
						.describe(
							'Why the sandbox is degraded (on degraded; null on recovered).',
						),
				})
				.passthrough(),
		})
		.passthrough();
}

export const SandboxReadySchema = eventSchema('sandbox.ready');
export const SandboxErrorSchema = eventSchema('sandbox.error');
export const SandboxArchivedSchema = eventSchema('sandbox.archived');
export const SandboxHydratedSchema = eventSchema('sandbox.hydrated');
export const SandboxDegradedSchema = eventSchema('sandbox.degraded');
export const SandboxRecoveredSchema = eventSchema('sandbox.recovered');

const EVENTS = {
	'sandbox.ready': SandboxReadySchema,
	'sandbox.error': SandboxErrorSchema,
	'sandbox.archived': SandboxArchivedSchema,
	'sandbox.hydrated': SandboxHydratedSchema,
	'sandbox.degraded': SandboxDegradedSchema,
	'sandbox.recovered': SandboxRecoveredSchema,
} as const;

export type BoatWebhookEvent = z.infer<(typeof EVENTS)[BoatWebhookEventType]>;

/** How far X-Ascii-Timestamp may be from now, as Boat's own examples check. */
const TOLERANCE_MS = 300_000;

function header(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}

/** The event a Boat-signed request carries, from its X-Ascii-Event header. */
export function boatEventName(
	request: RawWebhookRequest,
): BoatWebhookEventType | undefined {
	if (!header(request.headers, 'x-ascii-signature')) return undefined;
	const name = header(request.headers, 'x-ascii-event');
	const parsed = BoatWebhookEventTypeSchema.safeParse(name);
	return parsed.success ? parsed.data : undefined;
}

export function matchBoatWebhook(request: RawWebhookRequest): boolean {
	return boatEventName(request) !== undefined;
}

/**
 * Boat's scheme: HMAC-SHA256 with the secret over
 * `${X-Ascii-Delivery}.${X-Ascii-Timestamp}.${raw body}`, hex, sent as
 * `v1=<hex>`. Compared in constant time; a timestamp more than five minutes
 * off is refused.
 */
export function verifyBoatSignature(
	request: WebhookRequest<unknown>,
	secret: string,
	now: number = Date.now(),
): boolean {
	const delivery = header(request.headers, 'x-ascii-delivery');
	const timestamp = header(request.headers, 'x-ascii-timestamp');
	const signature = header(request.headers, 'x-ascii-signature');
	if (!delivery || !timestamp || !signature || !request.rawBody) return false;
	if (!secret.trim()) return false;
	if (!/^\d+$/.test(timestamp)) return false;
	if (Math.abs(now - Number(timestamp) * 1000) > TOLERANCE_MS) return false;
	const supplied = signature.trim().replace(/^v1=/, '');
	if (!/^[a-f0-9]{64}$/i.test(supplied)) return false;
	const expected = createHmac('sha256', secret)
		.update(`${delivery}.${timestamp}.${request.rawBody}`)
		.digest();
	return timingSafeEqual(Buffer.from(supplied, 'hex'), expected);
}

function webhookFor<Name extends BoatWebhookEventType>(
	name: Name,
): CorsairWebhook<
	BoatContext,
	z.infer<(typeof EVENTS)[Name]>,
	z.infer<(typeof EVENTS)[Name]>
> {
	const schema = EVENTS[name];
	return {
		match: (request) => boatEventName(request) === name,
		handler: async (ctx, request) => {
			if (
				request.hubVerified !== true &&
				!verifyBoatSignature(request, ctx.key)
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
				const parsed = schema.parse(JSON.parse(request.rawBody));
				// The signed body names the same event as the header that routed it.
				if (parsed.id !== header(request.headers, 'x-ascii-delivery')) {
					throw new Error('Event id does not match X-Ascii-Delivery');
				}
				return {
					success: true,
					data: parsed as z.infer<(typeof EVENTS)[Name]>,
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

export const boatWebhooksNested = {
	sandboxes: {
		ready: webhookFor('sandbox.ready'),
		error: webhookFor('sandbox.error'),
		archived: webhookFor('sandbox.archived'),
		hydrated: webhookFor('sandbox.hydrated'),
		degraded: webhookFor('sandbox.degraded'),
		recovered: webhookFor('sandbox.recovered'),
	},
} as const;

export const boatWebhookSchemas = {
	'sandboxes.ready': {
		description:
			'A sandbox became usable (ready, idle or running) after it was not, including after an error (sandbox.ready).',
		payload: SandboxReadySchema,
		response: SandboxReadySchema,
	},
	'sandboxes.error': {
		description: 'A sandbox entered the error state (sandbox.error).',
		payload: SandboxErrorSchema,
		response: SandboxErrorSchema,
	},
	'sandboxes.archived': {
		description:
			'A sandbox stopped; the API reports a stopped sandbox as archived (sandbox.archived).',
		payload: SandboxArchivedSchema,
		response: SandboxArchivedSchema,
	},
	'sandboxes.hydrated': {
		description:
			'A restored sandbox finished copying its disk and Docker volumes into place, after sandbox.ready (sandbox.hydrated).',
		payload: SandboxHydratedSchema,
		response: SandboxHydratedSchema,
	},
	'sandboxes.degraded': {
		description:
			'The machine is alive but Boat cannot fully reach it; data.reason says why (sandbox.degraded).',
		payload: SandboxDegradedSchema,
		response: SandboxDegradedSchema,
	},
	'sandboxes.recovered': {
		description:
			'A degraded sandbox is fully reachable again (sandbox.recovered).',
		payload: SandboxRecoveredSchema,
		response: SandboxRecoveredSchema,
	},
} as const;
