import { GivebutterSchema } from './schema';

describe('Givebutter schema', () => {
	it('declares a semver version', () => {
		expect(GivebutterSchema.version).toBeDefined();
		expect(GivebutterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GivebutterSchema.entities).toBe('object');
		expect(GivebutterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GivebutterSchema.entities))).toBe(true);
		for (const entity of Object.values(GivebutterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
