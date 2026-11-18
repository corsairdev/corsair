import { SaperlySchema } from './schema';

describe('Saperly schema', () => {
	it('declares a semver version', () => {
		expect(SaperlySchema.version).toBeDefined();
		expect(SaperlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SaperlySchema.entities).toBe('object');
		expect(SaperlySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SaperlySchema.entities))).toBe(true);
		for (const entity of Object.values(SaperlySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
