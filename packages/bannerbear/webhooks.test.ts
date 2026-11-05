import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import * as crypto from 'crypto';
import type { BannerbearContext } from './index';
import { bannerbear } from './index';
import {
	createBannerbearAnimationCompletedMatch,
	createBannerbearImageCompletedMatch,
	verifyBannerbearWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue('mock-event-id'),
	};
});

const mockCtx = {
	key: 'bb_test_api_key_123',
	$getAccountId: () => 'test-account-id',
	options: {},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('bb_test_api_key_123'),
	},
	logEvent: jest.fn(),
	database: {},
} as unknown as BannerbearContext;

describe('Bannerbear webhooks verification and handlers', () => {
	const plugin = bannerbear();
	const webhooks = plugin.webhooks!;
	const secret = 'webhook_secret_key_xyz';

	function createSignedWebhookRequest(
		payloadObj: Record<string, unknown>,
		signingSecret = secret,
	): WebhookRequest<Record<string, unknown>> {
		const rawBody = JSON.stringify(payloadObj);
		const signature = crypto
			.createHmac('sha256', signingSecret)
			.update(rawBody)
			.digest('hex');

		return {
			rawBody,
			payload: payloadObj,
			headers: {
				'x-bannerbear-signature': signature,
			},
		};
	}

	it('verifies valid HMAC signature successfully', () => {
		const request = createSignedWebhookRequest({
			uid: 'img_123',
			status: 'completed',
		});
		const result = verifyBannerbearWebhookSignature(request, secret);
		expect(result.valid).toBe(true);
	});

	it('verifies valid Authorization Bearer webhook key successfully', () => {
		const request: WebhookRequest<Record<string, unknown>> = {
			rawBody: JSON.stringify({ uid: 'img_123', status: 'completed' }),
			payload: { uid: 'img_123', status: 'completed' },
			headers: {
				authorization: `Bearer ${secret}`,
			},
		};
		const result = verifyBannerbearWebhookSignature(request, secret);
		expect(result.valid).toBe(true);
	});

	it('accepts hubVerified requests even without secret', () => {
		const request: WebhookRequest<Record<string, unknown>> = {
			rawBody: JSON.stringify({ uid: 'img_123' }),
			payload: { uid: 'img_123' },
			headers: {},
			hubVerified: true,
		};
		const result = verifyBannerbearWebhookSignature(request, undefined);
		expect(result.valid).toBe(true);
	});

	it('rejects invalid signature', () => {
		const request = createSignedWebhookRequest({
			uid: 'img_123',
			status: 'completed',
		});
		const result = verifyBannerbearWebhookSignature(request, 'wrong_secret');
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook credentials or signature');
	});

	it('rejects request when webhook secret is missing', () => {
		const request = createSignedWebhookRequest({
			uid: 'img_123',
			status: 'completed',
		});
		const result = verifyBannerbearWebhookSignature(request, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Missing webhook secret');
	});

	it('rejects request without signature or authorization header', () => {
		const request: WebhookRequest<Record<string, unknown>> = {
			rawBody: JSON.stringify({ uid: 'img_123' }),
			payload: { uid: 'img_123' },
			headers: {},
		};
		const result = verifyBannerbearWebhookSignature(request, secret);
		expect(result.valid).toBe(false);
		expect(result.error).toBe(
			'Missing Authorization or webhook signature header',
		);
	});

	it('processes imageCompleted webhook handler with valid signature', async () => {
		const webhookCtx = { ...mockCtx, key: secret };
		const payload = {
			uid: 'img_123',
			status: 'completed' as const,
			files: { png: 'https://cdn.bannerbear.com/sample.png' },
		};
		const req = createSignedWebhookRequest(payload) as unknown as Parameters<
			typeof webhooks.image.imageCompleted.handler
		>[1];

		const res = await webhooks.image.imageCompleted.handler(webhookCtx, req);
		expect(res.success).toBe(true);
		expect(res.data).toEqual(payload);
	});

	it('rejects imageCompleted handler when signature verification fails', async () => {
		const webhookCtx = { ...mockCtx, key: secret };
		const payload = {
			uid: 'img_123',
			status: 'completed' as const,
			files: { png: 'https://cdn.bannerbear.com/sample.png' },
		};
		const req = createSignedWebhookRequest(
			payload,
			'wrong_secret',
		) as unknown as Parameters<typeof webhooks.image.imageCompleted.handler>[1];

		const res = await webhooks.image.imageCompleted.handler(webhookCtx, req);
		expect(res.success).toBe(false);
		expect(res.statusCode).toBe(401);
	});

	it('processes animationCompleted webhook handler with valid signature', async () => {
		const webhookCtx = { ...mockCtx, key: secret };
		const payload = {
			uid: 'an_123',
			status: 'completed' as const,
			files: { mp4: 'https://cdn.bannerbear.com/sample.mp4' },
		};
		const req = createSignedWebhookRequest(payload) as unknown as Parameters<
			typeof webhooks.animation.animationCompleted.handler
		>[1];

		const res = await webhooks.animation.animationCompleted.handler(
			webhookCtx,
			req,
		);
		expect(res.success).toBe(true);
		expect(res.data).toEqual(payload);
	});

	it('matches image completed webhook payloads', () => {
		const matcher = createBannerbearImageCompletedMatch();

		const validImagePayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'img_123',
				status: 'completed',
				files: { png: 'https://cdn.bannerbear.com/sample.png' },
			}),
		};

		const pendingPayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'img_123',
				status: 'pending',
				files: null,
			}),
		};

		const animationPayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'an_123',
				status: 'completed',
				files: { mp4: 'https://cdn.bannerbear.com/sample.mp4' },
			}),
		};

		expect(matcher(validImagePayload)).toBe(true);
		expect(matcher(pendingPayload)).toBe(false);
		expect(matcher(animationPayload)).toBe(false);
	});

	it('matches animation completed webhook payloads', () => {
		const matcher = createBannerbearAnimationCompletedMatch();

		const validAnimationPayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'an_123',
				status: 'completed',
				files: { mp4: 'https://cdn.bannerbear.com/sample.mp4' },
			}),
		};

		const imagePayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'img_123',
				status: 'completed',
				files: { png: 'https://cdn.bannerbear.com/sample.png' },
			}),
		};

		expect(matcher(validAnimationPayload)).toBe(true);
		expect(matcher(imagePayload)).toBe(false);
	});

	it('does not treat a generic uid/status body as Bannerbear', () => {
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: JSON.stringify({ uid: 'other_1', status: 'completed' }),
			}),
		).toBe(false);
	});
});
