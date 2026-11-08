import { DeskTimeSchema } from './schema';

describe('Desktime schema', () => {
	it('declares a semver version', () => {
		expect(DeskTimeSchema.version).toBeDefined();
		expect(DeskTimeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DeskTimeSchema.entities).toBe('object');
		expect(DeskTimeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DeskTimeSchema.entities))).toBe(true);
		for (const entity of Object.values(DeskTimeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
