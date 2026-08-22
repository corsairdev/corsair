import * as http from 'corsair/http';
import type { AnonyflowContext, AnonyflowEndpointInputs } from './index';
import { anonyflow } from './index';
import { AnonyflowSchema } from './schema';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

describe('Anonyflow schema', () => {
	it('declares a semver version', () => {
		expect(AnonyflowSchema.version).toBeDefined();
		expect(AnonyflowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});
});

describe('Anonyflow endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('executes the anonymize endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;

		mockRequest.mockResolvedValueOnce({
			status: true,
			value: ['AQICAHiWIc...'],
		});

		const plugin = anonyflow({ key: 'test-secret-key' });

		const ctx = {
			authType: 'api_key',
			key: 'test-secret-key',
			keys: { get_api_key: async () => 'test-secret-key' },
		} as unknown as AnonyflowContext;

		const input: AnonyflowEndpointInputs['anonymize'] = {
			text: 'My name is Athish',
		};

		const result = await plugin.endpoints!.core.anonymize(ctx, input);

		expect(result).toEqual({ anonymizedText: 'AQICAHiWIc...' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anonyflow.com',
				TOKEN: 'test-secret-key',
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/anony-value',
				body: { data: ['My name is Athish'] },
			}),
		);
	});

	it('executes the deanonymize endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;

		mockRequest.mockResolvedValueOnce({
			status: true,
			value: ['My name is Athish'],
		});

		const plugin = anonyflow({ key: 'test-secret-key' });

		const ctx = {
			authType: 'api_key',
			key: 'test-secret-key',
			keys: { get_api_key: async () => 'test-secret-key' },
		} as unknown as AnonyflowContext;

		const input: AnonyflowEndpointInputs['deanonymize'] = {
			anonymizedText: 'AQICAHiWIc...',
		};

		const result = await plugin.endpoints!.core.deanonymize(ctx, input);

		expect(result).toEqual({ originalText: 'My name is Athish' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anonyflow.com',
				TOKEN: 'test-secret-key',
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/deanony-value',
				body: { data: ['AQICAHiWIc...'] },
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

		const ctx = {
			authType: 'api_key',
			key: 'test-secret-key',
			keys: { get_api_key: async () => 'test-secret-key' },
		} as unknown as AnonyflowContext;

		const input: AnonyflowEndpointInputs['anonymizePacket'] = {
			data: { firstName: 'john' },
			keys: ['firstName'],
		};

		const result = await plugin.endpoints!.core.anonymizePacket(ctx, input);

		expect(result).toEqual({
			status: true,
			value: { firstName: 'AQICAHiWIc...' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anonyflow.com',
				TOKEN: 'test-secret-key',
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/anony-packet',
				body: { data: { firstName: 'john' }, keys: ['firstName'] },
			}),
		);
	});

	it('executes the deanonymizePacket endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;

		mockRequest.mockResolvedValueOnce({
			status: true,
			value: { firstName: 'john' },
		});

		const plugin = anonyflow({ key: 'test-secret-key' });

		const ctx = {
			authType: 'api_key',
			key: 'test-secret-key',
			keys: { get_api_key: async () => 'test-secret-key' },
		} as unknown as AnonyflowContext;

		const input: AnonyflowEndpointInputs['deanonymizePacket'] = {
			data: { firstName: 'AQICAHiWIc...' },
			keys: ['firstName'],
		};

		const result = await plugin.endpoints!.core.deanonymizePacket(ctx, input);

		expect(result).toEqual({ status: true, value: { firstName: 'john' } });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anonyflow.com',
				TOKEN: 'test-secret-key',
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/deanony-packet',
				body: { data: { firstName: 'AQICAHiWIc...' }, keys: ['firstName'] },
			}),
		);
	});

	it('executes the getStatus endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;

		mockRequest.mockResolvedValueOnce({
			status: true,
		});

		const plugin = anonyflow({ key: 'test-secret-key' });

		const ctx = {
			authType: 'api_key',
			key: 'test-secret-key',
			keys: { get_api_key: async () => 'test-secret-key' },
		} as unknown as AnonyflowContext;

		const input: AnonyflowEndpointInputs['getStatus'] = {};

		const result = await plugin.endpoints!.core.getStatus(ctx, input);

		expect(result).toEqual({ status: true });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anonyflow.com',
				TOKEN: 'test-secret-key',
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-secret-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/test',
			}),
		);
	});
});
