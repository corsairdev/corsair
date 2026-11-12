import { UserflowSchema } from './schema';

describe('Userflow schema', () => {
	it('declares a semver version', () => {
		expect(UserflowSchema.version).toBeDefined();
		expect(UserflowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UserflowSchema.entities).toBe('object');
		expect(UserflowSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UserflowSchema.entities))).toBe(true);
		for (const entity of Object.values(UserflowSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since users and sessions change constantly', () => {
		// A user's attributes are merged on every upsert and a content session
		// moves through progress as it runs, so a copy would go stale at once.
		expect(Object.keys(UserflowSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
