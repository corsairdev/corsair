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
		expect(Object.keys(BlackbaudSchema.entities)).toEqual([
			'gifts',
			'batchGifts',
			'memberships',
			'paymentTransactions',
			'oneRosterKeys',
		]);
	});

	it('accepts valid endpoint inputs', () => {
		expect(
			BlackbaudEndpointInputSchemas.getGiftById.parse({ gift_id: 'g1' }),
		).toEqual({ gift_id: 'g1' });
		expect(
			BlackbaudEndpointInputSchemas.addGiftsToBatch.parse({
				batch_id: 'b1',
				gifts: [
					{
						constituent_id: 'c1',
						amount: { value: 25 },
						gift_splits: [{ amount: { value: 25 }, fund_id: 'f1' }],
						type: 'Donation',
						payments: [{ payment_method: 'Cash' }],
					},
				],
			}),
		).toBeDefined();
		expect(
			BlackbaudEndpointInputSchemas.getMembershipDetails.parse({
				member_junction_id: 'j1',
			}),
		).toEqual({ member_junction_id: 'j1' });
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
			BlackbaudEndpointInputSchemas.getMembershipDetails.parse({
				member_junction_id: '',
			}),
		).toThrow();
		expect(() =>
			BlackbaudEndpointInputSchemas.addGiftsToBatch.parse({
				batch_id: 'b1',
				gifts: [{ constituent_id: 'c1', amount: { value: 25 } }],
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

	it('parses endpoint outputs into the documented shapes', () => {
		expect(
			BlackbaudEndpointOutputSchemas.getGiftById.parse({
				id: 'g1',
				amount: { value: 10 },
			}),
		).toEqual({ id: 'g1', amount: { value: 10 } });

		expect(
			BlackbaudEndpointOutputSchemas.addGiftsToBatch.parse({
				gifts: [{ id: 'g1', batch_id: 'b1' }],
				errors: [],
			}),
		).toEqual({ gifts: [{ id: 'g1', batch_id: 'b1' }], errors: [] });

		expect(
			BlackbaudEndpointOutputSchemas.getMembershipDetails.parse({
				program_name: 'Annual',
				dues: null,
				type: 'Joined',
			}),
		).toEqual({ program_name: 'Annual', dues: null, type: 'Joined' });
	});
});
