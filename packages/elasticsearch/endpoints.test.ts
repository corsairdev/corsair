import {
	ClusterGetHealthInputSchema,
	ClusterGetHealthResponseSchema,
	DocumentsGetInputSchema,
	DocumentsGetResponseSchema,
	IndicesGetInputSchema,
	IndicesGetResponseSchema,
	IndicesListInputSchema,
	IndicesListResponseSchema,
	SearchRunInputSchema,
	SearchRunResponseSchema,
} from './endpoints/types';
import {
	catIndexRow,
	catIndices,
	clusterHealth,
	documentFound,
	documentMissing,
	indexInfo,
	searchHit,
	searchResponse,
} from './test-fixtures';

describe('cluster.getHealth schemas', () => {
	it('accepts a no-arg call and tolerates harmless extra keys', () => {
		// The call helper parses `input ?? {}`, so callers may pass {} or
		// attach extras; there is no wire body to protect.
		const input = ClusterGetHealthInputSchema.parse({
			anything: 'ignored',
		});
		expect(input).toEqual({});
	});

	it('parses the documented health body', () => {
		const result = ClusterGetHealthResponseSchema.parse(clusterHealth());
		expect(result.status).toBe('green');
		expect(result.cluster_name).toBe('es-test-cluster');
		expect(result.number_of_nodes).toBe(3);
	});

	it('rejects a body missing documented required fields', () => {
		expect(
			ClusterGetHealthResponseSchema.safeParse({
				cluster_name: 'c',
				status: 'green',
			}).success,
		).toBe(false);
	});
});

describe('indices.list schemas', () => {
	it('accepts an empty options object', () => {
		expect(IndicesListInputSchema.parse({})).toEqual({});
	});

	it('accepts a target filter and rejects unknown keys', () => {
		expect(IndicesListInputSchema.parse({ index: 'logs-*' })).toEqual({
			index: 'logs-*',
		});
		expect(
			IndicesListInputSchema.safeParse({ index: 'a', bytes: 'b' }).success,
		).toBe(false);
	});

	it('parses CAT rows, which arrive with every value as a string', () => {
		const result = IndicesListResponseSchema.parse(catIndices());
		expect(result[0]).toMatchObject({
			index: 'logs-2026-11',
			'docs.count': '4201',
		});
	});

	it('accepts an empty cluster as a valid empty array', () => {
		expect(IndicesListResponseSchema.parse([])).toEqual([]);
	});

	it('accepts rows with null doc counts on empty indices', () => {
		const result = IndicesListResponseSchema.parse(
			catIndices([{ ...catIndexRow, 'docs.count': null }]),
		);
		expect(result[0]['docs.count']).toBeNull();
	});
});

describe('indices.get schemas', () => {
	it('requires an index and rejects extras', () => {
		expect(IndicesGetInputSchema.safeParse({}).success).toBe(false);
		expect(IndicesGetInputSchema.safeParse({ index: '' }).success).toBe(false);
		expect(IndicesGetInputSchema.safeParse({ index: 'a', local: true }).success)
			.toBe(false);
	});

	it('parses the index-name-keyed info map', () => {
		const result = IndicesGetResponseSchema.parse(indexInfo);
		expect(result['logs-2026-11']?.settings?.index?.uuid).toBe(
			'AxNuG5LbQs6tS3D4f9C-Rw',
		);
	});
});

describe('search.run input bounds', () => {
	it('requires only an index and defaults from/size per the spec', () => {
		expect(SearchRunInputSchema.parse({ index: 'logs' })).toEqual({
			index: 'logs',
			from: 0,
			size: 10,
		});
	});

	it('accepts size at the documented 10,000 cap and rejects 10,001', () => {
		expect(
			SearchRunInputSchema.safeParse({ index: 'logs', size: 10_000 }).success,
		).toBe(true);
		expect(
			SearchRunInputSchema.safeParse({ index: 'logs', size: 10_001 }).success,
		).toBe(false);
	});

	it('rejects a negative or fractional from/size', () => {
		expect(
			SearchRunInputSchema.safeParse({ index: 'logs', from: -1 }).success,
		).toBe(false);
		expect(
			SearchRunInputSchema.safeParse({ index: 'logs', size: 2.5 }).success,
		).toBe(false);
	});

	it('rejects unknown body keys', () => {
		expect(
			SearchRunInputSchema.safeParse({
				index: 'logs',
				aggregations: {},
			}).success,
		).toBe(false);
	});
});

