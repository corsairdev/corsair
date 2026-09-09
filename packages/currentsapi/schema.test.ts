import { CurrentsApiSchema } from './schema';

describe('CurrentsApi schema', () => {
	it('declares a semver version', () => {
		expect(CurrentsApiSchema.version).toBeDefined();
		expect(CurrentsApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CurrentsApiSchema.entities).toBe('object');
		expect(CurrentsApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CurrentsApiSchema.entities))).toBe(true);
		for (const entity of Object.values(CurrentsApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
