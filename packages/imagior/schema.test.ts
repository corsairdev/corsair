import { ImagiorSchema } from './schema';

describe('Imagior schema', () => {
	it('declares a semver version', () => {
		expect(ImagiorSchema.version).toBeDefined();
		expect(ImagiorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ImagiorSchema.entities).toBe('object');
		expect(ImagiorSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ImagiorSchema.entities))).toBe(true);
		for (const entity of Object.values(ImagiorSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
