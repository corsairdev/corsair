import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';

import type { ResendWebhookPayload } from './types';
import { verifyResendWebhookSignature } from './types';

const TIMESTAMP = Math.floor(Date.now() / 1000);
const RECENT_TIMESTAMP = String(TIMESTAMP);

const secret =
	'whsec_' +
	Buffer.from('test_secret_for_mock_webhook_verification').toString('base64');
const payload: ResendWebhookPayload = {
	type: 'email.sent',
	created_at: '2026-01-01T00:00:00.000Z',
	data: {
		email_id: 'email_123',
		created_at: '2026-01-01T00:00:00.000Z',
	},
};
const rawBody = JSON.stringify(payload);

const requestWith = (
	headers: Record<string, string | string[] | undefined>,
	body: string | null = rawBody,
): WebhookRequest<ResendWebhookPayload> => ({
	payload,
	headers,
	rawBody: body === null ? undefined : body,
});

describe('verifyResendWebhookSignature', () => {
	it('returns error when webhookSecret is empty string', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': signSvix(secret) }),
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when webhookSecret is undefined', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': signSvix(secret) }),
			undefined,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when raw body is missing', () => {
		const result = verifyResendWebhookSignature(
			requestWith({ 'svix-signature': signSvix(secret) }, null),
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
			error: 'Missing svix-id, svix-timestamp, or svix-signature header',
		});
	});

	it('returns valid for a correctly signed request using svix-signature', () => {
		const result = verifyResendWebhookSignature(
			requestWith({
				'svix-id': 'test-id',
				'svix-timestamp': RECENT_TIMESTAMP,
				'svix-signature': signSvix(secret),
			}),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('returns invalid for a signature that does not match', () => {
		const result = verifyResendWebhookSignature(
			requestWith({
				'svix-id': 'test-id',
				'svix-timestamp': RECENT_TIMESTAMP,
				'svix-signature': signSvix('whsec_YW5vdGhlci1zZWNyZXQ='),
			}),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});
});

function signSvix(key: string): string {
	const secretMaterial = key.startsWith('whsec_')
		? key.slice('whsec_'.length)
		: key;
	const signingKey = Buffer.from(secretMaterial, 'base64');
	const signedContent = `test-id.${RECENT_TIMESTAMP}.${rawBody}`;
	const hmac = crypto
		.createHmac('sha256', signingKey)
		.update(signedContent)
		.digest('base64');
	return `v1,${hmac}`;
}
