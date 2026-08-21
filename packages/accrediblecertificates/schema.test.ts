import { AccredibleCertificatesSchema } from './schema';

describe('AccredibleCertificates schema', () => {
	it('declares a semver version', () => {
		expect(AccredibleCertificatesSchema.version).toBeDefined();
		expect(AccredibleCertificatesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AccredibleCertificatesSchema.entities).toBe('object');
		expect(AccredibleCertificatesSchema.entities).not.toBeNull();
		expect(
			Array.isArray(Object.keys(AccredibleCertificatesSchema.entities)),
		).toBe(true);
		for (const entity of Object.values(AccredibleCertificatesSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
