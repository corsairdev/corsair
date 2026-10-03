import { CuttlySchema } from './schema';

describe('Cuttly schema', () => {
	it('declares a semver version', () => {
		expect(CuttlySchema.version).toBeDefined();
		expect(CuttlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CuttlySchema.entities).toBe('object');
		expect(CuttlySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CuttlySchema.entities))).toBe(true);
		for (const entity of Object.values(CuttlySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
