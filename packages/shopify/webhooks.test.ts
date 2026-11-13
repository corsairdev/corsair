import { createHmac } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { orderWebhookPayload } from './test-fixtures';
import { receive } from './webhooks/receive';
import {
	isSupportedTopic,
	SHOPIFY_HMAC_HEADER,
	SHOPIFY_SHOP_DOMAIN_HEADER,
	SHOPIFY_TOPIC_HEADER,
	SHOPIFY_WEBHOOK_ID_HEADER,
	verifyShopifySignature,
	verifyShopifyWebhook,
} from './webhooks/types';

const SECRET = 'shpss_test_secret';

function sign(body: string, secret = SECRET): string {
	return createHmac('sha256', secret).update(body, 'utf8').digest('base64');
}

function buildRequest(
	// unknown: a delivery body is arbitrary JSON; the handler's schema is what
	// rejects a wrong shape, and these tests feed it both.
	payload: unknown,
	{
		secret = SECRET,
		topic = 'orders/create',
		body,
	}: { secret?: string; topic?: string; body?: string } = {},
	// unknown: see `payload`; the request carries it through untyped.
): WebhookRequest<unknown> {
	const rawBody = body ?? JSON.stringify(payload);
	return {
		payload,
		rawBody,
		headers: {
			[SHOPIFY_HMAC_HEADER]: sign(rawBody, secret),
			[SHOPIFY_TOPIC_HEADER]: topic,
			[SHOPIFY_SHOP_DOMAIN_HEADER]: 'corsair-test.myshopify.com',
			[SHOPIFY_WEBHOOK_ID_HEADER]: 'wh-1',
		},
	};
}

const ctx = { options: { webhookSecret: SECRET } } as never;

describe('verifyShopifySignature', () => {
	it('accepts a signature computed over the exact body bytes', () => {
		const body = JSON.stringify(orderWebhookPayload);

		expect(verifyShopifySignature(body, sign(body), SECRET).valid).toBe(true);
	});

	it('rejects a body that was re-serialised after parsing', () => {
		const body = JSON.stringify(orderWebhookPayload);
		const reserialised = JSON.stringify(orderWebhookPayload, null, 2);

		// The signature covers bytes, so pretty-printing breaks it.
		expect(verifyShopifySignature(reserialised, sign(body), SECRET).valid).toBe(
			false,
		);
	});

	it('rejects a signature made with a different secret', () => {
		const body = JSON.stringify(orderWebhookPayload);

		expect(
			verifyShopifySignature(body, sign(body, 'wrong-secret'), SECRET).valid,
		).toBe(false);
	});

	it('rejects a delivery with no signature header', () => {
		const result = verifyShopifySignature('{}', undefined, SECRET);

		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing');
	});

	it('rejects a delivery when no secret is configured', () => {
		const body = '{}';
		const result = verifyShopifySignature(body, sign(body), undefined);

		expect(result.valid).toBe(false);
		expect(result.error).toContain('No Shopify webhook secret');
	});

	it('rejects a tampered header without throwing on a length change', () => {
		const body = '{}';

		// timingSafeEqual throws on unequal lengths; the guard must come first.
		expect(() => verifyShopifySignature(body, 'short', SECRET)).not.toThrow();
		expect(verifyShopifySignature(body, 'short', SECRET).valid).toBe(false);
	});

	it('skips verification when Hub already verified the delivery', () => {
		const result = verifyShopifyWebhook(
			{ payload: {}, headers: {}, hubVerified: true },
			undefined,
		);

		expect(result.valid).toBe(true);
	});
});

describe('receive handler', () => {
	it('reports the topic, shop and resource id for a verified order', async () => {
		const response = await receive.handler(
			ctx,
			buildRequest(orderWebhookPayload),
		);

		expect(response.success).toBe(true);
		expect(response.data).toEqual({
			topic: 'orders/create',
			shopDomain: 'corsair-test.myshopify.com',
			resourceId: '1001',
			signatureVerified: true,
		});
	});

	// Returning `success: false` is overwritten by processWebhook, so a refused
	// delivery has to throw or the sender is told it succeeded.
	it('throws rather than returning success:false on a bad signature', async () => {
		const request = buildRequest(orderWebhookPayload);
		request.headers[SHOPIFY_HMAC_HEADER] = sign('different body');

		await expect(receive.handler(ctx, request)).rejects.toThrow(
			/Signature does not match/,
		);
	});

	it('throws when no secret is configured', async () => {
		await expect(
			receive.handler(
				{ options: {} } as never,
				buildRequest(orderWebhookPayload),
			),
		).rejects.toThrow(/No Shopify webhook secret/);
	});

	it('throws for a topic it does not handle', async () => {
		await expect(
			receive.handler(
				ctx,
				buildRequest(orderWebhookPayload, { topic: 'shop/update' }),
			),
		).rejects.toThrow(/not supported/);
	});

	it('throws when the payload does not match the topic schema', async () => {
		// An order topic whose body has no id cannot be trusted or stored.
		await expect(
			receive.handler(ctx, buildRequest({ name: 'no id here' })),
		).rejects.toThrow(/does not match its schema/);
	});

	it('accepts a numeric id and exposes it as a string', async () => {
		const response = await receive.handler(
			ctx,
			buildRequest(orderWebhookPayload),
		);

		expect(typeof response.data?.resourceId).toBe('string');
	});

	it('marks a Hub-verified delivery as not locally verified', async () => {
		const request = buildRequest(orderWebhookPayload);
		request.hubVerified = true;

		const response = await receive.handler(ctx, request);

		expect(response.data?.signatureVerified).toBe(false);
	});
});

describe('matcher', () => {
	it('claims a delivery that names a topic and carries a signature', () => {
		expect(
			receive.match({
				headers: {
					[SHOPIFY_TOPIC_HEADER]: 'orders/create',
					[SHOPIFY_HMAC_HEADER]: 'sig',
				},
				body: {},
			}),
		).toBe(true);
	});

	it('ignores a request with no Shopify headers', () => {
		expect(receive.match({ headers: {}, body: {} })).toBe(false);
	});

	it('ignores a topic-only request with no signature', () => {
		expect(
			receive.match({
				headers: { [SHOPIFY_TOPIC_HEADER]: 'orders/create' },
				body: {},
			}),
		).toBe(false);
	});
});

describe('topic table', () => {
	it('recognises the supported topics', () => {
		for (const topic of [
			'orders/create',
			'orders/paid',
			'products/update',
			'customers/create',
		]) {
			expect(isSupportedTopic(topic)).toBe(true);
		}
	});

	it('does not claim an unrelated topic', () => {
		expect(isSupportedTopic('shop/update')).toBe(false);
	});
});
