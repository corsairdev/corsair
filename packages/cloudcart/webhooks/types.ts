import { createHmac, timingSafeEqual } from 'node:crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
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

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
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

export function createCloudcartMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyCloudcartWebhookSignature(
	request: WebhookRequest<CloudcartWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const headers = request.headers;
	const signature =
		headers['x-cloudcart-signature'] ||
		headers['x-signature'] ||
		headers['x-cloudcart-hmac-sha256'];

	if (!signature || typeof signature !== 'string') {
		return { valid: false, error: 'Missing webhook signature header' };
	}

	try {
		const payloadString =
			typeof (request as any).body === 'string'
				? (request as any).body
				: JSON.stringify(request.payload ?? (request as any).body);

		const expectedSignature = createHmac('sha256', secret)
			.update(payloadString)
			.digest('hex');

		const sigBuf = Buffer.from(signature.toLowerCase(), 'utf8');
		const expBuf = Buffer.from(expectedSignature.toLowerCase(), 'utf8');

		if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
			return { valid: false, error: 'Invalid webhook signature' };
		}

		return { valid: true };

	} catch (err) {
		return {
			valid: false,
			error: err instanceof Error ? err.message : 'Signature verification failed',
		};
	}
}
