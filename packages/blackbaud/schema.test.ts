import {
	BlackbaudEndpointInputSchemas,
	BlackbaudEndpointOutputSchemas,
} from './endpoints/types';
import { BlackbaudSchema } from './schema';

describe('Blackbaud schema', () => {
	it('declares a semver version', () => {
		expect(BlackbaudSchema.version).toBeDefined();
		expect(BlackbaudSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BlackbaudSchema.entities).toBe('object');
		expect(BlackbaudSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BlackbaudSchema.entities))).toBe(true);
		for (const entity of Object.values(BlackbaudSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('accepts valid endpoint inputs', () => {
		expect(
			BlackbaudEndpointInputSchemas.getGiftById.parse({ gift_id: 'g1' }),
		).toEqual({ gift_id: 'g1' });
		expect(
			BlackbaudEndpointInputSchemas.addGiftsToBatch.parse({
				batch_id: 'b1',
				gifts: [{ constituent_id: 'c1', amount: { value: 25 } }],
			}),
		).toBeDefined();
		expect(
			BlackbaudEndpointInputSchemas.oneRosterOAuth2BaseApi.parse({
				operation: 'publickeys',
			}),
		).toBeDefined();
	});

	it('rejects empty identifiers and token operations', () => {
		expect(() =>
			BlackbaudEndpointInputSchemas.getGiftById.parse({ gift_id: '' }),
		).toThrow();
		expect(() =>
			BlackbaudEndpointInputSchemas.getPaymentTransaction.parse({
				transaction_id: '',
			}),
		).toThrow();
		expect(() =>
			BlackbaudEndpointInputSchemas.oneRosterOAuth2BaseApi.parse({
				operation: 'token',
			}),
		).toThrow();
	});

	it('parses endpoint outputs while allowing provider extensions', () => {
		const gift = BlackbaudEndpointOutputSchemas.getGiftById.parse({
			id: 'g1',
			custom_extension: 'kept',
		});
		expect(gift).toMatchObject({ id: 'g1', custom_extension: 'kept' });

		const batch = BlackbaudEndpointOutputSchemas.addGiftsToBatch.parse({
			status_code: 200,
			response_details: { batch: 'ok' },
		});
		expect(batch.status_code).toBe(200);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test (see api.test.ts + endpoints.test.ts).
