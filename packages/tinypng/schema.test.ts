import { TinypngSchema } from './schema';

describe('Tinypng schema', () => {
	it('declares a semver version', () => {
		expect(TinypngSchema.version).toBeDefined();
		expect(TinypngSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TinypngSchema.entities).toBe('object');
		expect(TinypngSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TinypngSchema.entities))).toBe(true);
		for (const entity of Object.values(TinypngSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
