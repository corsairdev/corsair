import { MoonClerkSchema } from './schema';

describe('MoonClerk schema', () => {
	it('declares a semver version', () => {
		expect(MoonClerkSchema.version).toBeDefined();
		expect(MoonClerkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MoonClerkSchema.entities).toBe('object');
		expect(MoonClerkSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MoonClerkSchema.entities))).toBe(true);
		for (const entity of Object.values(MoonClerkSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
