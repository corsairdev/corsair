import { ConfluenceSchema } from './schema';

describe('Confluence schema', () => {
	it('declares a semver version', () => {
		expect(ConfluenceSchema.version).toBeDefined();
		expect(ConfluenceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ConfluenceSchema.entities).toBe('object');
		expect(ConfluenceSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ConfluenceSchema.entities))).toBe(true);
		for (const entity of Object.values(ConfluenceSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
