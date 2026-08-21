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

	it('declares an entities map', () => {
		expect(typeof AnonyflowSchema.entities).toBe('object');
		expect(AnonyflowSchema.entities).not.toBeNull();

		// The entities map should be empty as this plugin does not cache database entities
		expect(Object.keys(AnonyflowSchema.entities)).toHaveLength(0);

		for (const entity of Object.values(AnonyflowSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Anonyflow endpoints', () => {
	it('executes the anonymize endpoint correctly', async () => {
		const mockRequest = http.request as jest.Mock;

		mockRequest.mockResolvedValueOnce({
			anonymized_text: 'My name is [PERSON]',
		});

		const plugin = anonyflow({ key: 'test-secret-key' });

		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'test-secret-key' },
		} as unknown as AnonyflowContext;

		const input: AnonyflowEndpointInputs['anonymize'] = {
			text: 'My name is Athish',
		};

		const result = await plugin.endpoints!.core.anonymize(ctx, input);

		expect(result).toEqual({ anonymized_text: 'My name is [PERSON]' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: 'test-secret-key',
				BASE: 'https://api.anonyflow.com',
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/anony-value',
				body: input,
			}),
		);
	});
});
