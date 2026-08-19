import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { verifyPostHogWebhookSignature } from './types';

describe('verifyPostHogWebhookSignature', () => {
	const secret = 'my-super-secret-token';

	const requestWith = (
		headers: Record<string, string | string[]>,
		rawBody = JSON.stringify({ event: 'event.captured', distinct_id: 'x' }),
	): WebhookRequest<unknown> => ({
		payload: {},
		headers,
		rawBody,
	});

	it('should fail closed when webhook secret is missing', () => {
		const result = verifyPostHogWebhookSignature(requestWith({}), '');
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should return invalid when the signature header is missing', () => {
		const result = verifyPostHogWebhookSignature(requestWith({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-posthog-signature or x-signature header',
		});
	});

	it('should return valid for a matching signature', () => {
		const rawBody = JSON.stringify({
			event: 'event.captured',
			distinct_id: 'x',
		});
		const signature = `sha256=${createHmac(secret, rawBody)}`;
		const result = verifyPostHogWebhookSignature(
			requestWith({ 'x-posthog-signature': signature }, rawBody),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should return invalid for a wrong signature', () => {
		const result = verifyPostHogWebhookSignature(
			requestWith({ 'x-posthog-signature': 'sha256=deadbeef' }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});
});

function createHmac(secret: string, body: string): string {
	return crypto.createHmac('sha256', secret).update(body).digest('hex');
}
