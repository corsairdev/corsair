import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Ping } from './endpoints';
import type { FingertipContext } from './index';
import { fingertip, fingertipEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeFingertipPingRequest: jest.fn() };
});

const mockPingRequest = jest.mocked(client.makeFingertipPingRequest);
const mockLogEvent = jest.mocked(logEventFromContext);
type PingContext = Parameters<typeof Ping.get>[0];

function buildContext(): PingContext {
	const context: FingertipContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const context = buildContext();

beforeEach(() => {
	mockPingRequest.mockReset();
	mockLogEvent.mockReset();
});

describe('ping.get', () => {
	it('calls the health route and returns its validated response', async () => {
		mockPingRequest.mockResolvedValue({ message: 'pong' });

		await expect(Ping.get(context, {})).resolves.toEqual({ message: 'pong' });
		expect(mockPingRequest).toHaveBeenCalledWith('test-api-key');
		expect(mockLogEvent).toHaveBeenCalledWith(
			context,
			'fingertip.ping',
			{},
			'completed',
		);
	});

	it('rejects undocumented input properties before network or logging', async () => {
		const invalidInput: Record<string, never> = {};
		Reflect.set(invalidInput, 'webhookUrl', 'https://callback.invalid/hook');
		await expect(Ping.get(context, invalidInput)).rejects.toThrow();
		expect(mockPingRequest).not.toHaveBeenCalled();
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('rejects malformed provider output and does not log success', async () => {
		mockPingRequest.mockResolvedValue({ message: 123 });

		await expect(Ping.get(context, {})).rejects.toThrow();
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('logs only safe metadata and exposes no webhooks', async () => {
		mockPingRequest.mockResolvedValue({ message: 'pong' });
		await Ping.get(context, {});

		const payload = mockLogEvent.mock.calls[0]?.[2];
		expect(payload).toEqual({});
		expect(JSON.stringify(payload)).not.toContain('test-api-key');

		const plugin = fingertip();
		expect(plugin.endpoints?.ping.get).toBeDefined();
		expect(plugin.webhooks).toEqual({});
		expect(fingertipEndpointSchemas['ping.get'].input).toBeDefined();
		expect(fingertipEndpointSchemas['ping.get'].output).toBeDefined();
	});
});
