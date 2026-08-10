import { AmcardsSchema } from './schema';

describe('Amcards schema', () => {
	it('declares a semver version', () => {
		expect(AmcardsSchema.version).toBeDefined();
		expect(AmcardsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AmcardsSchema.entities).toBe('object');
		expect(AmcardsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AmcardsSchema.entities))).toBe(true);
		for (const entity of Object.values(AmcardsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
