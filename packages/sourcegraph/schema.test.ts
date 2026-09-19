import { SourcegraphSchema } from './schema';

describe('Sourcegraph schema', () => {
	it('declares a semver version', () => {
		expect(SourcegraphSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares labeled GraphQL entities', () => {
		expect(Object.keys(SourcegraphSchema.entities).sort()).toEqual([
			'commits',
			'files',
			'repositories',
			'sites',
			'users',
		]);
	});
});
