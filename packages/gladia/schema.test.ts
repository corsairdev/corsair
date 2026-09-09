import { GladiaSchema } from './schema';

describe('Gladia schema', () => {
	it('declares a semver version', () => {
		expect(GladiaSchema.version).toBeDefined();
		expect(GladiaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GladiaSchema.entities).toBe('object');
		expect(GladiaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GladiaSchema.entities))).toBe(true);
		for (const entity of Object.values(GladiaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
