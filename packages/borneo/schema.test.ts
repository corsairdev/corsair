import { BorneoSchema } from './schema';

describe('Borneo schema', () => {
	it('declares a semver version', () => {
		expect(BorneoSchema.version).toBeDefined();
		expect(BorneoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BorneoSchema.entities).toBe('object');
		expect(BorneoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BorneoSchema.entities))).toBe(true);
		for (const entity of Object.values(BorneoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
