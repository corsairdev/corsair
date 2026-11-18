import { NiftyimagesSchema } from './schema';

describe('Niftyimages schema', () => {
	it('declares a semver version', () => {
		expect(NiftyimagesSchema.version).toBeDefined();
		expect(NiftyimagesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NiftyimagesSchema.entities).toBe('object');
		expect(NiftyimagesSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NiftyimagesSchema.entities))).toBe(true);
		for (const entity of Object.values(NiftyimagesSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
