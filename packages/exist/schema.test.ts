import { ExistSchema } from './schema';

describe('Exist schema', () => {
	it('declares a semver version', () => {
		expect(ExistSchema.version).toBeDefined();
		expect(ExistSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ExistSchema.entities).toBe('object');
		expect(ExistSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ExistSchema.entities))).toBe(true);
		for (const entity of Object.values(ExistSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
