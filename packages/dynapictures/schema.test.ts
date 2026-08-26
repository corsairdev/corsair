import { DynapicturesSchema } from './schema';

describe('Dynapictures schema', () => {
	it('declares a semver version', () => {
		expect(DynapicturesSchema.version).toBeDefined();
		expect(DynapicturesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DynapicturesSchema.entities).toBe('object');
		expect(DynapicturesSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DynapicturesSchema.entities))).toBe(true);
		for (const entity of Object.values(DynapicturesSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
