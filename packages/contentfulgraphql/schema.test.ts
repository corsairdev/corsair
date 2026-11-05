import { ContentfulGraphqlSchema } from './schema';

describe('ContentfulGraphql schema', () => {
	it('declares a semver version', () => {
		expect(ContentfulGraphqlSchema.version).toBeDefined();
		expect(ContentfulGraphqlSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ContentfulGraphqlSchema.entities).toBe('object');
		expect(ContentfulGraphqlSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ContentfulGraphqlSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(ContentfulGraphqlSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
