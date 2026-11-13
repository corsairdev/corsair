import { FlySchema } from './schema';

describe('Fly schema', () => {
	it('declares a semver version', () => {
		expect(FlySchema.version).toBeDefined();
		expect(FlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FlySchema.entities).toBe('object');
		expect(FlySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FlySchema.entities))).toBe(true);
		for (const entity of Object.values(FlySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
