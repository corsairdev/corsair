import { TypeSafeSchema } from './schema';

describe('TypeSafe schema', () => {
	it('declares a semver version', () => {
		expect(TypeSafeSchema.version).toBeDefined();
		expect(TypeSafeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TypeSafeSchema.entities).toBe('object');
		expect(TypeSafeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TypeSafeSchema.entities))).toBe(true);
		for (const entity of Object.values(TypeSafeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
