import type { WebhookRequest } from 'corsair/core';
import { verifyZoomWebhookSignature } from './types';

describe('verifyZoomWebhookSignature', () => {
	it('returns a structured error when the signing secret is missing', () => {
		const request: WebhookRequest<unknown> = {
			payload: {},
			headers: {},
			rawBody: '',
		};

		const result = verifyZoomWebhookSignature(request, undefined);

		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook signing secret configuration',
		});
	});
});
