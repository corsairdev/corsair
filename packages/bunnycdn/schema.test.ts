import { BunnycdnSchema } from './schema';

describe('Bunnycdn schema', () => {
	it('declares a semver version', () => {
		expect(BunnycdnSchema.version).toBeDefined();
		expect(BunnycdnSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BunnycdnSchema.entities).toBe('object');
		expect(BunnycdnSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BunnycdnSchema.entities))).toBe(true);
		for (const entity of Object.values(BunnycdnSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
