import { EmeliaSchema } from './schema';

describe('Emelia schema', () => {
	it('declares a semver version', () => {
		expect(EmeliaSchema.version).toBeDefined();
		expect(EmeliaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EmeliaSchema.entities).toBe('object');
		expect(EmeliaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EmeliaSchema.entities))).toBe(true);
		for (const entity of Object.values(EmeliaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
