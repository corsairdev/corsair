import { DeskTimeSchema } from './schema';

describe('Desktime schema', () => {
	it('declares a semver version', () => {
		expect(DeskTimeSchema.version).toBeDefined();
		expect(DeskTimeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map that is a plain object, not an array', () => {
		expect(typeof DeskTimeSchema.entities).toBe('object');
		expect(DeskTimeSchema.entities).not.toBeNull();
		// Checking Object.keys() would always be an array and so could never fail;
		// assert on the entities value itself.
		expect(Array.isArray(DeskTimeSchema.entities)).toBe(false);
		expect(DeskTimeSchema.entities).toEqual({});
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
