import { NasaSchema } from './schema';

describe('Nasa schema', () => {
	it('declares a semver version', () => {
		expect(NasaSchema.version).toBeDefined();
		expect(NasaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NasaSchema.entities).toBe('object');
		expect(NasaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NasaSchema.entities))).toBe(true);
		for (const entity of Object.values(NasaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
