import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import type { SpotifyWebhookPayload } from './types';
import { verifySpotifyWebhookSignature } from './types';

describe('verifySpotifyWebhookSignature', () => {
	const secret = 'my-super-secret-key';
	const payload: SpotifyWebhookPayload = {
		type: 'example',
		created_at: '2026-05-22T00:00:00Z',
		data: { id: '123' },
	};
	const rawBody = JSON.stringify(payload);

	it('should fail closed when secret is missing', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-spotify-signature': 'some-signature',
			},
			rawBody,
		};
		const result = verifySpotifyWebhookSignature(request, '');
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should return invalid if signature header is missing', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {},
			rawBody,
		};
		const result = verifySpotifyWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing signature header',
		});
	});

	it('should return invalid if signature does not match', () => {
		// Same length as a real hex-encoded HMAC-SHA256 digest so that
		// timingSafeEqual can compare it (rather than throw) and the
		// comparison itself fails.
		const wrongSignature = crypto
			.createHmac('sha256', 'a-different-secret')
			.update(rawBody)
			.digest('hex');

		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-spotify-signature': wrongSignature,
			},
			rawBody,
		};
		const result = verifySpotifyWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return valid for a correct signature round-trip', () => {
		const correctSignature = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');

		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-spotify-signature': correctSignature,
			},
			rawBody,
		};
		const result = verifySpotifyWebhookSignature(request, secret);
		expect(result).toEqual({ valid: true, error: undefined });
	});
});
