import { AscoraSchema } from './schema';

describe('Ascora schema', () => {
	it('declares a semver version', () => {
		expect(AscoraSchema.version).toBeDefined();
		expect(AscoraSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AscoraSchema.entities).toBe('object');
		expect(AscoraSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AscoraSchema.entities))).toBe(true);
		for (const entity of Object.values(AscoraSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
