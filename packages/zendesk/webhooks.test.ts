import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import type { ZendeskWebhookPayload } from './webhooks/types';
import { verifyZendeskWebhookSignature } from './webhooks/types';

describe('verifyZendeskWebhookSignature', () => {
	const secret = 'my-super-secret-key';
	const payload: ZendeskWebhookPayload = {
		type: 'example',
		created_at: '2026-05-22T00:00:00Z',
		data: { id: '123' },
	};
	const rawBody = JSON.stringify(payload);

	it('should return invalid if secret is missing', () => {
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook signing secret configuration',
		});
	});

	it('should return invalid if rawBody is missing', () => {
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {},
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('should return invalid if signature header is missing', () => {
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {
				'x-zendesk-webhook-signature-timestamp': new Date().toISOString(),
			},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-zendesk-webhook-signature header',
		});
	});

	it('should return invalid if timestamp header is missing', () => {
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {
				'x-zendesk-webhook-signature': 'some-signature',
			},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-zendesk-webhook-signature-timestamp header',
		});
	});

	it('should return invalid if timestamp format is invalid', () => {
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {
				'x-zendesk-webhook-signature': 'some-signature',
				'x-zendesk-webhook-signature-timestamp': 'not-a-date',
			},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid x-zendesk-webhook-signature-timestamp header format',
		});
	});

	it('should return invalid if timestamp is stale (too old)', () => {
		const oldTimestamp = new Date(Date.now() - 301 * 1000).toISOString(); // 5 min 1 sec ago
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {
				'x-zendesk-webhook-signature': 'some-signature',
				'x-zendesk-webhook-signature-timestamp': oldTimestamp,
			},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Webhook request timestamp is stale (outside 5-minute window)',
		});
	});

	it('should return invalid if timestamp is stale (in the future)', () => {
		const futureTimestamp = new Date(Date.now() + 301 * 1000).toISOString(); // 5 min 1 sec in future
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {
				'x-zendesk-webhook-signature': 'some-signature',
				'x-zendesk-webhook-signature-timestamp': futureTimestamp,
			},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Webhook request timestamp is stale (outside 5-minute window)',
		});
	});

	it('should return invalid if signature mismatch', () => {
		const timestamp = new Date().toISOString();
		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {
				'x-zendesk-webhook-signature': 'wrong-signature',
				'x-zendesk-webhook-signature-timestamp': timestamp,
			},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return valid if signature is correct and fresh', () => {
		const timestamp = new Date().toISOString();
		const signingString = timestamp + rawBody;
		const correctSignature = crypto
			.createHmac('sha256', secret)
			.update(signingString)
			.digest('base64');

		const request: WebhookRequest<ZendeskWebhookPayload> = {
			payload,
			headers: {
				'x-zendesk-webhook-signature': correctSignature,
				'x-zendesk-webhook-signature-timestamp': timestamp,
			},
			rawBody,
		};
		const result = verifyZendeskWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: true,
		});
	});
});
