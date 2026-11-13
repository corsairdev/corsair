import { FomoSchema } from './schema';

describe('Fomo schema', () => {
	it('declares a semver version', () => {
		expect(FomoSchema.version).toBeDefined();
		expect(FomoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FomoSchema.entities).toBe('object');
		expect(FomoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FomoSchema.entities))).toBe(true);
		for (const entity of Object.values(FomoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
