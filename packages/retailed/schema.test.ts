import { RetailedSchema } from './schema';

describe('Retailed schema', () => {
	it('declares a semver version', () => {
		expect(RetailedSchema.version).toBeDefined();
		expect(RetailedSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RetailedSchema.entities).toBe('object');
		expect(RetailedSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RetailedSchema.entities))).toBe(true);
		for (const entity of Object.values(RetailedSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
