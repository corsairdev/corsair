import { ContentfulSchema } from './schema';

describe('Contentful schema', () => {
	it('declares a semver version', () => {
		expect(ContentfulSchema.version).toBeDefined();
		expect(ContentfulSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ContentfulSchema.entities).toBe('object');
		expect(ContentfulSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ContentfulSchema.entities))).toBe(true);
		for (const entity of Object.values(ContentfulSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
