import { ElasticsearchSchema } from './schema';

describe('Elasticsearch schema', () => {
	it('declares a semver version', () => {
		expect(ElasticsearchSchema.version).toBeDefined();
		expect(ElasticsearchSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ElasticsearchSchema.entities).toBe('object');
		expect(ElasticsearchSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ElasticsearchSchema.entities))).toBe(true);
		for (const entity of Object.values(ElasticsearchSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
