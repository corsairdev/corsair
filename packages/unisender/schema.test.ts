import { UnisenderSchema } from './schema';

describe('Unisender schema', () => {
	it('declares a semver version', () => {
		expect(UnisenderSchema.version).toBeDefined();
		expect(UnisenderSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UnisenderSchema.entities).toBe('object');
		expect(UnisenderSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UnisenderSchema.entities))).toBe(true);
		for (const entity of Object.values(UnisenderSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a contact status changes on confirmation', () => {
		// A contact moves from invited to active when they open a confirmation email,
		// and a campaign's status changes as it sends, so a copy would misstate both.
		expect(Object.keys(UnisenderSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
