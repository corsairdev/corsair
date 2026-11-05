import { SerpapiSchema } from './schema';

describe('Serpapi schema', () => {
	it('declares a semver version', () => {
		expect(SerpapiSchema.version).toBeDefined();
		expect(SerpapiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	/**
	 * Zero entities, deliberately: every one of the 48 operations is a live
	 * search or lookup against a third-party engine's current results, not a
	 * record with a durable identity worth caching (see `schema/database.ts`).
	 */
	it('declares an empty entities map', () => {
		expect(typeof SerpapiSchema.entities).toBe('object');
		expect(SerpapiSchema.entities).not.toBeNull();
		expect(Object.keys(SerpapiSchema.entities)).toEqual([]);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
