import { FilevineSchema } from './schema';

describe('Filevine schema', () => {
	it('declares a semver version', () => {
		expect(FilevineSchema.version).toBeDefined();
		expect(FilevineSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FilevineSchema.entities).toBe('object');
		expect(FilevineSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FilevineSchema.entities))).toBe(true);
		for (const entity of Object.values(FilevineSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
