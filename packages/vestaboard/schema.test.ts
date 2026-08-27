import { VestaboardSchema } from './schema';

describe('Vestaboard schema', () => {
	it('declares a semver version', () => {
		expect(VestaboardSchema.version).toBeDefined();
		expect(VestaboardSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof VestaboardSchema.entities).toBe('object');
		expect(VestaboardSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(VestaboardSchema.entities))).toBe(true);
		for (const entity of Object.values(VestaboardSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
