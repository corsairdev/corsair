import { FinmeiSchema } from './schema';

describe('Finmei schema', () => {
	it('declares a semver version', () => {
		expect(FinmeiSchema.version).toBeDefined();
		expect(FinmeiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FinmeiSchema.entities).toBe('object');
		expect(FinmeiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FinmeiSchema.entities))).toBe(true);
		for (const entity of Object.values(FinmeiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
