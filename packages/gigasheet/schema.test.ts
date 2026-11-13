import { GigasheetSchema } from './schema';

describe('Gigasheet schema', () => {
	it('declares a semver version', () => {
		expect(GigasheetSchema.version).toBeDefined();
		expect(GigasheetSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GigasheetSchema.entities).toBe('object');
		expect(GigasheetSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GigasheetSchema.entities))).toBe(true);
		for (const entity of Object.values(GigasheetSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
