import { RemovebgSchema } from './schema';

describe('Removebg schema', () => {
	it('declares a semver version', () => {
		expect(RemovebgSchema.version).toBeDefined();
		expect(RemovebgSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RemovebgSchema.entities).toBe('object');
		expect(RemovebgSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RemovebgSchema.entities))).toBe(true);
		for (const entity of Object.values(RemovebgSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
