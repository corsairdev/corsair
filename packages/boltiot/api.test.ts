import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	BoltIotAPIError,
	BoltIotRateLimitError,
	makeBoltIotRequest,
} from './client';
import {
	analogRead,
	checkStatus,
	digitalRead,
	digitalWrite,
} from './endpoints/device';
import {
	read as serialRead,
	write as serialWrite,
	writeRead as serialWriteRead,
} from './endpoints/serial';
import {
	BoltIotEndpointInputSchemas,
	BoltIotEndpointOutputSchemas,
} from './endpoints/types';
import { boltiot } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	const headers = new Headers({
		'Content-Type': 'application/json',
		...(init?.headers as Record<string, string>),
	});
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers,
	});
}

function lastRequest(): { url: string; auth: string | null } {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string | URL | Request,
		RequestInit | undefined,
	];
	const url =
		typeof input === 'string'
			? input
			: input instanceof URL
				? input.toString()
				: input.url;
	const headers = new Headers(init?.headers);
	return { url, auth: headers.get('Authorization') };
}

describe('BoltIot plugin & client tests', () => {
	const mockCtx = {
		key: 'test-api-key',
		$getAccountId: async () => 'test-account',
	} as never;

	it('creates plugin instance with correct metadata', () => {
		const plugin = boltiot({ key: 'test-api-key' });
		expect(plugin.id).toBe('boltiot');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.endpoints?.device.checkStatus).toBeDefined();
		expect(plugin.endpoints?.device.analogRead).toBeDefined();
		expect(plugin.endpoints?.device.digitalWrite).toBeDefined();
		expect(plugin.endpoints?.device.digitalRead).toBeDefined();
		expect(plugin.endpoints?.serial.read).toBeDefined();
		expect(plugin.endpoints?.serial.write).toBeDefined();
		expect(plugin.endpoints?.serial.writeRead).toBeDefined();
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = boltiot();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('checks device status with official isOnline command', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				success: 1,
				value: 'online',
				time: 'Sun 2018-05-06 08:14:43 UTC',
			}),
		);

		const input = BoltIotEndpointInputSchemas.checkDeviceStatus.parse({
			deviceName: 'BOLT1234567',
		});
		const result = await checkStatus(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: 'online',
			time: 'Sun 2018-05-06 08:14:43 UTC',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.checkDeviceStatus.parse(result);

		const req = lastRequest();
		expect(req.url).toContain('/test-api-key/isOnline');
		expect(req.url).toContain('deviceName=BOLT1234567');
		expect(req.auth).toBeNull();
	});

	it('reads analog pin value', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ success: '1', value: '512' }));

		const input = BoltIotEndpointInputSchemas.analogRead.parse({
			deviceName: 'BOLT1234567',
			pin: 'A0',
		});
		const result = await analogRead(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: 512,
			rawValue: '512',
			pin: 'A0',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.analogRead.parse(result);

		const req = lastRequest();
		expect(req.url).toContain('/analogRead');
		expect(req.url).toContain('pin=A0');
	});

	it('rejects malformed analog readings', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ success: '1', value: '12x' }));

		const input = BoltIotEndpointInputSchemas.analogRead.parse({
			deviceName: 'BOLT1234567',
			pin: 'A0',
		});
		await expect(analogRead(mockCtx, input)).rejects.toThrow(BoltIotAPIError);
	});

	it('writes digital pin state HIGH', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ success: '1', value: '1' }));

		const input = BoltIotEndpointInputSchemas.digitalWrite.parse({
			deviceName: 'BOLT1234567',
			pin: '0',
			state: 'HIGH',
		});
		const result = await digitalWrite(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: '1',
			pin: '0',
			state: 'HIGH',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.digitalWrite.parse(result);

		const req = lastRequest();
		expect(req.url).toContain('/digitalWrite');
		expect(req.url).toContain('state=HIGH');
	});

	it('reads digital pin state', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ success: '1', value: '1' }));

		const input = BoltIotEndpointInputSchemas.digitalRead.parse({
			deviceName: 'BOLT1234567',
			pin: '0',
		});
		const result = await digitalRead(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: '1',
			pin: '0',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.digitalRead.parse(result);

		const req = lastRequest();
		expect(req.url).toContain('/digitalRead');
	});

	it('reads serial data', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: 'Hello Serial' }),
		);

		const input = BoltIotEndpointInputSchemas.serialRead.parse({
			deviceName: 'BOLT1234567',
			till: '10',
		});
		const result = await serialRead(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: 'Hello Serial',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.serialRead.parse(result);

		const req = lastRequest();
		expect(req.url).toContain('/serialRead');
		expect(req.url).toContain('till=10');
	});

	it('writes serial data', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: 'Serial write Successful' }),
		);

		const input = BoltIotEndpointInputSchemas.serialWrite.parse({
			deviceName: 'BOLT1234567',
			data: 'AT',
		});
		const result = await serialWrite(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: 'Serial write Successful',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.serialWrite.parse(result);

		const req = lastRequest();
		expect(req.url).toContain('/serialWrite');
		expect(req.url).toContain('data=AT');
	});

	it('writes and reads serial data via serialWR', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ success: '1', value: 'OK' }));

		const input = BoltIotEndpointInputSchemas.serialWriteRead.parse({
			deviceName: 'BOLT1234567',
			data: 'AT',
			till: '10',
		});
		const result = await serialWriteRead(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: 'OK',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.serialWriteRead.parse(result);

		const req = lastRequest();
		expect(req.url).toContain('/serialWR');
	});

	it('handles API error when success is "0"', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '0', value: 'Invalid API key' }),
		);

		await expect(
			makeBoltIotRequest('isOnline', 'invalid-key', { deviceName: 'DEV1' }),
		).rejects.toThrow(BoltIotAPIError);
	});

	it('handles 429 rate limit error', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ error: 'rate limited' },
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'Retry-After': '2' },
				},
			),
		);

		const err = await makeBoltIotRequest('isOnline', 'test-key', {
			deviceName: 'DEV1',
		}).catch((e: unknown) => e);
		expect(err).toBeInstanceOf(BoltIotRateLimitError);
		expect((err as BoltIotRateLimitError).retryAfterMs).toBe(2000);
	});

	it('rejects a null JSON body', async () => {
		mockFetch.mockResolvedValue(jsonResponse(null));
		await expect(
			makeBoltIotRequest('isOnline', 'test-key', { deviceName: 'DEV1' }),
		).rejects.toThrow(BoltIotAPIError);
	});
});
