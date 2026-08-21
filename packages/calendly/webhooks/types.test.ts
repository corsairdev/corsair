import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import { verifyCalendlyWebhookSignature } from './types';

describe('Calendly verifyCalendlyWebhookSignature Tests', () => {
	const signingKey = 'my-signing-key';
	const rawBody = 'body';

	// WebhookRequest<unknown>: signature verification only reads rawBody/headers; the typed body is irrelevant here
	const requestWith = (
		headers: Record<string, string | string[] | undefined>,
		rawBody?: string,
	): WebhookRequest<unknown> => ({
		headers,
		rawBody,
		payload: {},
	});

	it('should fail close when signing key is missing', () => {
		const result = verifyCalendlyWebhookSignature(
			requestWith(
				{ 'calendly-webhook-signature': 'my-valid-signature' },
				rawBody,
			),
			'',
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing signing key',
		});
	});

	it('should return invalid for missing Calendly-Webhook-Signature header', () => {
		const result = verifyCalendlyWebhookSignature(
			requestWith({}, rawBody),
			signingKey,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing Calendly-Webhook-Signature header',
		});
	});

	it('should return invalid for wrong v1 signature', () => {
		const timestamp = Math.floor(Date.now() / 1000).toString();
		// Same-length hex so timingSafeEqual actually compares, not the length-mismatch path
		const signature = crypto
			.createHmac('sha256', 'a-different-key')
			.update(`${timestamp}.${rawBody}`)
			.digest('hex');

		const result = verifyCalendlyWebhookSignature(
			requestWith(
				{ 'calendly-webhook-signature': `t=${timestamp},v1=${signature}` },
				rawBody,
			),
			signingKey,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return valid for correct t=<unix>,v1=<hex> over ${timestamp}.${rawBody} with a fresh timestamp', () => {
		const timestamp = Math.floor(Date.now() / 1000).toString();

		const signature = crypto
			.createHmac('sha256', signingKey)
			.update(`${timestamp}.${rawBody}`)
			.digest('hex');

		const result = verifyCalendlyWebhookSignature(
			requestWith(
				{ 'calendly-webhook-signature': `t=${timestamp},v1=${signature}` },
				rawBody,
			),
			signingKey,
		);

		expect(result).toEqual({
			valid: true,
		});
	});

	it('should return invalid for missing raw body for signature verification', () => {
		const result = verifyCalendlyWebhookSignature(
			requestWith({ 'calendly-webhook-signature': 'my-valid-signature' }),
			signingKey,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('should return invalid for malformed Calendly-Webhook-Signature header', () => {
		const result = verifyCalendlyWebhookSignature(
			requestWith(
				{ 'calendly-webhook-signature': 'malformed-header' },
				rawBody,
			),
			signingKey,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Malformed Calendly-Webhook-Signature header',
		});
	});

	it('should return invalid for stale timestamp', () => {
		const staleTimestamp = (Math.floor(Date.now() / 1000) - 600).toString();

		const signature = crypto
			.createHmac('sha256', signingKey)
			.update(`${staleTimestamp}.${rawBody}`)
			.digest('hex');

		const result = verifyCalendlyWebhookSignature(
			requestWith(
				{ 'calendly-webhook-signature': `t=${staleTimestamp},v1=${signature}` },
				rawBody,
			),
			signingKey,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Webhook timestamp is too old or invalid',
		});
	});
});
