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
			},
		},
	};

	/** Pretty-printed (2-space indent) — matches what Stripe actually sends over the wire. */
	const stripeEventBody = JSON.stringify(stripeEvent, null, 2);

	// unknown: the webhook payload type is generic at this layer; callers receive a typed payload after schema parsing
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

		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
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
				{
					'stripe-signature': `t=${timestamp},v1=wrong-v1`,
				},
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return valid with correct t=<unix>,v1=<hex> over ${timestamp}.${rawBody} with a fresh timestamp', () => {
		const timestamp = Math.floor(Date.now() / 1000);

		const expectedSignature = crypto
			.createHmac('sha256', secret)
			.update(`${timestamp}.${stripeEventBody}`)
			.digest('hex');

		const result = verifyStripeWebhookSignature(
			requestWith(
				{ 'stripe-signature': `t=${timestamp},v1=${expectedSignature}` },
				stripeEventBody,
			),
			secret,
		);

		expect(result).toEqual({ valid: true });
	});

	it('should still validate when framework re-stringifies body to compact form (pretty-print fallback)', () => {
		const timestamp = Math.floor(Date.now() / 1000);

		// Stripe signs over the pretty-printed body
		const signature = crypto
			.createHmac('sha256', secret)
			.update(`${timestamp}.${stripeEventBody}`)
			.digest('hex');

		// Framework parsed and re-stringified to compact form
		const compactBody = JSON.stringify(stripeEvent);

		const result = verifyStripeWebhookSignature(
			requestWith(
				{
					'stripe-signature': `t=${timestamp},v1=${signature}`,
					'content-length': String(stripeEventBody.length),
				},
				compactBody,
			),
			secret,
		);

		expect(result).toEqual({ valid: true });
	});

	it('should reject a timestamp outside the 5-minute tolerance', () => {
		const staleTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago

		const signature = crypto
			.createHmac('sha256', secret)
			.update(`${staleTimestamp}.${stripeEventBody}`)
			.digest('hex');

		const result = verifyStripeWebhookSignature(
			requestWith(
				{
					'stripe-signature': `t=${staleTimestamp},v1=${signature}`,
				},
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
