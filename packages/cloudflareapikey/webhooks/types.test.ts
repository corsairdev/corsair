import { createHmac } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { verifyCloudflareApiKeyWebhookSignature } from './types';
import type { ExampleEvent } from './types';

const SECRET = 'test-webhook-secret';
const BODY = JSON.stringify({
	type: 'example',
	created_at: '2026-09-04T00:00:00.000Z',
	data: { id: 'event-1' },
});

function request(signature?: string): WebhookRequest<ExampleEvent> {
	return {
		payload: JSON.parse(BODY) as ExampleEvent,
		rawBody: BODY,
		headers: signature ? { 'webhook-signature': signature } : {},
	};
}

function sign(body: string, secret = SECRET): string {
	return createHmac('sha256', secret).update(body).digest('hex');
}

describe('verifyCloudflareApiKeyWebhookSignature', () => {
	it('accepts a valid signature', () => {
		expect(verifyCloudflareApiKeyWebhookSignature(request(sign(BODY)), SECRET)).toEqual({
			valid: true,
		});
	});

	it('rejects a missing signature', () => {
		expect(verifyCloudflareApiKeyWebhookSignature(request(), SECRET)).toEqual({
			valid: false,
			error: 'Missing webhook signature header',
		});
	});

	it('rejects a signature made with another secret', () => {
		expect(
			verifyCloudflareApiKeyWebhookSignature(request(sign(BODY, 'wrong-secret')), SECRET),
		).toEqual({ valid: false, error: 'Invalid webhook signature' });
	});

	it('rejects a modified body', () => {
		const signed = request(sign(BODY));
		signed.rawBody = `${BODY} `;
		expect(verifyCloudflareApiKeyWebhookSignature(signed, SECRET)).toEqual({
			valid: false,
			error: 'Invalid webhook signature',
		});
	});
});
