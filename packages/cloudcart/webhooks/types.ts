import { timingSafeEqual } from 'node:crypto';
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

function timingSafeStringEqual(left: string, right: string): boolean {
	const leftBuf = Buffer.from(left);
	const rightBuf = Buffer.from(right);
	if (leftBuf.length !== rightBuf.length) return false;
	return timingSafeEqual(leftBuf, rightBuf);
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

	const headers = request.headers as Record<string, unknown>;
	const presented =
		headerString(headers, 'x-cloudcart-apikey') ??
		headerString(headers, 'x-cloudcart-api-key');

	if (!presented) {
		return { valid: false, error: 'Missing CloudCart API key header' };
	}

	if (!timingSafeStringEqual(presented, secret)) {
		return { valid: false, error: 'Invalid CloudCart API key' };
	}

	return { valid: true };
}
