import * as crypto from 'node:crypto';

import type { WebhookRequest } from 'corsair/core';

import { verifySentryWebhookSignature } from './webhooks/types';

describe('verifySentryWebhookSignature', () => {
	const secret = 'test-sentry-webhook-secret';
	const rawBody = '{"action":"created","data":{"issue":{"id":"123"}}}';
	const validSig = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');

	const baseRequest = (): WebhookRequest<unknown> => ({
		rawBody,
		headers: { 'sentry-hook-signature': validSig },
		payload: {},
	});

	it('returns valid when HMAC matches', () => {
		const r = verifySentryWebhookSignature(baseRequest(), secret);
		expect(r.valid).toBe(true);
		expect(r.error).toBeUndefined();
	});

	it('returns invalid when signature does not match', () => {
		const req: WebhookRequest<unknown> = {
			...baseRequest(),
			headers: { 'sentry-hook-signature': 'deadbeef' },
		};
		const r = verifySentryWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Invalid signature/);
	});

	it('rejects length-mismatched signature without throwing', () => {
		const req: WebhookRequest<unknown> = {
			...baseRequest(),
			headers: { 'sentry-hook-signature': 'ab' },
		};
		const r = verifySentryWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Invalid signature/);
	});

	it('returns invalid when secret is missing', () => {
		const r = verifySentryWebhookSignature(baseRequest(), undefined);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Missing webhook secret/);
	});

	it('returns invalid when rawBody is missing', () => {
		const req = { ...baseRequest(), rawBody: undefined };
		const r = verifySentryWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/raw body/);
	});

	it('returns invalid when sentry-hook-signature header is missing', () => {
		const req = { ...baseRequest(), headers: {} };
		const r = verifySentryWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/sentry-hook-signature/);
	});

	it('accepts sentry-hook-signature as array header', () => {
		const req: WebhookRequest<unknown> = {
			...baseRequest(),
			headers: { 'sentry-hook-signature': [validSig] },
		};
		const r = verifySentryWebhookSignature(req, secret);
		expect(r.valid).toBe(true);
	});
});
