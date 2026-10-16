import { VaquillSchema } from './schema';
import { VaquillSearchResult } from './schema/database';

describe('Vaquill schema', () => {
	it('declares a semver version', () => {
		expect(VaquillSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores search results as the single entity', () => {
		expect(Object.keys(VaquillSchema.entities)).toEqual(['searchResults']);
	});

	it('requires the actId key the search and section endpoints upsert on', () => {
		expect(
			VaquillSearchResult.safeParse({ citation: '42 U.S.C. § 1983' }).success,
		).toBe(false);
		expect(
			VaquillSearchResult.safeParse({
				actId: 'USC_T42_C21_S1983',
				citation: '42 U.S.C. § 1983',
			}).success,
		).toBe(true);
	});
});
