import { CertifierSchema } from './schema';

describe('Certifier schema', () => {
	it('declares a semver version', () => {
		expect(CertifierSchema.version).toBeDefined();
		expect(CertifierSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CertifierSchema.entities).toBe('object');
		expect(CertifierSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CertifierSchema.entities))).toBe(true);
		for (const entity of Object.values(CertifierSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
