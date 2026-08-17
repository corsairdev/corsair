import crypto from 'crypto';
import type { FirefliesWebhookPayload } from './types';
import { verifyFirefliesWebhookSignature } from './types';

// Regression for #710: verifyFirefliesWebhookSignature used `secret` directly in
// crypto.createHmac without guarding against an empty/missing secret. An empty
// secret must be rejected rather than used to derive an HMAC key.

const payload = {
	meetingId: 'meeting-1',
	eventType: 'Transcription completed',
} as unknown as FirefliesWebhookPayload;

const rawBody = JSON.stringify(payload);

function sign(body: string, secret: string): string {
	return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

describe('verifyFirefliesWebhookSignature', () => {
	it('returns an error when the secret is an empty string', () => {
		const result = verifyFirefliesWebhookSignature(
			{
				rawBody,
				payload,
				headers: { 'x-fireflies-signature': sign(rawBody, '') },
			},
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('returns an error when the secret is missing (undefined)', () => {
		const result = verifyFirefliesWebhookSignature(
			{
				rawBody,
				payload,
				headers: { 'x-fireflies-signature': 'anything' },
			},
			undefined as unknown as string,
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('accepts a correct signature made with a real secret', () => {
		const secret = 'super-secret-value';
		const result = verifyFirefliesWebhookSignature(
			{
				rawBody,
				payload,
				headers: { 'x-fireflies-signature': sign(rawBody, secret) },
			},
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('rejects an incorrect signature made with a real secret', () => {
		const result = verifyFirefliesWebhookSignature(
			{
				rawBody,
				payload,
				headers: { 'x-fireflies-signature': sign(rawBody, 'wrong-secret') },
			},
			'super-secret-value',
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid signature');
	});
});
