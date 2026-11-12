import { RealPhoneValidationSchema } from './schema';

describe('RealPhoneValidation schema', () => {
	it('declares a semver version', () => {
		expect(RealPhoneValidationSchema.version).toBeDefined();
		expect(RealPhoneValidationSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RealPhoneValidationSchema.entities).toBe('object');
		expect(RealPhoneValidationSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RealPhoneValidationSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(RealPhoneValidationSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a disposition goes stale', () => {
		// A number can be connected today and gone next month, and the services
		// deliberately allow up to 5% unknown, so a cached verdict would look more
		// certain than the answer it came from.
		expect(Object.keys(RealPhoneValidationSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
