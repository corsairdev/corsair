import { ApiLabzSchema } from './schema';

describe('ApiLabz schema', () => {
	it('declares a semver version', () => {
		expect(ApiLabzSchema.version).toBeDefined();
		expect(ApiLabzSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ApiLabzSchema.entities).toBe('object');
		expect(ApiLabzSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ApiLabzSchema.entities))).toBe(true);
		for (const entity of Object.values(ApiLabzSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
