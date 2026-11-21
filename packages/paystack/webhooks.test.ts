import { createHmac } from 'node:crypto';
import { webhookEvent } from './test-fixtures';
import { event } from './webhooks';
import {
	matchPaystackEvent,
	matchPaystackWebhook,
	PaystackWebhookPayloadSchema,
	parseCurrentSignature,
	verifyPaystackWebhook,
} from './webhooks/types';

const SECRET_KEY = 'sk_test_paystack';
const SIGNING_SECRET = 'whsec_test_secret';

function legacySign(body: string, key: string): string {
	return createHmac('sha512', key).update(body).digest('hex');
}

function currentSign(timestamp: string, body: string, secret: string): string {
	return createHmac('sha512', secret)
		.update(`${timestamp}.${body}`)
		.digest('hex');
}

function rawRequest(
	// unknown: the delivery body is untyped until the payload schema parses
	// it; the fixture passes provider-shaped objects through.
	body: unknown,
	headers: Record<string, string> = {},
) {
	const rawBody = JSON.stringify(body);
	return { headers, payload: body, body, rawBody };
}

// unknown: the handler reads fields the webhook fixture does not carry; the
// runtime key manager carries many more methods than this stub implements.
function webhookContext(secret: string | undefined) {
	return {
		key: secret,
		keys: { get_webhook_signature: () => Promise.resolve(secret ?? null) },
	} as never;
}

describe('parseCurrentSignature', () => {
	it('parses the documented t=...,v1=keyid:sig format', () => {
		const parsed = parseCurrentSignature(
			't=1760270400,v1=whk_3f9a1c2e:9d1b2c3d',
		);
		expect(parsed).toEqual({
			timestamp: '1760270400',
			signatures: ['9d1b2c3d'],
		});
	});

	it('returns undefined for a malformed header', () => {
		expect(parseCurrentSignature('t=1760270400')).toBeUndefined();
		expect(parseCurrentSignature('v1=k:s')).toBeUndefined();
	});
});

