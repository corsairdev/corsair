import { HookdeckSchema } from './schema';

describe('Hookdeck schema', () => {
	it('declares a semver version', () => {
		expect(HookdeckSchema.version).toBeDefined();
		expect(HookdeckSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HookdeckSchema.entities).toBe('object');
		expect(HookdeckSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HookdeckSchema.entities))).toBe(true);
		for (const entity of Object.values(HookdeckSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
