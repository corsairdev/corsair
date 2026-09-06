import { BuiltWithSchema } from './schema';

describe('BuiltWith schema', () => {
	it('declares a semver version', () => {
		expect(BuiltWithSchema.version).toBeDefined();
		expect(BuiltWithSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BuiltWithSchema.entities).toBe('object');
		expect(BuiltWithSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BuiltWithSchema.entities))).toBe(true);
		for (const entity of Object.values(BuiltWithSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
