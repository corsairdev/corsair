import { createHmac } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { coinbase } from './index';
import { newPayment } from './webhooks/new-payment';
import {
	coinbaseSignatureHeader,
	verifyCoinbaseWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		...actual,
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockLogEvent = logEventFromContext as jest.Mock;

const webhookCtx = {
	key: 'webhook-secret',
	$getAccountId: async () => 'test-account-id',
	database: undefined,
	endpoints: {},
} as never;

describe('Coinbase keyBuilder auth policy', () => {
	it('throws AuthMissingError when api_key is required but missing', async () => {
		const plugin = coinbase({ authType: 'api_key', requireApiKey: true });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('allows unauthenticated plugin defaults for public market data', async () => {
		const plugin = coinbase();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				} as never,
				'endpoint',
			),
		).resolves.toBe('');
	});
});

describe('Coinbase webhook signature verification', () => {
	it('verifies the documented CDP X-Hook0-Signature v0 scheme', () => {
		const secret = 'webhook-secret';
		const rawBody = JSON.stringify({ type: 'ping', id: 'n-1' });
		const timestamp = String(Math.floor(Date.now() / 1000) - 30);
		const signature = createHmac('sha256', secret)
			.update(`${timestamp}.${rawBody}`)
			.digest('hex');
		const result = verifyCoinbaseWebhookSignature(
			{
				payload: { type: 'ping' },
				headers: {
					'x-hook0-signature': `t=${timestamp},v0=${signature}`,
				},
				rawBody,
			},
			secret,
		);
		expect(result.valid).toBe(true);
	});

	it('rejects a stale hook0 timestamp', () => {
		const secret = 'webhook-secret';
		const rawBody = JSON.stringify({ type: 'ping' });
		const timestamp = String(Math.floor(Date.now() / 1000) - 60 * 60);
		const signature = createHmac('sha256', secret)
			.update(`${timestamp}.${rawBody}`)
			.digest('hex');
		const result = verifyCoinbaseWebhookSignature(
			{
				payload: { type: 'ping' },
				headers: {
					'x-hook0-signature': `t=${timestamp},v0=${signature}`,
				},
				rawBody,
			},
			secret,
		);
		expect(result.valid).toBe(false);
	});

	it('still accepts Commerce X-CC-Webhook-Signature plain HMAC', () => {
		const secret = 'webhook-secret';
		const rawBody = JSON.stringify({ type: 'ping' });
		const signature = createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');
		const result = verifyCoinbaseWebhookSignature(
			{
				payload: { type: 'ping' },
				headers: { 'x-cc-webhook-signature': signature },
				rawBody,
			},
			secret,
		);
		expect(result.valid).toBe(true);
	});

	it('detects the documented signature headers', () => {
		expect(coinbaseSignatureHeader({ 'x-hook0-signature': 't=1,v0=abc' })).toBe(
			't=1,v0=abc',
		);
		expect(coinbaseSignatureHeader({ 'x-cc-webhook-signature': 'def' })).toBe(
			'def',
		);
	});

	it('rejects when only the undocumented cb-signature header is present', () => {
		const result = verifyCoinbaseWebhookSignature(
			{
				payload: { type: 'ping' },
				headers: { 'cb-signature': 'deadbeef' },
				rawBody: '{"type":"ping"}',
			},
			'webhook-secret',
		);
		expect(result.valid).toBe(false);
	});
});

describe('Coinbase webhook event logging', () => {
	beforeEach(() => {
		mockLogEvent.mockReset();
	});

	it('logs only identifiers, not payment details', async () => {
		const rawBody = JSON.stringify({
			type: 'wallet:addresses:new-payment',
			id: 'notif-1',
			user: { id: 'user-1' },
			data: {
				amount: '0.5',
				address: '0xabc123def456',
				hash: '0xtxhash789',
			},
		});
		const signature = createHmac('sha256', 'webhook-secret')
			.update(`${String(Math.floor(Date.now() / 1000) - 30)}.${rawBody}`)
			.digest('hex');

		await newPayment.handler(webhookCtx, {
			payload: JSON.parse(rawBody),
			headers: {
				'x-hook0-signature': `t=${String(Math.floor(Date.now() / 1000) - 30)},v0=${signature}`,
			},
			rawBody,
		});

		expect(mockLogEvent).toHaveBeenCalledTimes(1);
		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		const serialized = JSON.stringify(payload);
		expect(serialized).toContain('notif-1');
		expect(serialized).not.toContain('0.5');
		expect(serialized).not.toContain('0xabc123def456');
		expect(serialized).not.toContain('0xtxhash789');
	});
});
