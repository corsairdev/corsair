import { createHmac } from 'node:crypto';
import type { WoocommerceContext } from './index';
import {
	isWoocommerceDelivery,
	verifyWoocommerceWebhook,
	woocommerceWebhooksNested,
} from './webhooks';

const SECRET = 'a-long-random-secret';
const sign = (body: string, secret = SECRET) =>
	createHmac('sha256', secret).update(body).digest('base64');

function delivery(topic: string | undefined, payload: object, secret = SECRET) {
	const rawBody = JSON.stringify(payload);
	const headers: Record<string, string> = {
		'x-wc-webhook-id': '12',
		'x-wc-webhook-signature': sign(rawBody, secret),
		'x-wc-webhook-delivery-id': 'd-1',
	};
	if (topic) {
		headers['x-wc-webhook-topic'] = topic;
		headers['x-wc-webhook-resource'] = topic.split('.')[0] as string;
	}
	return { headers, rawBody, payload };
}

function ctx(): WoocommerceContext {
	// `unknown` because a test context fills only the fields the handlers read.
	return {
		key: SECRET,
		$getAccountId: async () => 'a',
	} as unknown as WoocommerceContext;
}

describe('woocommerce webhooks', () => {
	it('routes topics to their resource webhook', () => {
		const order = delivery('order.created', { id: 1 });
		expect(woocommerceWebhooksNested.order.match(order as never)).toBe(true);
		expect(woocommerceWebhooksNested.product.match(order as never)).toBe(false);
		const action = delivery('action.woocommerce_add_to_cart', { action: 'x' });
		expect(woocommerceWebhooksNested.action.match(action as never)).toBe(true);
		expect(isWoocommerceDelivery(order as never)).toBe(true);
		// The creation ping (`webhook_id=<id>`, no topic) is not a store event.
		expect(isWoocommerceDelivery(delivery(undefined, {}) as never)).toBe(false);
		expect(isWoocommerceDelivery({ headers: {} } as never)).toBe(false);
	});

	it('accepts a correctly signed delivery and parses it leniently', async () => {
		const request = delivery('order.updated', {
			id: 1001,
			status: 'completed',
			billing: [],
			line_items: [{ id: 1, name: 'Hoodie' }],
		});
		const result = await woocommerceWebhooksNested.order.handler(
			ctx(),
			request as never,
		);
		expect(result).toMatchObject({
			success: true,
			data: { id: 1001, status: 'completed', billing: {} },
		});
	});

	it('refuses a bad or missing signature', async () => {
		const forged = delivery('order.created', { id: 1 }, 'wrong-secret');
		await expect(
			woocommerceWebhooksNested.order.handler(ctx(), forged as never),
		).resolves.toMatchObject({ success: false, statusCode: 401 });
		expect(
			verifyWoocommerceWebhook(
				{ headers: {}, rawBody: '{}', payload: {} } as never,
				SECRET,
			),
		).toEqual({ valid: false, error: 'Missing X-WC-Webhook-Signature header' });
		expect(
			verifyWoocommerceWebhook(
				delivery('order.created', {}) as never,
				undefined,
			).valid,
		).toBe(false);
	});
});
