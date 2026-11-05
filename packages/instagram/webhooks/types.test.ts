import { createHmac } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { verifyInstagramWebhookSignature } from './types';

describe('verifyInstagramWebhookSignature', () => {
	const validRequest: WebhookRequest = {
		payload: { object: 'instagram', entry: [] },
		headers: { 'x-hub-signature-256': 'sha256=dummy_sig' },
		rawBody: JSON.stringify({ object: 'instagram', entry: [] }),
	};

	it('should return error when appSecret is an empty string', () => {
		const result = verifyInstagramWebhookSignature(validRequest, '');
		expect(result).toEqual({
			valid: false,
			error: 'Missing app secret',
		});
	});

	it('should return error when appSecret is null', () => {
		const result = verifyInstagramWebhookSignature(validRequest, null);
		expect(result).toEqual({
			valid: false,
			error: 'Missing app secret',
		});
	});

	it('should return error when rawBody is missing', () => {
		const requestWithoutBody: WebhookRequest = {
			...validRequest,
			rawBody: '',
		};
		const result = verifyInstagramWebhookSignature(
			requestWithoutBody,
			'secret',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('should return error when x-hub-signature-256 header is missing', () => {
		const requestWithoutHeader: WebhookRequest = {
			payload: { object: 'instagram', entry: [] },
			headers: {},
			rawBody: JSON.stringify({ object: 'instagram', entry: [] }),
		};
		const result = verifyInstagramWebhookSignature(
			requestWithoutHeader,
			'secret',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hub-signature-256 header',
		});
	});

	it('should return error when signature is invalid', () => {
		const result = verifyInstagramWebhookSignature(validRequest, 'secret');
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should accept a matching sha256 signature', () => {
		const rawBody = '{"ok":true}';
		const secret = 'secret';
		const digest = createHmac('sha256', secret).update(rawBody).digest('hex');
		const request: WebhookRequest = {
			payload: { ok: true },
			headers: { 'x-hub-signature-256': `sha256=${digest}` },
			rawBody,
		};
		expect(verifyInstagramWebhookSignature(request, secret)).toEqual({
			valid: true,
		});
	});
});
