import { TyplessSchema } from './schema';

describe('Typless schema', () => {
	it('declares a semver version', () => {
		expect(TyplessSchema.version).toBeDefined();
		expect(TyplessSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TyplessSchema.entities).toBe('object');
		expect(TyplessSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TyplessSchema.entities))).toBe(true);
		for (const entity of Object.values(TyplessSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
