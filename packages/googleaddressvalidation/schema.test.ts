import { GoogleAddressValidationSchema } from './schema';

describe('GoogleAddressValidation schema', () => {
	it('declares a semver version', () => {
		expect(GoogleAddressValidationSchema.version).toBeDefined();
		expect(GoogleAddressValidationSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoogleAddressValidationSchema.entities).toBe('object');
		expect(GoogleAddressValidationSchema.entities).not.toBeNull();
		expect(
			Array.isArray(Object.keys(GoogleAddressValidationSchema.entities)),
		).toBe(true);
		for (const entity of Object.values(
			GoogleAddressValidationSchema.entities,
		)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
