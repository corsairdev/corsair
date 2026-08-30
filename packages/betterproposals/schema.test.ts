import { BetterProposalsSchema } from './schema';

describe('BetterProposals schema', () => {
	it('declares a semver version', () => {
		expect(BetterProposalsSchema.version).toBeDefined();
		expect(BetterProposalsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official API entities', () => {
		expect(Object.keys(BetterProposalsSchema.entities)).toEqual([
			'proposals',
			'templates',
			'documentTypes',
			'quotes',
			'companies',
			'covers',
			'currencies',
			'settings',
			'brands',
			'mergeTags',
		]);
	});
});
