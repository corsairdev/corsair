import { ESignaturesSchema } from './schema';

describe('ESignatures schema', () => {
	it('declares a semver version', () => {
		expect(ESignaturesSchema.version).toBeDefined();
		expect(ESignaturesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ESignaturesSchema.entities).toBe('object');
		expect(ESignaturesSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ESignaturesSchema.entities))).toBe(true);
		for (const entity of Object.values(ESignaturesSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
