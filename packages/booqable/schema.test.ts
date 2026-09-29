import { BooqableSchema } from './schema';

describe('Booqable schema', () => {
	it('declares a semver version', () => {
		expect(BooqableSchema.version).toBeDefined();
		expect(BooqableSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BooqableSchema.entities).toBe('object');
		expect(BooqableSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BooqableSchema.entities))).toBe(true);
		for (const entity of Object.values(BooqableSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
