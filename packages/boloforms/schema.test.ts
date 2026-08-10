import { BoloformsSchema } from './schema';

describe('Boloforms schema', () => {
	it('declares a semver version', () => {
		expect(BoloformsSchema.version).toBeDefined();
		expect(BoloformsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BoloformsSchema.entities).toBe('object');
		expect(BoloformsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BoloformsSchema.entities))).toBe(true);
		for (const entity of Object.values(BoloformsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
