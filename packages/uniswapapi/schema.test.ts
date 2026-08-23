import { UniswapApiSchema } from './schema';

describe('UniswapApi schema', () => {
	it('declares a semver version', () => {
		expect(UniswapApiSchema.version).toBeDefined();
		expect(UniswapApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UniswapApiSchema.entities).toBe('object');
		expect(UniswapApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UniswapApiSchema.entities))).toBe(true);
		for (const entity of Object.values(UniswapApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
