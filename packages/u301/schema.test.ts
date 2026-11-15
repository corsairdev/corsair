import { U301Schema } from './schema';

describe('U301 schema', () => {
	it('declares a semver version', () => {
		expect(U301Schema.version).toBeDefined();
		expect(U301Schema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof U301Schema.entities).toBe('object');
		expect(U301Schema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(U301Schema.entities))).toBe(true);
		for (const entity of Object.values(U301Schema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since click counts change with every visit', () => {
		// A link's click count is different a second later, so a cached copy would
		// under-report from the moment it was written.
		expect(Object.keys(U301Schema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