describe('search.run query subset', () => {
	it('accepts every leaf query kind', () => {
		const leaves = [
			{ match_all: {} },
			{ match: { message: 'disk error' } },
			{ match_phrase: { message: 'disk error' } },
			{ term: { level: 'error' } },
			{ terms: { level: ['error', 'warn'] } },
			{ ids: { values: ['a', 'b'] } },
		];
		for (const query of leaves) {
			expect(
				SearchRunInputSchema.safeParse({ index: 'logs', query }).success,
			).toBe(true);
		}
	});

	it('rejects query kinds outside the typed subset', () => {
		for (const query of [
			{ query_string: { query: 'disk' } },
			{ wildcard: { host: 'es-*' } },
			{ range: { '@timestamp': { gte: 'now-1d' } } },
			{ script: { script: { source: 'true' } } },
		]) {
			expect(
				SearchRunInputSchema.safeParse({ index: 'logs', query }).success,
			).toBe(false);
		}
	});

	it('rejects an empty terms list and empty ids values', () => {
		expect(
			SearchRunInputSchema.safeParse({
				index: 'logs',
				query: { terms: { level: [] } },
			}).success,
		).toBe(false);
		expect(
			SearchRunInputSchema.safeParse({
				index: 'logs',
				query: { ids: { values: [] } },
			}).success,
		).toBe(false);
	});

	it('accepts nested bool clauses and rejects unknown bool keys', () => {
		expect(
			SearchRunInputSchema.safeParse({
				index: 'logs',
				query: {
					bool: {
						must: [{ match: { message: 'disk' } }],
						filter: [
							{
								bool: {
									must_not: { term: { level: 'debug' } },
									minimum_should_match: 1,
								},
							},
						],
					},
				},
			}).success,
		).toBe(true);
		expect(
			SearchRunInputSchema.safeParse({
				index: 'logs',
				query: { bool: { boost: 2 } },
			}).success,
		).toBe(false);
	});
});

describe('search.run output', () => {
	it('parses a full response', () => {
		const result = SearchRunResponseSchema.parse(searchResponse());
		expect(result.hits.hits[0]?._source).toEqual(searchHit._source);
		expect(result.hits.total).toEqual({ value: 1, relation: 'eq' });
	});

	it('accepts zero hits as a valid result', () => {
		const result = SearchRunResponseSchema.parse(searchResponse([], { value: 0, relation: 'eq' }));
		expect(result.hits.hits).toEqual([]);
		expect(result.hits.max_score).toBeNull();
	});

	it('accepts hits.total as a plain number (rest_total_hits_as_int)', () => {
		const result = SearchRunResponseSchema.parse(searchResponse([], 0));
		expect(result.hits.total).toBe(0);
	});
});

describe('documents.get schemas', () => {
	it('requires both index and id', () => {
		expect(DocumentsGetInputSchema.safeParse({ index: 'logs' }).success).toBe(
			false,
		);
		expect(
			DocumentsGetInputSchema.safeParse({ index: 'logs', id: '  ' }).success,
		).toBe(false);
	});

	it('parses a found document', () => {
		const result = DocumentsGetResponseSchema.parse(documentFound);
		expect(result.found).toBe(true);
		expect(result._source).toEqual(documentFound._source);
	});

	it('parses the documented 404 body with found: false', () => {
		const result = DocumentsGetResponseSchema.parse(documentMissing);
		expect(result.found).toBe(false);
		expect(result._source).toBeUndefined();
	});
});
