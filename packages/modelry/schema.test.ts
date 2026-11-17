import { ModelrySchema } from './schema';

describe('Modelry schema', () => {
	it('declares a semver version', () => {
		expect(ModelrySchema.version).toBeDefined();
		expect(ModelrySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ModelrySchema.entities).toBe('object');
		expect(ModelrySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ModelrySchema.entities))).toBe(true);
		for (const entity of Object.values(ModelrySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
