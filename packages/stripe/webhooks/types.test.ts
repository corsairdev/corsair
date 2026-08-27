import type { WebhookRequest } from 'corsair/core';
import * as crypto from 'crypto';
import { verifyStripeWebhookSignature } from './types';

describe('verifyStripeWebhookSignature', () => {
	const secret = 'whsec_test_secret';

	const stripeEvent = {
		id: 'evt_test_webhook',
		object: 'event',
		type: 'charge.succeeded',
		created: 1_672_531_200,
		livemode: false,
		data: {
			object: {
				id: 'ch_test_123',
				object: 'charge',
				amount: 2000,
				currency: 'usd',
				status: 'succeeded',
				description: 'café au lait',
			},
		},
	};

	const stripeEventBody = JSON.stringify(stripeEvent, null, 2);

	const requestWith = (
		headers: Record<string, string | string[]>,
		rawBody?: string,
	): WebhookRequest<unknown> => ({
		payload: {},
		headers,
		rawBody,
	});

	it('should fail closed when secret is missing', () => {
		const result = verifyStripeWebhookSignature(
			requestWith({ 'stripe-signature': 't=123,v1=abc' }, stripeEventBody),
			'',
		);

		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('should fail when rawBody is missing', () => {
		const result = verifyStripeWebhookSignature(
			requestWith({ 'stripe-signature': 't=123,v1=abc' }),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('should fail when stripe-signature header is missing', () => {
		const result = verifyStripeWebhookSignature(
			requestWith({}, stripeEventBody),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing stripe-signature header',
		});
	});

	it('should fail when stripe-signature header is empty', () => {
		const result = verifyStripeWebhookSignature(
			requestWith({ 'stripe-signature': '' }, stripeEventBody),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing stripe-signature header',
		});
	});

	it('should use first element when stripe-signature is an array', () => {
		const timestamp = Math.floor(Date.now() / 1000);

		const sig = crypto
			.createHmac('sha256', secret)
			.update(`${timestamp}.${stripeEventBody}`)
			.digest('hex');

		const result = verifyStripeWebhookSignature(
			requestWith(
				{ 'stripe-signature': [`t=${timestamp},v1=${sig}`, 'ignored'] },
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({ valid: true });
	});

	it('should fail for malformed stripe-signature header (no t= or v1=)', () => {
		const result = verifyStripeWebhookSignature(
			requestWith(
				{ 'stripe-signature': 'not-a-valid-header' },
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Malformed stripe-signature header',
		});
	});

	it('should return invalid for wrong v1 HMAC', () => {
		const timestamp = Math.floor(Date.now() / 1000);

		const result = verifyStripeWebhookSignature(
			requestWith(
				{ 'stripe-signature': `t=${timestamp},v1=wrong-v1` },
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({ valid: false, error: 'Invalid signature' });
	});

	it('should return valid with correct t=<unix>,v1=<hex> and a fresh timestamp', () => {
		const timestamp = Math.floor(Date.now() / 1000);

		const sig = crypto
			.createHmac('sha256', secret)
			.update(`${timestamp}.${stripeEventBody}`)
			.digest('hex');

		const result = verifyStripeWebhookSignature(
			requestWith(
				{ 'stripe-signature': `t=${timestamp},v1=${sig}` },
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({ valid: true });
	});

	it('should accept any matching v1 when multiple v1= tokens are present', () => {
		const timestamp = Math.floor(Date.now() / 1000);

		const goodSig = crypto
			.createHmac('sha256', secret)
			.update(`${timestamp}.${stripeEventBody}`)
			.digest('hex');

		const result = verifyStripeWebhookSignature(
			requestWith(
				{ 'stripe-signature': `t=${timestamp},v1=oldinvalidsig,v1=${goodSig}` },
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({ valid: true });
	});

	it('should still validate when framework re-stringifies body to compact form', () => {
		const timestamp = Math.floor(Date.now() / 1000);

		const sig = crypto
			.createHmac('sha256', secret)
			.update(`${timestamp}.${stripeEventBody}`)
			.digest('hex');

		const compactBody = JSON.stringify(stripeEvent);

		const result = verifyStripeWebhookSignature(
			requestWith(
				{
					'stripe-signature': `t=${timestamp},v1=${sig}`,
					'content-length': String(stripeEventBody.length),
				},
				compactBody,
			),
			secret,
		);

		expect(result).toEqual({ valid: true });
	});

	it('should reject a timestamp outside the 5-minute tolerance', () => {
		const staleTimestamp = Math.floor(Date.now() / 1000) - 600;

		const sig = crypto
			.createHmac('sha256', secret)
			.update(`${staleTimestamp}.${stripeEventBody}`)
			.digest('hex');

		const result = verifyStripeWebhookSignature(
			requestWith(
				{ 'stripe-signature': `t=${staleTimestamp},v1=${sig}` },
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Webhook timestamp is too old (possible replay attack)',
		});
	});
});
