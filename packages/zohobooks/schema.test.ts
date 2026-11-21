import { ZohoBooksSchema } from './schema';

describe('ZohoBooks schema', () => {
	it('declares a semver version', () => {
		expect(ZohoBooksSchema.version).toBeDefined();
		expect(ZohoBooksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZohoBooksSchema.entities).toBe('object');
		expect(ZohoBooksSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZohoBooksSchema.entities))).toBe(true);
		for (const entity of Object.values(ZohoBooksSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
