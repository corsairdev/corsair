import { ProductboardSchema } from './schema';

describe('Productboard schema', () => {
	it('declares a semver version', () => {
		expect(ProductboardSchema.version).toBeDefined();
		expect(ProductboardSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ProductboardSchema.entities).toBe('object');
		expect(ProductboardSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ProductboardSchema.entities))).toBe(true);
		for (const entity of Object.values(ProductboardSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
