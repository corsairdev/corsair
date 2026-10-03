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
		expect(Array.isArray(BlackbaudSchema.entities)).toBe(false);
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
			BlackbaudEndpointInputSchemas.listMemberships.parse({
				constituent_id: 'c1',
			}),
		).toEqual({ constituent_id: 'c1' });
		expect(
			BlackbaudEndpointInputSchemas.listMemberships.parse({
				constituent_id: 'c1',
				member_junction_id: 'j1',
				limit: 50,
				offset: 0,
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
			BlackbaudEndpointInputSchemas.listMemberships.parse({
				constituent_id: '',
			}),
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

		const memberships = BlackbaudEndpointOutputSchemas.listMemberships.parse({
			count: 1,
			value: [{ id: 'm1', program: 'Annual', custom_extension: 'kept' }],
		});
		expect(memberships.count).toBe(1);
		expect(memberships.value).toHaveLength(1);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test (see api.test.ts + endpoints.test.ts).
