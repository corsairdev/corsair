import { CountdownApiSchema } from './schema';

describe('CountdownApi schema', () => {
	it('declares a semver version', () => {
		expect(CountdownApiSchema.version).toBeDefined();
		expect(CountdownApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	/**
	 * Zero entities, deliberately: all three operations are live lookups
	 * against eBay's current listings, not records with durable identities
	 * worth caching (see `schema/database.ts`).
	 */
	it('declares an empty entities map', () => {
		expect(Object.keys(CountdownApiSchema.entities)).toEqual([]);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
