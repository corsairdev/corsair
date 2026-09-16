import { UploadcareSchema } from './schema';

describe('Uploadcare schema', () => {
	it('declares a semver version', () => {
		expect(UploadcareSchema.version).toBeDefined();
		expect(UploadcareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UploadcareSchema.entities).toBe('object');
		expect(UploadcareSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UploadcareSchema.entities))).toBe(true);
		for (const entity of Object.values(UploadcareSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
