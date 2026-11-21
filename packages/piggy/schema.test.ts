// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { piggyEndpointMeta, piggyEndpointSchemas } from './index';
import { PiggySchema } from './schema';

describe('PiggySchema', () => {
	it('declares a semver version', () => {
		expect(PiggySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because contacts and balances are read live from the API', () => {
		expect(Array.isArray(PiggySchema.entities)).toBe(false);
		expect(PiggySchema.entities).toEqual({});
	});
});

describe('plugin registration', () => {
	it('declares schemas for every implemented endpoint', () => {
		const keys = Object.keys(piggyEndpointSchemas);
		expect(keys).toHaveLength(47);
		expect(keys).toContain('contacts.list');
		expect(keys).toContain('contacts.delete');
		expect(keys).toContain('loyalty.listTransactions');
		expect(keys).toContain('points.reverse');
		expect(keys).toContain('rewards.redeem');
		expect(keys).toContain('vouchers.redeem');
		expect(keys).toContain('giftcards.create');
		expect(keys).toContain('businesses.getProfile');
		expect(keys).toContain('webhooks.delete');
	});

	it('declares meta for every schema key', () => {
		expect(Object.keys(piggyEndpointMeta).sort()).toEqual(
			Object.keys(piggyEndpointSchemas).sort(),
		);
	});

	it('marks deletes, merges, giftcard issues and giftcard emails as destructive', () => {
		const destructive = Object.entries(
			piggyEndpointMeta as Record<string, { riskLevel: string }>,
		)
			.filter(([, meta]) => meta.riskLevel === 'destructive')
			.map(([key]) => key);
		expect(destructive.sort()).toEqual([
			'contacts.delete',
			'contacts.merge',
			'giftcards.create',
			'giftcards.sendByEmail',
			'webhooks.delete',
		]);
	});
});
