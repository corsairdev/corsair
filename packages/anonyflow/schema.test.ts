import { AuthMissingError } from 'corsair/core';
import * as http from 'corsair/http';
import type { AnonyflowContext, AnonyflowEndpointInputs } from './index';
import { anonyflow } from './index';
import { AnonyflowSchema } from './schema';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

function context(key = 'test-secret-key'): AnonyflowContext {
	return {
		authType: 'api_key',
		key,
		keys: { get_api_key: async () => key },
	} as unknown as AnonyflowContext;
}

describe('Anonyflow schema', () => {
	it('declares a semver version', () => {
		expect(AnonyflowSchema.version).toBeDefined();
		expect(AnonyflowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(Object.keys(AnonyflowSchema.entities)).toHaveLength(0);
	});
});

describe('Anonyflow permissions', () => {
	const plugin = anonyflow({ key: 'test-secret-key' });

	it('marks deanonymize operations as write', () => {
		expect(plugin.endpointMeta?.['core.deanonymize']?.riskLevel).toBe('write');
		expect(plugin.endpointMeta?.['core.deanonymizePacket']?.riskLevel).toBe(
			'write',
		);
	});

	it('exposes testConnection as the fifth core operation', () => {
		expect(Object.keys(plugin.endpoints?.core ?? {})).toEqual([
			'anonymize',
			'deanonymize',
			'anonymizePacket',
			'deanonymizePacket',
			'testConnection',
		]);
		expect(plugin.endpoints?.core).not.toHaveProperty('getStatus');
		expect(plugin.endpoints?.core).not.toHaveProperty('analyze');
		expect(plugin.endpoints?.core).not.toHaveProperty('listEntities');
		expect(plugin.endpointMeta?.['core.testConnection']?.riskLevel).toBe(
			'read',
		);
	});
});

describe('Anonyflow endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends x-api-key without a Bearer token', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: true,
			value: 'AQICAHiWIc...',
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		await plugin.endpoints!.core.anonymize(context(), {
			text: 'My name is Athish',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anonyflow.com',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/anony-value',
				body: { data: 'My name is Athish' },
			}),
		);
	});

	it('executes the anonymize endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: true,
			value: ['AQICAHiWIc...'],
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		const input: AnonyflowEndpointInputs['anonymize'] = {
			text: 'My name is Athish',
		};

		const result = await plugin.endpoints!.core.anonymize(context(), input);

		expect(result).toEqual({ anonymizedText: 'AQICAHiWIc...' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/anony-value',
				body: { data: 'My name is Athish' },
			}),
		);
	});

	it('uses a string value from anonymize instead of the first character', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: true,
			value: 'AQICAHiWIc-ciphertext',
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		const result = await plugin.endpoints!.core.anonymize(context(), {
			text: 'secret',
		});

		expect(result).toEqual({ anonymizedText: 'AQICAHiWIc-ciphertext' });
	});

	it('rejects anonymize when Anonyflow returns status false', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: false,
			value: ['should-not-use'],
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		await expect(
			plugin.endpoints!.core.anonymize(context(), { text: 'secret' }),
		).rejects.toThrow(/rejected/i);
	});

	it('rejects anonymize when the value is missing', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({ status: true });

		const plugin = anonyflow({ key: 'test-secret-key' });
		await expect(
			plugin.endpoints!.core.anonymize(context(), { text: 'secret' }),
		).rejects.toThrow(/invalid value/i);
	});

	it('executes the deanonymize endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: true,
			value: 'My name is Athish',
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		const input: AnonyflowEndpointInputs['deanonymize'] = {
			anonymizedText: 'AQICAHiWIc...',
		};

		const result = await plugin.endpoints!.core.deanonymize(context(), input);

		expect(result).toEqual({ originalText: 'My name is Athish' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/deanony-value',
				body: { data: 'AQICAHiWIc...' },
			}),
		);
	});

	it('executes the anonymizePacket endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: true,
			value: { firstName: 'AQICAHiWIc...' },
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		const input: AnonyflowEndpointInputs['anonymizePacket'] = {
			data: { firstName: 'john' },
			keys: ['firstName'],
		};

		const result = await plugin.endpoints!.core.anonymizePacket(
			context(),
			input,
		);

		expect(result).toEqual({
			status: true,
			value: { firstName: 'AQICAHiWIc...' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: undefined,
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/anony-packet',
				body: { data: { firstName: 'john' }, keys: ['firstName'] },
			}),
		);
	});

	it('rejects packet operations when Anonyflow returns status false', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: false,
			value: { firstName: 'john' },
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		await expect(
			plugin.endpoints!.core.deanonymizePacket(context(), {
				data: { firstName: 'AQICAHiWIc...' },
				keys: ['firstName'],
			}),
		).rejects.toThrow(/rejected/i);
	});

	it('executes the deanonymizePacket endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({
			status: true,
			value: { firstName: 'john' },
		});

		const plugin = anonyflow({ key: 'test-secret-key' });
		const input: AnonyflowEndpointInputs['deanonymizePacket'] = {
			data: { firstName: 'AQICAHiWIc...' },
			keys: ['firstName'],
		};

		const result = await plugin.endpoints!.core.deanonymizePacket(
			context(),
			input,
		);

		expect(result).toEqual({ status: true, value: { firstName: 'john' } });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: undefined,
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/deanony-packet',
				body: { data: { firstName: 'AQICAHiWIc...' }, keys: ['firstName'] },
			}),
		);
	});

	it('rejects requests when the API key is missing', async () => {
		const mockRequest = http.request as jest.Mock;
		const plugin = anonyflow();

		await expect(
			plugin.endpoints!.core.anonymize(context(''), { text: 'secret' }),
		).rejects.toThrow(/api key/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError from keyBuilder when no key is configured', async () => {
		const plugin = anonyflow();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		};

		await expect(
			plugin.keyBuilder!(ctx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('executes the testConnection endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({ status: true });

		const plugin = anonyflow({ key: 'test-secret-key' });
		const result = await plugin.endpoints!.core.testConnection(context(), {});

		expect(result).toEqual({ status: true });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anonyflow.com',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/test',
				body: undefined,
			}),
		);
	});

	it('rejects testConnection when Anonyflow returns status false', async () => {
		const mockRequest = http.request as jest.Mock;
		mockRequest.mockResolvedValueOnce({ status: false });

		const plugin = anonyflow({ key: 'test-secret-key' });
		await expect(
			plugin.endpoints!.core.testConnection(context(), {}),
		).rejects.toThrow(/rejected/i);
	});
});
