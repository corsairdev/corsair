import crypto from 'crypto';
import type { FirefliesWebhookPayload } from './types';
import {
	hasFirefliesWebhookSignatureHeader,
	verifyFirefliesWebhookSignature,
} from './types';

const payload = {
	meetingId: 'meeting-1',
	eventType: 'Transcription completed',
} as unknown as FirefliesWebhookPayload;

const rawBody = JSON.stringify(payload);
const secret = 'super-secret-value';

function hexDigest(body: string, key: string): string {
	return crypto.createHmac('sha256', key).update(body).digest('hex');
}

function signedRequest(
	headers: Record<string, string | string[] | undefined>,
	body: string | undefined = rawBody,
) {
	return {
		rawBody: body,
		payload,
		headers,
	};
}

describe('verifyFirefliesWebhookSignature', () => {
	it('returns an error when the secret is an empty string', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({
				'x-hub-signature': `sha256=${hexDigest(rawBody, '')}`,
			}),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('returns an error when the secret is missing (undefined)', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({ 'x-hub-signature': 'sha256=anything' }),
			undefined as unknown as string,
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('returns an error when the secret is only whitespace', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({ 'x-hub-signature': 'sha256=anything' }),
			'   ',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('returns an error when the signature header is missing', () => {
		const result = verifyFirefliesWebhookSignature(signedRequest({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hub-signature header',
		});
	});

	it('returns an error when rawBody is missing', () => {
		const result = verifyFirefliesWebhookSignature(
			{
				payload,
				headers: {
					'x-hub-signature': `sha256=${hexDigest(rawBody, secret)}`,
				},
			},
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('accepts a correct sha256= signature on x-hub-signature', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({
				'x-hub-signature': `sha256=${hexDigest(rawBody, secret)}`,
			}),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('accepts a correct raw hex signature on x-fireflies-signature', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({
				'x-fireflies-signature': hexDigest(rawBody, secret),
			}),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('accepts the signature header when provided as an array', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({
				'x-hub-signature': [`sha256=${hexDigest(rawBody, secret)}`],
			}),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('rejects an incorrect signature made with a real secret', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({
				'x-hub-signature': `sha256=${hexDigest(rawBody, 'wrong-secret')}`,
			}),
			secret,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid signature' });
	});

	it('rejects a length-mismatched signature as invalid', () => {
		const result = verifyFirefliesWebhookSignature(
			signedRequest({ 'x-hub-signature': 'sha256=too-short' }),
			secret,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid signature' });
	});
});

describe('hasFirefliesWebhookSignatureHeader', () => {
	it('matches x-hub-signature', () => {
		expect(
			hasFirefliesWebhookSignatureHeader({ 'x-hub-signature': 'sha256=abc' }),
		).toBe(true);
	});

	it('matches x-fireflies-signature', () => {
		expect(
			hasFirefliesWebhookSignatureHeader({ 'x-fireflies-signature': 'abc' }),
		).toBe(true);
	});

	it('does not match requests without a signature header', () => {
		expect(hasFirefliesWebhookSignatureHeader({})).toBe(false);
	});
});
