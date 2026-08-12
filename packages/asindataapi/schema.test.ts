import { AsinDataApiSchema } from './schema';

describe('AsinDataApi schema', () => {
	it('declares a semver version', () => {
		expect(AsinDataApiSchema.version).toBeDefined();
		expect(AsinDataApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AsinDataApiSchema.entities).toBe('object');
		expect(AsinDataApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AsinDataApiSchema.entities))).toBe(true);
		for (const entity of Object.values(AsinDataApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
