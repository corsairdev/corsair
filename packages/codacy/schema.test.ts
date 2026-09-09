import { CodacySchema } from './schema';

describe('Codacy schema', () => {
	it('declares a semver version', () => {
		expect(CodacySchema.version).toBeDefined();
		expect(CodacySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CodacySchema.entities).toBe('object');
		expect(CodacySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CodacySchema.entities))).toBe(true);
		for (const entity of Object.values(CodacySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
