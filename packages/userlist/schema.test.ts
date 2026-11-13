import { UserlistSchema } from './schema';

describe('Userlist schema', () => {
	it('declares a semver version', () => {
		expect(UserlistSchema.version).toBeDefined();
		expect(UserlistSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UserlistSchema.entities).toBe('object');
		expect(UserlistSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UserlistSchema.entities))).toBe(true);
		for (const entity of Object.values(UserlistSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since the Push API cannot read anything back', () => {
		// Every call is a write that is queued rather than applied, and there is
		// no endpoint to read a user or a company, so a cached copy could never
		// be checked or refreshed.
		expect(Object.keys(UserlistSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
