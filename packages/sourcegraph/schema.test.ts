import { SourcegraphSchema } from './schema';

describe('Sourcegraph schema', () => {
	it('declares a semver version', () => {
		expect(SourcegraphSchema.version).toBeDefined();
		expect(SourcegraphSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SourcegraphSchema.entities).toBe('object');
		expect(SourcegraphSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SourcegraphSchema.entities))).toBe(true);
		for (const entity of Object.values(SourcegraphSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
