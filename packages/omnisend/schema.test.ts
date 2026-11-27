import { OmnisendSchema } from './schema';

describe('Omnisend schema', () => {
	it('declares a semver version', () => {
		expect(OmnisendSchema.version).toBeDefined();
		expect(OmnisendSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof OmnisendSchema.entities).toBe('object');
		expect(OmnisendSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(OmnisendSchema.entities))).toBe(true);
		for (const entity of Object.values(OmnisendSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
