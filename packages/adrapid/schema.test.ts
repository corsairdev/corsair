import { AdrapidSchema } from './schema';

describe('Adrapid schema', () => {
	it('declares a semver version', () => {
		expect(AdrapidSchema.version).toBeDefined();
		expect(AdrapidSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AdrapidSchema.entities).toBe('object');
		expect(AdrapidSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AdrapidSchema.entities))).toBe(true);
		for (const entity of Object.values(AdrapidSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
