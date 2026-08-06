import type { WebhookRequest } from 'corsair/core';
import { verifySlackWebhookSignature } from './webhooks/types';

describe('verifySlackWebhookSignature', () => {
	const request: WebhookRequest = {
		payload: {},
		headers: {},
		rawBody: '{}',
	};

	it.each([undefined, ''] as const)(
		'returns Missing webhook secret when signing secret is %p',
		(signingSecret) => {
			expect(verifySlackWebhookSignature(request, signingSecret)).toEqual({
				valid: false,
				error: 'Missing webhook secret',
			});
		},
	);

	it('still reports missing headers when a secret is configured', () => {
		expect(
			verifySlackWebhookSignature(request, 'slack-signing-secret'),
		).toEqual({
			valid: false,
			error: 'Missing x-slack-signature or x-slack-request-timestamp header',
		});
	});
});
