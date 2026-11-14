import { HelpScoutSchema } from './schema';

describe('HelpScout schema', () => {
	it('declares a semver version', () => {
		expect(HelpScoutSchema.version).toBeDefined();
		expect(HelpScoutSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HelpScoutSchema.entities).toBe('object');
		expect(HelpScoutSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HelpScoutSchema.entities))).toBe(true);
		for (const entity of Object.values(HelpScoutSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
