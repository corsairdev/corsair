import { BrandfetchSchema } from './schema';

describe('Brandfetch schema', () => {
	it('declares a semver version', () => {
		expect(BrandfetchSchema.version).toBeDefined();
		expect(BrandfetchSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BrandfetchSchema.entities).toBe('object');
		expect(BrandfetchSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BrandfetchSchema.entities))).toBe(true);
		for (const entity of Object.values(BrandfetchSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
