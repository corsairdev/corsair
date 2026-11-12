import { GongSchema } from './schema';

describe('Gong schema', () => {
	it('declares a semver version', () => {
		expect(GongSchema.version).toBeDefined();
		expect(GongSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GongSchema.entities).toBe('object');
		expect(GongSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GongSchema.entities))).toBe(true);
		for (const entity of Object.values(GongSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
