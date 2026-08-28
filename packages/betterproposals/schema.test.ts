import { BetterProposalsSchema } from './schema';

describe('BetterProposals schema', () => {
	it('declares a semver version', () => {
		expect(BetterProposalsSchema.version).toBeDefined();
		expect(BetterProposalsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BetterProposalsSchema.entities).toBe('object');
		expect(BetterProposalsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BetterProposalsSchema.entities))).toBe(
			true,
		);
	});
});
