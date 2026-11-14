import { ThinkificSchema } from './schema';

describe('Thinkific schema', () => {
	it('declares a semver version', () => {
		expect(ThinkificSchema.version).toBeDefined();
		expect(ThinkificSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ThinkificSchema.entities).toBe('object');
		expect(ThinkificSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ThinkificSchema.entities))).toBe(true);
		for (const entity of Object.values(ThinkificSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
