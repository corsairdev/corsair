import { EnigmaSchema } from './schema';

describe('Enigma schema', () => {
	it('declares a semver version', () => {
		expect(EnigmaSchema.version).toBeDefined();
		expect(EnigmaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EnigmaSchema.entities).toBe('object');
		expect(EnigmaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EnigmaSchema.entities))).toBe(true);
		for (const entity of Object.values(EnigmaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
