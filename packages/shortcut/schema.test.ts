import { ShortcutSchema } from './schema';

describe('Shortcut schema', () => {
	it('declares a semver version', () => {
		expect(ShortcutSchema.version).toBeDefined();
		expect(ShortcutSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ShortcutSchema.entities).toBe('object');
		expect(ShortcutSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ShortcutSchema.entities))).toBe(true);
		for (const entity of Object.values(ShortcutSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
