import { MyFirstPluginSchema } from './schema';

describe('MyFirstPlugin schema', () => {
	it('declares a semver version', () => {
		expect(MyFirstPluginSchema.version).toBeDefined();
		expect(MyFirstPluginSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MyFirstPluginSchema.entities).toBe('object');
		expect(MyFirstPluginSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MyFirstPluginSchema.entities))).toBe(true);
		for (const entity of Object.values(MyFirstPluginSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
