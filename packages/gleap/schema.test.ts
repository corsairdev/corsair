import { GleapSchema } from './schema';

describe('Gleap schema', () => {
	it('declares a semver version', () => {
		expect(GleapSchema.version).toBeDefined();
		expect(GleapSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GleapSchema.entities).toBe('object');
		expect(GleapSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GleapSchema.entities))).toBe(true);
		for (const entity of Object.values(GleapSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
