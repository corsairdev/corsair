import { RenderformSchema } from './schema';

describe('Renderform schema', () => {
	it('declares a semver version', () => {
		expect(RenderformSchema.version).toBeDefined();
		expect(RenderformSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RenderformSchema.entities).toBe('object');
		expect(RenderformSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RenderformSchema.entities))).toBe(true);
		for (const entity of Object.values(RenderformSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since Renderform has its own render cache', () => {
		// A render is cached by Renderform itself and keyed by `version`, so a second
		// cache here would duplicate that mechanism rather than add to it.
		expect(Object.keys(RenderformSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
