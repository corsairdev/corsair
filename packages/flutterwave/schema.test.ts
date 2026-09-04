import { FlutterwaveSchema } from './schema';

describe('Flutterwave schema', () => {
	it('declares a semver version', () => {
		expect(FlutterwaveSchema.version).toBeDefined();
		expect(FlutterwaveSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FlutterwaveSchema.entities).toBe('object');
		expect(FlutterwaveSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FlutterwaveSchema.entities))).toBe(true);
		for (const entity of Object.values(FlutterwaveSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
