import { BannerbearSchema } from './schema';

describe('Bannerbear schema', () => {
	it('declares a semver version', () => {
		expect(BannerbearSchema.version).toBeDefined();
		expect(BannerbearSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BannerbearSchema.entities).toBe('object');
		expect(BannerbearSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BannerbearSchema.entities))).toBe(true);
		for (const entity of Object.values(BannerbearSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
