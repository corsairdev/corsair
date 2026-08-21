import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';

import type { ResendWebhookPayload } from './types';
import { verifyResendWebhookSignature } from './types';

describe('verifyResendWebhookSignature', () => {
	const secret = 'whsec_testsecret123';
	const payload: ResendWebhookPayload = {
		type: 'email.sent',
		created_at: '2026-01-01T00:00:00.000Z',
		data: {
			email_id: 'email_123',
			created_at: '2026-01-01T00:00:00.000Z',
		},
	};
	const rawBody = JSON.stringify(payload);

	const sign = (key: string, body: string = rawBody) =>
		`sha256=${crypto.createHmac('sha256', key).update(body).digest('hex')}`;

	const requestWith = (
		headers: Record<string, string | string[] | undefined>,
		body: string | null = rawBody,
	): WebhookRequest<ResendWebhookPayload> => ({
		payload,
		headers,
		rawBody: body === null ? undefined : body,
	});

	it('returns error when webhookSecret is empty string', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': sign(secret) }),
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when webhookSecret is undefined', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': sign(secret) }),
			undefined,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when rawBody is missing', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': sign(secret) }, null),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('returns error when signature header is missing', () => {
		const result = verifyResendWebhookSignature(requestWith({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing svix-signature or x-resend-signature header',
		});
	});

	it('returns valid for a correctly signed request using svix-signature', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': sign(secret) }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('returns valid for a correctly signed request using x-resend-signature', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'x-resend-signature': sign(secret) }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('accepts signature header when provided as an array', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': [sign(secret)] }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('returns invalid for a signature that does not match', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': sign('a-different-secret') }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});
});
