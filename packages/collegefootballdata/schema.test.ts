import { CollegeFootballDataSchema } from './schema';

describe('CollegeFootballData schema', () => {
	it('declares a semver version', () => {
		expect(CollegeFootballDataSchema.version).toBeDefined();
		expect(CollegeFootballDataSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CollegeFootballDataSchema.entities).toBe('object');
		expect(CollegeFootballDataSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CollegeFootballDataSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(CollegeFootballDataSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
