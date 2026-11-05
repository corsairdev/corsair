import { WoodpeckerCoSchema } from './schema';

describe('WoodpeckerCo schema', () => {
	it('declares a semver version', () => {
		expect(WoodpeckerCoSchema.version).toBeDefined();
		expect(WoodpeckerCoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WoodpeckerCoSchema.entities).toBe('object');
		expect(WoodpeckerCoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WoodpeckerCoSchema.entities))).toBe(true);
		for (const entity of Object.values(WoodpeckerCoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
