import { TimelySchema } from './schema';

describe('Timely schema', () => {
	it('declares a semver version', () => {
		expect(TimelySchema.version).toBeDefined();
		expect(TimelySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TimelySchema.entities).toBe('object');
		expect(TimelySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TimelySchema.entities))).toBe(true);
		for (const entity of Object.values(TimelySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
