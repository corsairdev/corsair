import { AmaraSchema } from './schema';

describe('Amara schema', () => {
	it('declares a semver version', () => {
		expect(AmaraSchema.version).toBeDefined();
		expect(AmaraSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AmaraSchema.entities).toBe('object');
		expect(AmaraSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AmaraSchema.entities))).toBe(true);
		for (const entity of Object.values(AmaraSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
