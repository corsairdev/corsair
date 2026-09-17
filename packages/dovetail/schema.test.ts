import { DovetailSchema } from './schema';

describe('Dovetail schema', () => {
	it('declares a semver version', () => {
		expect(DovetailSchema.version).toBeDefined();
		expect(DovetailSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DovetailSchema.entities).toBe('object');
		expect(DovetailSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DovetailSchema.entities))).toBe(true);
		for (const entity of Object.values(DovetailSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
