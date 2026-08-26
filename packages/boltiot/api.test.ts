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

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
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

describe('BoltIot plugin & client tests', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const mockCtx = {
		key: 'test-api-key',
		$getAccountId: async () => 'test-account',
	} as any;

	it('creates plugin instance with correct metadata', () => {
		const plugin = boltiot({ key: 'test-api-key' });
		expect(plugin.id).toBe('boltiot');
		expect(plugin.endpoints?.device.checkStatus).toBeDefined();
		expect(plugin.endpoints?.device.analogRead).toBeDefined();
		expect(plugin.endpoints?.device.digitalWrite).toBeDefined();
		expect(plugin.endpoints?.device.digitalRead).toBeDefined();
		expect(plugin.endpoints?.serial.read).toBeDefined();
		expect(plugin.endpoints?.serial.write).toBeDefined();
		expect(plugin.endpoints?.serial.writeRead).toBeDefined();
	});

	it('checks device status endpoint', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: 'online' }),
		);

		const input = BoltIotEndpointInputSchemas.checkDeviceStatus.parse({
			deviceName: 'BOLT1234567',
		});
		const result = await checkStatus(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: 'online',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.checkDeviceStatus.parse(result);
	});

	it('reads analog pin value', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: '512' }),
		);

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
	});

	it('writes digital pin state HIGH', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: '1' }),
		);

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
	});

	it('reads digital pin state', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: '1' }),
		);

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
	});

	it('writes serial data', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: 'Command delivered' }),
		);

		const input = BoltIotEndpointInputSchemas.serialWrite.parse({
			deviceName: 'BOLT1234567',
			data: 'AT',
		});
		const result = await serialWrite(mockCtx, input);

		expect(result).toEqual({
			success: true,
			value: 'Command delivered',
			deviceName: 'BOLT1234567',
		});
		BoltIotEndpointOutputSchemas.serialWrite.parse(result);
	});

	it('writes and reads serial data', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ success: '1', value: 'OK' }),
		);

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
				{ status: 429, statusText: 'Too Many Requests' },
			),
		);

		await expect(
			makeBoltIotRequest('isOnline', 'test-key', { deviceName: 'DEV1' }),
		).rejects.toThrow(BoltIotRateLimitError);
	});
});
