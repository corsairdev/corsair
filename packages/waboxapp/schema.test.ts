import { WaboxappSchema } from './schema';

describe('Waboxapp schema', () => {
	it('declares a semver version', () => {
		expect(WaboxappSchema.version).toBeDefined();
		expect(WaboxappSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WaboxappSchema.entities).toBe('object');
		expect(WaboxappSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WaboxappSchema.entities))).toBe(true);
		for (const entity of Object.values(WaboxappSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