describe('verifyPaystackWebhook', () => {
	it('accepts a legacy delivery signed with the secret key', () => {
		const raw = rawRequest(webhookEvent, {
			'x-paystack-signature': legacySign(
				JSON.stringify(webhookEvent),
				SECRET_KEY,
			),
		});
		expect(verifyPaystackWebhook(raw as never, SECRET_KEY)).toEqual({
			valid: true,
		});
	});

	it('rejects a legacy signature from another key', () => {
		const raw = rawRequest(webhookEvent, {
			'x-paystack-signature': legacySign(
				JSON.stringify(webhookEvent),
				'sk_other',
			),
		});
		const result = verifyPaystackWebhook(raw as never, SECRET_KEY);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('accepts a current delivery signed with the signing secret', () => {
		const timestamp = String(Math.floor(Date.now() / 1000));
		const rawBody = JSON.stringify(webhookEvent);
		const raw = rawRequest(webhookEvent, {
			'Paystack-Signature': `t=${timestamp},v1=whk_abc:${currentSign(timestamp, rawBody, SIGNING_SECRET)}`,
		});
		expect(verifyPaystackWebhook(raw as never, SIGNING_SECRET)).toEqual({
			valid: true,
		});
	});

	it('accepts a rotation delivery when either v1 signature matches', () => {
		const timestamp = String(Math.floor(Date.now() / 1000));
		const rawBody = JSON.stringify(webhookEvent);
		const good = currentSign(timestamp, rawBody, SIGNING_SECRET);
		const other = currentSign(timestamp, rawBody, 'whsec_other_secret');
		for (const header of [
			`t=${timestamp},v1=whk_old:${good},v1=whk_new:${other}`,
			`t=${timestamp},v1=whk_old:${other},v1=whk_new:${good}`,
		]) {
			const raw = rawRequest(webhookEvent, { 'Paystack-Signature': header });
			expect(verifyPaystackWebhook(raw as never, SIGNING_SECRET)).toEqual({
				valid: true,
			});
		}
		const neither = rawRequest(webhookEvent, {
			'Paystack-Signature': `t=${timestamp},v1=whk_old:${other},v1=whk_new:${other}`,
		});
		expect(verifyPaystackWebhook(neither as never, SIGNING_SECRET).valid).toBe(
			false,
		);
	});

	it('rejects a current delivery whose timestamp is outside the 300s tolerance', () => {
		const timestamp = String(Math.floor(Date.now() / 1000) - 600);
		const rawBody = JSON.stringify(webhookEvent);
		const raw = rawRequest(webhookEvent, {
			'Paystack-Signature': `t=${timestamp},v1=whk_abc:${currentSign(timestamp, rawBody, SIGNING_SECRET)}`,
		});
		const result = verifyPaystackWebhook(raw as never, SIGNING_SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('300s tolerance');
	});

	it('rejects a delivery without either signature header', () => {
		const result = verifyPaystackWebhook(
			rawRequest(webhookEvent) as never,
			SECRET_KEY,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('x-paystack-signature');
	});

	it('rejects when no secret is configured', () => {
		const raw = rawRequest(webhookEvent, {
			'x-paystack-signature': legacySign(
				JSON.stringify(webhookEvent),
				SECRET_KEY,
			),
		});
		const result = verifyPaystackWebhook(raw as never, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('keys.set_webhook_signature');
	});

	it('rejects when the raw body was not captured', () => {
		const request = {
			headers: {
				'x-paystack-signature': legacySign(
					JSON.stringify(webhookEvent),
					SECRET_KEY,
				),
			},
			body: webhookEvent,
			rawBody: undefined,
		};
		const result = verifyPaystackWebhook(request as never, SECRET_KEY);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without a signature', () => {
		const request = { headers: {}, body: webhookEvent, hubVerified: true };
		expect(verifyPaystackWebhook(request as never, undefined)).toEqual({
			valid: true,
		});
	});
});

describe('matchPaystackWebhook', () => {
	it('matches the documented event envelope when it carries a Paystack signature header', () => {
		expect(
			matchPaystackWebhook(
				rawRequest(webhookEvent, { 'x-paystack-signature': 'abc' }) as never,
			),
		).toBe(true);
		expect(
			matchPaystackWebhook(
				rawRequest(webhookEvent, {
					'Paystack-Signature': 't=1,v1=whk_a:b',
				}) as never,
			),
		).toBe(true);
	});

	it('leaves unsigned { event } bodies (Zoom and others) to other plugins', () => {
		expect(
			matchPaystackWebhook(
				rawRequest({ event: 'meeting.created', payload: {} }) as never,
			),
		).toBe(false);
	});

	it('does not match bodies without an event string', () => {
		const signed = { 'x-paystack-signature': 'abc' };
		expect(
			matchPaystackWebhook(rawRequest({ data: {} }, signed) as never),
		).toBe(false);
		expect(
			matchPaystackWebhook(rawRequest([webhookEvent], signed) as never),
		).toBe(false);
	});
});

describe('matchPaystackEvent', () => {
	it('matches a Hub-routed delivery without signature headers', () => {
		expect(matchPaystackEvent(rawRequest(webhookEvent) as never)).toBe(true);
	});
});

describe('PaystackWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = PaystackWebhookPayloadSchema.parse(webhookEvent);
		expect(parsed.event).toBe('charge.success');
		const data = parsed.data as Record<string, unknown> | undefined;
		expect(data?.['reference']).toBe('7PVGX8MEk85tgeEpVDtD');
	});

	it('parses subscription.expiring_cards, whose data is an array', () => {
		const parsed = PaystackWebhookPayloadSchema.parse({
			event: 'subscription.expiring_cards',
			data: [
				{
					expiry_date: '12/2026',
					subscription: { subscription_code: 'SUB_x' },
				},
			],
		});
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('rejects a delivery without an event', () => {
		expect(() => PaystackWebhookPayloadSchema.parse({ data: {} })).toThrow();
	});
});

describe('paystack.event handler', () => {
	it('returns a 401 refusal for an unverified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET_KEY),
			rawRequest(webhookEvent, { 'x-paystack-signature': 'bad' }) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a body the payload schema rejects', async () => {
		const body = { data: {} };
		const result = await event.handler(
			webhookContext(SECRET_KEY),
			rawRequest(body, {
				'x-paystack-signature': legacySign(JSON.stringify(body), SECRET_KEY),
			}) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('accepts a signed subscription.expiring_cards delivery with array data', async () => {
		const body = {
			event: 'subscription.expiring_cards',
			data: [
				{
					expiry_date: '12/2026',
					description: 'visa ending with 4081',
					subscription: { subscription_code: 'SUB_x', amount: 50000 },
				},
			],
		};
		const result = await event.handler(
			webhookContext(SECRET_KEY),
			rawRequest(body, {
				'x-paystack-signature': legacySign(JSON.stringify(body), SECRET_KEY),
			}) as never,
		);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed event object.
		const data = (result as { data?: { data?: unknown } }).data;
		expect(Array.isArray(data?.data)).toBe(true);
	});

	it('returns the parsed event for a verified legacy delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET_KEY),
			rawRequest(webhookEvent, {
				'x-paystack-signature': legacySign(
					JSON.stringify(webhookEvent),
					SECRET_KEY,
				),
			}) as never,
		);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed event object.
		const data = (result as { data?: { event?: string } }).data;
		expect(data?.event).toBe('charge.success');
	});
});
