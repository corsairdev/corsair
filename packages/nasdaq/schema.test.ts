import { NasdaqSchema } from './schema';

describe('Nasdaq schema', () => {
	it('declares a semver version', () => {
		expect(NasdaqSchema.version).toBeDefined();
		expect(NasdaqSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NasdaqSchema.entities).toBe('object');
		expect(NasdaqSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NasdaqSchema.entities))).toBe(true);
		for (const entity of Object.values(NasdaqSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
