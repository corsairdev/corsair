import * as crypto from 'node:crypto';

import type { WebhookRequest } from 'corsair/core';

import type { CalWebhookPayload } from './types';
import { verifyCalWebhookSignature } from './types';

describe('verifyCalWebhookSignature', () => {
	const secret = 'whsec_cal_test';
	const rawBody =
		'{"triggerEvent":"BOOKING_CREATED","createdAt":"2026-01-01T00:00:00.000Z","payload":{"uid":"abc123"}}';
	const sig = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

	const payload: CalWebhookPayload = {
		triggerEvent: 'BOOKING_CREATED',
		createdAt: '2026-01-01T00:00:00.000Z',
		payload: { uid: 'abc123' },
	};

	const baseRequest = (): WebhookRequest<CalWebhookPayload> => ({
		rawBody,
		headers: { 'x-cal-signature-256': sig },
		payload,
	});

	it('returns invalid when secret is missing', () => {
		const result = verifyCalWebhookSignature(baseRequest(), undefined);
		expect(result).toEqual({
			valid: false,
			error: 'No secret provided',
		});
	});

	it('returns invalid when secret is empty', () => {
		const result = verifyCalWebhookSignature(baseRequest(), '');
		expect(result).toEqual({
			valid: false,
			error: 'No secret provided',
		});
	});

	it('returns invalid when raw body is missing', () => {
		const request = { ...baseRequest(), rawBody: undefined };
		const result = verifyCalWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('returns invalid when x-cal-signature-256 header is missing', () => {
		const request = { ...baseRequest(), headers: {} };
		const result = verifyCalWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-cal-signature-256 header',
		});
	});

	it('returns invalid when x-cal-signature-256 is an empty array', () => {
		const request: WebhookRequest<CalWebhookPayload> = {
			...baseRequest(),
			headers: { 'x-cal-signature-256': [] },
		};
		const result = verifyCalWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-cal-signature-256 header',
		});
	});

	it('accepts x-cal-signature-256 as an array header', () => {
		const request: WebhookRequest<CalWebhookPayload> = {
			...baseRequest(),
			headers: { 'x-cal-signature-256': [sig] },
		};
		const result = verifyCalWebhookSignature(request, secret);
		expect(result).toEqual({ valid: true });
	});

	it('returns invalid when the signature does not match', () => {
		const request: WebhookRequest<CalWebhookPayload> = {
			...baseRequest(),
			headers: { 'x-cal-signature-256': 'deadbeef' },
		};
		const result = verifyCalWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('returns valid when the HMAC-SHA256 signature matches', () => {
		const result = verifyCalWebhookSignature(baseRequest(), secret);
		expect(result).toEqual({ valid: true });
	});
});
