import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import type { JiraWebhookPayload } from './types';
import { verifyJiraWebhookSignature } from './types';

describe('verifyJiraWebhookSignature', () => {
	const secret = 'my-super-secret-key';
	const payload: JiraWebhookPayload = {
		webhookEvent: 'jira:issue_created',
		timestamp: 1747872000000,
	};
	const rawBody = JSON.stringify(payload);

	const sign = (key: string): string =>
		`sha256=${crypto.createHmac('sha256', key).update(rawBody).digest('hex')}`;

	it('should fail closed when secret is missing', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-hub-signature': sign(secret),
			},
			rawBody,
		};
		const result = verifyJiraWebhookSignature(request, '');
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should fail closed when both secret and signature header are missing', () => {
		// The regression: omitting the signature header used to return
		// { valid: true } whenever no secret was configured, so an attacker
		// could bypass verification entirely by simply not sending a signature.
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {},
			rawBody,
		};
		const result = verifyJiraWebhookSignature(request, '');
		expect(result.valid).toBe(false);
	});

	it('should return invalid if signature header is missing', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {},
			rawBody,
		};
		const result = verifyJiraWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hub-signature header',
		});
	});

	it('should return invalid if signature does not match', () => {
		// Signed with a different key, so it has the same length as a real
		// signature and timingSafeEqual compares it rather than throwing.
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-hub-signature': sign('a-different-secret'),
			},
			rawBody,
		};
		const result = verifyJiraWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return invalid if the signature length does not match', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-hub-signature': 'sha256=too-short',
			},
			rawBody,
		};
		const result = verifyJiraWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Signature length mismatch',
		});
	});

	it('should return valid for a correct signature round-trip', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-hub-signature': sign(secret),
			},
			rawBody,
		};
		const result = verifyJiraWebhookSignature(request, secret);
		expect(result).toEqual({ valid: true, error: undefined });
	});

	it('should accept the signature header when provided as an array', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			headers: {
				'x-hub-signature': [sign(secret)],
			},
			rawBody,
		};
		const result = verifyJiraWebhookSignature(request, secret);
		expect(result.valid).toBe(true);
	});
});
