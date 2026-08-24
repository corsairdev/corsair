import type { WebhookRequest } from 'corsair/core';
import { verifyGithubWebhookSignature } from './webhooks/types';

describe('verifyGithubWebhookSignature', () => {
	it('returns valid when the delivery is hub-verified, even with no secret', () => {
		const request: WebhookRequest = {
			payload: {},
			headers: {},
			rawBody: '{}',
			hubVerified: true,
		};
		expect(verifyGithubWebhookSignature(request, undefined)).toEqual({
			valid: true,
		});
	});

	it('still fails a non-hub-verified request with no secret', () => {
		const request: WebhookRequest = { payload: {}, headers: {}, rawBody: '{}' };
		expect(verifyGithubWebhookSignature(request, undefined)).toEqual({
			valid: false,
		});
	});
});
