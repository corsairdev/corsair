import type {
	CorsairWebhook,
	CorsairWebhookMatcher,
	RawWebhookRequest,
} from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { ShippoContext } from '..';
import {
	BatchSchema,
	TrackSchema,
	TransactionSchema,
} from '../endpoints/types';

/**
 * Shippo webhooks are **not** notifications with a URL to fetch: the POST body
 * carries the whole object. That is the opposite of the Eventbrite pattern, so
 * the handler parses the payload directly rather than reading anything back.
 *
 * `event` is the discriminator: https://docs.goshippo.com/tracking/webhooks
 */
export const SHIPPO_WEBHOOK_EVENTS = [
	'transaction_created',
	'transaction_updated',
	'track_updated',
	'batch_created',
	'batch_purchased',
	'all',
] as const;

const WebhookEnvelope = z
	.object({
		event: z.string().min(1),
		test: z.boolean().nullish(),
		// unknown: `data` is discriminated by `event` below, so it is read as an
		// open object first and then parsed against the matching schema.
		data: z.unknown().nullish(),
	})
	.loose();

export const ShippoWebhookPayloadSchema = WebhookEnvelope.extend({
	data: z.union([TrackSchema, TransactionSchema, BatchSchema]).nullish(),
});

export type ShippoWebhookPayload = z.infer<typeof ShippoWebhookPayloadSchema>;

export type ShippoWebhookOutputs = {
	notification: {
		event: string;
		test: boolean | null;
		/** The parsed object, by event: a track, a transaction or a batch. */
		// unknown: the union above is resolved at runtime by `event`, and the
		// caller narrows it the same way.
		data: unknown;
	};
};

/**
 * Shippo does not sign webhook deliveries and offers no header to authenticate
 * one: `POST /webhooks` accepts only `url`, `event` and `is_test`. There is no
 * secret to verify, so this says so rather than inventing a check. Provenance
 * rests on the endpoint URL being private and on treating the payload as
 * untrusted input, which the schema below does.
 */
export function signatureSupported(): false {
	return false;
}

const EVENT_TO_SCHEMA = {
	track_updated: TrackSchema,
	transaction_created: TransactionSchema,
	transaction_updated: TransactionSchema,
	batch_created: BatchSchema,
	batch_purchased: BatchSchema,
} as const;

/** Every event a body could carry, plus the `all` catch-all. */
export function isShippoEvent(event: string): boolean {
	return event in EVENT_TO_SCHEMA || event === 'all';
}

/**
 * True for a body shaped like a Shippo delivery. Shippo's envelope is a bare
 * `{ event, test, data }`, so the presence of a string `event` that Shippo
 * actually emits is the strongest signal available without a header.
 */
export function isShippoDelivery(request: RawWebhookRequest): boolean {
	const body = request.body;
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		return false;
	}
	// unknown: the body is untrusted until the envelope parses it.
	const event = (body as Record<string, unknown>).event;
	return typeof event === 'string' && isShippoEvent(event);
}

export const deliveryMatch: CorsairWebhookMatcher = isShippoDelivery;

/**
 * Parses the delivery against the schema its `event` names. A payload whose
 * `data` does not match the event is a failure, not a blank record: mapping it
 * to an empty object would look like data the caller could act on.
 */
export function parseDelivery(
	// unknown: the body is untrusted until the event picks a schema for it.
	body: unknown,
): ShippoWebhookPayload {
	const envelope = WebhookEnvelope.parse(body);
	if (envelope.event === 'all') {
		// A catch-all delivery carries one of the concrete shapes inside it; the
		// object's own fields tell us which.
		return {
			...envelope,
			// unknown: the catch-all makes no promise about which object arrives.
			data: (envelope.data ?? null) as ShippoWebhookPayload['data'],
		};
	}
	const schema =
		EVENT_TO_SCHEMA[envelope.event as keyof typeof EVENT_TO_SCHEMA];
	if (!schema) {
		throw new Error(`Unsupported Shippo webhook event: ${envelope.event}`);
	}
	// A delivery with no `data` is not an empty object: every output field is
	// nullish, so `{}` would parse and read as a blank track or transaction.
	if (envelope.data === undefined || envelope.data === null) {
		throw new Error(`Shippo ${envelope.event} delivery has no data object`);
	}
	const parsed = schema.safeParse(envelope.data);
	if (!parsed.success) {
		throw new Error(
			`Shippo ${envelope.event} delivery has an unexpected data shape: ${parsed.error.issues[0]?.message ?? 'no detail'}`,
		);
	}
	return { ...envelope, data: parsed.data };
}

export const notification: CorsairWebhook<
	ShippoContext,
	ShippoWebhookPayload,
	ShippoWebhookOutputs['notification']
> = {
	match: deliveryMatch,
	handler: async (ctx, request) => {
		// Throwing, not returning `success: false`: processWebhook rewrites a
		// returned refusal to a successful delivery.
		const parsed = parseDelivery(request.payload);

		// unknown: the object is a track, transaction or batch; only shared keys are read.
		const data = (parsed.data ?? {}) as Record<string, unknown>;
		const objectId =
			typeof data.object_id === 'string' ? data.object_id : undefined;

		await logEventFromContext(
			ctx,
			`shippo.webhook.${parsed.event}`,
			{
				event: parsed.event,
				test: parsed.test ?? undefined,
				objectId,
				// A track's status and a transaction's status both live here; a
				// batch's object fields do not, so this stays undefined for those.
				status: typeof data.status === 'string' ? data.status : undefined,
			},
			'completed',
		);

		return {
			success: true,
			data: {
				event: parsed.event,
				test: parsed.test ?? null,
				data: parsed.data ?? null,
			},
		};
	},
};
