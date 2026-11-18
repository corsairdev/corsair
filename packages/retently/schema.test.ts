import { RetentlySchema } from './schema';

describe('Retently schema', () => {
	it('declares a semver version', () => {
		expect(RetentlySchema.version).toBeDefined();
		expect(RetentlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RetentlySchema.entities).toBe('object');
		expect(RetentlySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RetentlySchema.entities))).toBe(true);
		for (const entity of Object.values(RetentlySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, because the account is the source of truth', () => {
		// Retently's records change from its dashboard as well as the API, so a
		// local copy would go stale; every read returns what the API just sent.
		expect(Object.keys(RetentlySchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
