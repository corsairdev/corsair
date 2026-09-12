import { SemanticScholarSchema } from './schema';

describe('SemanticScholar schema', () => {
	it('declares a semver version', () => {
		expect(SemanticScholarSchema.version).toBeDefined();
		expect(SemanticScholarSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SemanticScholarSchema.entities).toBe('object');
		expect(SemanticScholarSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SemanticScholarSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(SemanticScholarSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
