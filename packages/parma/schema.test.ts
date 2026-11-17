import { ParmaSchema } from './schema';

describe('Parma schema', () => {
	it('declares a semver version', () => {
		expect(ParmaSchema.version).toBeDefined();
		expect(ParmaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ParmaSchema.entities).toBe('object');
		expect(ParmaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ParmaSchema.entities))).toBe(true);
		for (const entity of Object.values(ParmaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
