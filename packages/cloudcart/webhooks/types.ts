import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const CloudcartWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});

export type CloudcartWebhookPayload = z.infer<
	typeof CloudcartWebhookPayloadSchema
>;

export const OrderCreatedEventSchema = CloudcartWebhookPayloadSchema.extend({
	type: z.literal('order.created'),
	data: z
		.object({
			id: z.union([z.string(), z.number()]),
		})
		.loose(),
});

export const ProductCreatedEventSchema = CloudcartWebhookPayloadSchema.extend({
	type: z.literal('product.created'),
	data: z
		.object({
			id: z.union([z.string(), z.number()]),
		})
		.loose(),
});

export const CustomerCreatedEventSchema = CloudcartWebhookPayloadSchema.extend({
	type: z.literal('customer.created'),
	data: z
		.object({
			id: z.union([z.string(), z.number()]),
		})
		.loose(),
});

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

function headerString(
	headers: Record<string, unknown>,
	name: string,
): string | undefined {
	const value = headers[name];
	if (typeof value === 'string' && value.length > 0) return value;
	if (
		Array.isArray(value) &&
		typeof value[0] === 'string' &&
		value[0].length > 0
	) {
		return value[0];
	}
	return undefined;
}

export function createCloudcartMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function matchCloudcartWebhook(request: RawWebhookRequest): boolean {
	const headers = request.headers as Record<string, unknown>;
	if (
		headerString(headers, 'x-cloudcart-apikey') ||
		headerString(headers, 'x-cloudcart-api-key')
	) {
		return true;
	}
	const parsed = parseBody(request.body);
	return (
		parsed !== null &&
		typeof parsed.type === 'string' &&
		CLOUDCART_EVENT_TYPES.has(parsed.type)
	);
}

export function verifyCloudcartWebhookSignature(
	request: WebhookRequest<CloudcartWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers as Record<string, unknown>;
	const presented =
		headerString(headers, 'x-cloudcart-signature') ??
		headerString(headers, 'x-hub-signature-256') ??
		headerString(headers, 'x-cloudcart-hmac-sha256');

	if (!presented) {
		return { valid: false, error: 'Missing CloudCart HMAC signature' };
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
