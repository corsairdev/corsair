import { createHmac } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import {
	EventPayloadSchema,
	XquikEndpointInputSchemas,
	XquikEndpointOutputSchemas,
} from './endpoints/types';
import type { XquikWebhookPayload } from './webhooks/types';
import {
	createXquikMonitorEventMatch,
	verifyXquikWebhookSignature,
} from './webhooks/types';

function signWebhook(
	rawBody: string,
	secret: string,
): WebhookRequest<XquikWebhookPayload> {
	const timestamp = String(Date.now());
	const nonce = '0123456789abcdef0123456789abcdef';
	const signature =
		'sha256=' +
		createHmac('sha256', secret)
			.update(`${timestamp}.${nonce}.${rawBody}`)
			.digest('hex');

	return {
		headers: {
			'x-xquik-nonce': nonce,
			'x-xquik-signature': signature,
			'x-xquik-timestamp': timestamp,
		},
		payload: EventPayloadSchema.parse(JSON.parse(rawBody)),
		rawBody,
	};
}

describe('Xquik plugin schemas', () => {
	it('validates a useful tweet search request', () => {
		const parsed = XquikEndpointInputSchemas.tweetsSearch.parse({
			limit: 50,
			mediaType: 'images',
			minFaves: 10,
			q: 'from:xquikcom since:2026-01-01',
			queryType: 'Latest',
		});

		expect(parsed.q).toContain('from:xquikcom');
		expect(parsed.limit).toBe(50);
	});

	it('validates Xquik paginated tweet responses', () => {
		const parsed = XquikEndpointOutputSchemas.tweetsSearch.parse({
			has_next_page: false,
			next_cursor: '',
			tweets: [
				{
					author: {
						id: '42',
						name: 'Xquik',
						username: 'xquikcom',
					},
					id: '123',
					text: 'Hello from Xquik',
				},
			],
		});

		expect(parsed.tweets[0]?.id).toBe('123');
	});
});

describe('Xquik webhook helpers', () => {
	it('matches signed monitor event payloads', () => {
		const body = {
			data: { tweetId: '123' },
			eventType: 'tweet.new',
			occurredAt: '2026-05-17T12:00:00.000Z',
			streamEventId: '456',
		};

		const matches = createXquikMonitorEventMatch()({
			body,
			headers: { 'x-xquik-signature': 'sha256=test' },
		});

		expect(matches).toBe(true);
	});

	it('verifies Xquik HMAC webhook signatures', () => {
		const secret = 'test-secret';
		const rawBody = JSON.stringify({
			data: { tweetId: '123' },
			eventType: 'tweet.new',
			occurredAt: '2026-05-17T12:00:00.000Z',
			streamEventId: '456',
		});

		const request = signWebhook(rawBody, secret);
		const result = verifyXquikWebhookSignature(request, secret);

		expect(result.valid).toBe(true);
	});

	it('rejects webhook signatures when the secret is missing', () => {
		const rawBody = JSON.stringify({
			data: { tweetId: '123' },
			eventType: 'tweet.new',
			occurredAt: '2026-05-17T12:00:00.000Z',
			streamEventId: '456',
		});

		const request = signWebhook(rawBody, 'test-secret');
		const result = verifyXquikWebhookSignature(request, '');

		expect(result).toEqual({
			error: 'Missing Xquik webhook secret',
			valid: false,
		});
	});
});
