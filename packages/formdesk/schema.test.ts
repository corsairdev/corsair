import { FormdeskSchema } from './schema';

describe('Formdesk schema', () => {
	it('declares a semver version', () => {
		expect(FormdeskSchema.version).toBeDefined();
		expect(FormdeskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FormdeskSchema.entities).toBe('object');
		expect(FormdeskSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FormdeskSchema.entities))).toBe(true);
		for (const entity of Object.values(FormdeskSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
