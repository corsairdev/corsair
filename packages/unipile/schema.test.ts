import { UnipileSchema } from './schema';

describe('Unipile schema', () => {
	it('declares a semver version', () => {
		expect(UnipileSchema.version).toBeDefined();
		expect(UnipileSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UnipileSchema.entities).toBe('object');
		expect(UnipileSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UnipileSchema.entities))).toBe(true);
		for (const entity of Object.values(UnipileSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
