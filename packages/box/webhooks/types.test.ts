import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import type { BoxWebhookPayload } from './types';
import { verifyBoxWebhookSignature } from './types';

describe('Tests for verifyBoxWebhookSignature', () => {
	const secret = 'my-secret';
	const payload: BoxWebhookPayload = {
		type: 'webhook_event',
		id: 'unq-id',
		created_at: 'date',
		trigger: 'trigger',
		webhook: {
			id: 'webhook-id',
			type: 'webhook',
		},
		created_by: {
			id: 'created-by-id',
			login: 'login',
			name: 'alex',
			type: 'random',
		},
		source: {},
		additional_info: {},
	};

	const requestWith = (
		headers: Record<string, string | string[]>,
	): WebhookRequest<BoxWebhookPayload> => ({
		payload,
		headers,
		rawBody: JSON.stringify(payload),
	});

	it('should fail closed when secret is missing', () => {
		const result = verifyBoxWebhookSignature(
			requestWith({
				'box-signature-primary': 'valid-signature',
				'box-delivery-timestamp': new Date().toISOString(),
			}),
			'',
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should fail closed when box-signature-primary header is missing', () => {
		const result = verifyBoxWebhookSignature(
			requestWith({
				'box-delivery-timestamp': new Date().toISOString(),
			}),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing box-signature-primary header',
		});
	});

	it('should return invalid when box-signature-primary is invalid', () => {
		const timestamp = new Date().toISOString();
		const rawBody = JSON.stringify(payload);

		const wrongSignature = crypto
			.createHmac('sha256', 'wrong-secret')
			.update(timestamp + rawBody)
			.digest('base64');

		const result = verifyBoxWebhookSignature(
			requestWith({
				'box-signature-primary': wrongSignature,
				'box-delivery-timestamp': timestamp,
			}),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return valid when box-signature-primary is correctly computed', () => {
		const timestamp = new Date().toISOString();
		const rawBody = JSON.stringify(payload);
		const signature = crypto
			.createHmac('sha256', secret)
			.update(timestamp + rawBody)
			.digest('base64');

		const result = verifyBoxWebhookSignature(
			requestWith({
				'box-signature-primary': signature,
				'box-delivery-timestamp': timestamp,
			}),
			secret,
		);

		expect(result).toEqual({
			valid: true,
			error: undefined,
		});
	});
});
