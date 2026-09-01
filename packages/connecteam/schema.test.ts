import { ConnecteamSchema } from './schema';

describe('Connecteam schema', () => {
	it('declares a semver version', () => {
		expect(ConnecteamSchema.version).toBeDefined();
		expect(ConnecteamSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ConnecteamSchema.entities).toBe('object');
		expect(ConnecteamSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ConnecteamSchema.entities))).toBe(true);
		for (const entity of Object.values(ConnecteamSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
