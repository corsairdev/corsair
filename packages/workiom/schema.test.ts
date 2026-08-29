import { WorkiomSchema } from './schema';

describe('Workiom schema', () => {
	it('declares a semver version', () => {
		expect(WorkiomSchema.version).toBeDefined();
		expect(WorkiomSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WorkiomSchema.entities).toBe('object');
		expect(WorkiomSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WorkiomSchema.entities))).toBe(true);
		for (const entity of Object.values(WorkiomSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
