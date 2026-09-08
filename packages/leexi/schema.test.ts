import { LeexiSchema } from './schema';

describe('Leexi schema', () => {
	it('declares a semver version', () => {
		expect(LeexiSchema.version).toBeDefined();
		expect(LeexiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LeexiSchema.entities).toBe('object');
		expect(LeexiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LeexiSchema.entities))).toBe(true);
		for (const entity of Object.values(LeexiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
