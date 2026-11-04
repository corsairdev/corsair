import { ElasticsearchSchema } from './schema';

describe('Elasticsearch schema', () => {
	it('declares a semver version', () => {
		expect(ElasticsearchSchema.version).toBeDefined();
		expect(ElasticsearchSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('persists nothing: the entities registry is empty', () => {
		// Read-only plugin; every call fetches live cluster state.
		expect(ElasticsearchSchema.entities).toEqual({});
	});
});
