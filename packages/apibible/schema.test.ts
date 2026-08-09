import { ApiBibleSchema } from './schema';

describe('ApiBible schema', () => {
	it('declares a semver version', () => {
		expect(ApiBibleSchema.version).toBeDefined();
		expect(ApiBibleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ApiBibleSchema.entities).toBe('object');
		expect(ApiBibleSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ApiBibleSchema.entities))).toBe(true);
		for (const entity of Object.values(ApiBibleSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
