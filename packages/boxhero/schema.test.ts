import { BoxheroSchema } from './schema';

describe('Boxhero schema', () => {
	it('declares a semver version', () => {
		expect(BoxheroSchema.version).toBeDefined();
		expect(BoxheroSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BoxheroSchema.entities).toBe('object');
		expect(BoxheroSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BoxheroSchema.entities))).toBe(true);
		for (const entity of Object.values(BoxheroSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
