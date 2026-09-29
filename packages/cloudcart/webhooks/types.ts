import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/**
 * CloudCart store-event payloads are the store objects themselves: flat JSON
 * objects with no `type` envelope and no `data` wrapper. Verified against the
 * official order webhook example (help.cloudcart.com webhook article), which
 * is a flat order object carrying keys like `order_total`, `status`,
 * `customer_email`, and nested `products`/`payments` arrays.
 *
 * An explicit `{ type: 'order.created' | ... }` envelope is still accepted
 * wherever it appears so Hub-normalized deliveries keep working.
 */

const StoreIdSchema = z.union([z.string(), z.number()]);

export const OrderCreatedEventSchema = z
	.object({
		id: StoreIdSchema,
		order_total: z.unknown(),
	})
	.catchall(z.unknown());

export const ProductCreatedEventSchema = z
	.object({
		id: StoreIdSchema,
		sku: z.unknown(),
	})
	.catchall(z.unknown());

export const CustomerCreatedEventSchema = z
	.object({
		id: StoreIdSchema,
		email: z.unknown(),
	})
	.catchall(z.unknown());

export type OrderCreatedEvent = z.infer<typeof OrderCreatedEventSchema>;
export type ProductCreatedEvent = z.infer<typeof ProductCreatedEventSchema>;
export type CustomerCreatedEvent = z.infer<typeof CustomerCreatedEventSchema>;

export type CloudcartWebhookOutputs = {
	'order.created': OrderCreatedEvent;
	'product.created': ProductCreatedEvent;
	'customer.created': CustomerCreatedEvent;
};

const CLOUDCART_EVENT_TYPES = new Set([
	'order.created',
	'product.created',
	'customer.created',
]);

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

function bodyType(body: Record<string, unknown>): string | undefined {
	return typeof body.type === 'string' ? body.type : undefined;
}

/**
 * Fully case-insensitive header lookup. Runtime header casing varies
 * (`X-CloudCart-Signature` vs `x-cloudcart-signature`), so every key is
 * compared lowercased instead of probing one spelling.
 */
function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== lower) continue;
		if (typeof value === 'string' && value.length > 0) return value;
		if (
			Array.isArray(value) &&
			typeof value[0] === 'string' &&
			value[0].length > 0
		) {
			return value[0];
		}
	}
	return undefined;
}

/** Flat order object as delivered by CloudCart (see official Order.json example). */
export function isOrderPayload(body: Record<string, unknown>): boolean {
	if (bodyType(body) === 'order.created') return true;
	return 'order_total' in body || 'status_fulfillment' in body;
}

/** Standalone customer object. Checked after orders: orders also carry customer fields. */
export function isCustomerPayload(body: Record<string, unknown>): boolean {
	if (bodyType(body) === 'customer.created') return true;
	if ('order_total' in body || 'status_fulfillment' in body) return false;
	return 'email' in body;
}

/** Standalone product object. Checked after orders and customers. */
export function isProductPayload(body: Record<string, unknown>): boolean {
	if (bodyType(body) === 'product.created') return true;
	if ('order_total' in body || 'status_fulfillment' in body) return false;
	if ('email' in body) return false;
	return 'sku' in body;
}

function eventMatcher(
	eventType: 'order.created' | 'product.created' | 'customer.created',
	check: (body: Record<string, unknown>) => boolean,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (parsedBody === null) return false;
		if (bodyType(parsedBody) === eventType) return true;
		return check(parsedBody);
	};
}

export function createCloudcartMatch(eventType: string): CorsairWebhookMatcher {
	if (eventType === 'order.created')
		return eventMatcher(eventType, isOrderPayload);
	if (eventType === 'customer.created')
		return eventMatcher(eventType, isCustomerPayload);
	if (eventType === 'product.created')
		return eventMatcher(eventType, isProductPayload);
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && bodyType(parsedBody) === eventType;
	};
}

export function matchCloudcartWebhook(request: RawWebhookRequest): boolean {
	const parsed = parseBody(request.body);
	if (parsed === null) return false;
	if (
		typeof parsed.type === 'string' &&
		CLOUDCART_EVENT_TYPES.has(parsed.type)
	) {
		return true;
	}
	// Headers alone never match: any probe carrying an API key header without
	// a CloudCart-shaped body must not route here.
	return (
		isOrderPayload(parsed) ||
		isCustomerPayload(parsed) ||
		isProductPayload(parsed)
	);
}

export function verifyCloudcartWebhookSignature(
	request: WebhookRequest<CloudcartWebhookPayload>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) {
		return { valid: true };
	}

	const headers = request.headers as Record<
		string,
		string | string[] | undefined
	>;
	const presented =
		headerValue(headers, 'x-cloudcart-signature') ??
		headerValue(headers, 'x-hub-signature-256') ??
		headerValue(headers, 'x-cloudcart-hmac-sha256');

	if (!presented) {
		// CloudCart publishes no signature scheme for event webhooks, so real
		// deliveries are unsigned. Failing here would answer 401, and
		// CloudCart deactivates webhooks that answer 401. Only deliveries
		// carrying a signature are verified, and only against a configured
		// secret.
		return { valid: true };
	}
	if (!secret) {
		return {
			valid: false,
			error:
				'Signed delivery received but no webhook secret is configured (set options.webhookSecret or the webhook_signature key)',
		};
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const receivedHex = presented.startsWith('sha256=')
		? presented.slice(7)
		: presented;
	const expectedHex = createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');
	const received = Buffer.from(receivedHex, 'hex');
	const expected = Buffer.from(expectedHex, 'hex');
	if (
		received.length === 0 ||
		received.length !== expected.length ||
		!timingSafeEqual(received, expected)
	) {
		return { valid: false, error: 'Invalid CloudCart HMAC signature' };
	}

	return { valid: true };
}

export const CloudcartWebhookPayloadSchema = z
	.object({
		id: StoreIdSchema,
	})
	.catchall(z.unknown());

export type CloudcartWebhookPayload = z.infer<
	typeof CloudcartWebhookPayloadSchema
>;
