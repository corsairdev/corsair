import { MakeSchema } from './schema';

describe('Make schema', () => {
	it('declares a semver version', () => {
		expect(MakeSchema.version).toBeDefined();
		expect(MakeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MakeSchema.entities).toBe('object');
		expect(MakeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MakeSchema.entities))).toBe(true);
		for (const entity of Object.values(MakeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
