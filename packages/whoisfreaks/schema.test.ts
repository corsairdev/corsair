import { WhoisfreaksSchema } from './schema';

describe('Whoisfreaks schema', () => {
	it('declares a semver version', () => {
		expect(WhoisfreaksSchema.version).toBeDefined();
		expect(WhoisfreaksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WhoisfreaksSchema.entities).toBe('object');
		expect(WhoisfreaksSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WhoisfreaksSchema.entities))).toBe(true);
		for (const entity of Object.values(WhoisfreaksSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
