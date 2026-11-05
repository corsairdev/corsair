import { logEventFromContext } from 'corsair/core';
import { Documents, Search } from './endpoints';
import {
	ClusterGetHealthInputSchema,
	ClusterGetHealthResponseSchema,
	DocumentsBulkInputSchema,
	DocumentsDeleteByQueryInputSchema,
	DocumentsGetInputSchema,
	DocumentsGetResponseSchema,
	DocumentsIndexInputSchema,
	DocumentsMgetInputSchema,
	DocumentsMtermvectorsInputSchema,
	DocumentsUpdateInputSchema,
	IndicesGetInputSchema,
	IndicesGetResponseSchema,
	IndicesListInputSchema,
	IndicesListResponseSchema,
	SearchRunInputSchema,
	SearchRunResponseSchema,
} from './endpoints/types';
import {
	bulkResponse,
	byScrollResponse,
	catIndexRow,
	catIndices,
	clusterHealth,
	documentFound,
	documentMissing,
	existsFalse,
	existsTrue,
	explainResponse,
	indexInfo,
	mgetResponse,
	mtermvectorsResponse,
	searchHit,
	searchResponse,
	termvectorsResult,
	updateResponse,
	writeResponse,
	writeResponseNotFound,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

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
		const result = ClusterGetHealthResponseSchema.parse(clusterHealth);
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
		expect(result[0]?.['docs.count']).toBeNull();
	});
});

describe('indices.get schemas', () => {
	it('requires an index and rejects extras', () => {
		expect(IndicesGetInputSchema.safeParse({}).success).toBe(false);
		expect(IndicesGetInputSchema.safeParse({ index: '' }).success).toBe(false);
		expect(
			IndicesGetInputSchema.safeParse({ index: 'a', local: true }).success,
		).toBe(false);
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
		const result = SearchRunResponseSchema.parse(
			searchResponse([], { value: 0, relation: 'eq' }),
		);
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

describe('search.run logging', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('logs identifiers and counts only, never search terms or documents', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(searchResponse()), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		// The fake context carries only what call() reads: the solo-mode
		// options and the resolved Authorization header.
		await Search.run(
			{
				options: { baseUrl: 'http://es:9200' },
				key: 'ApiKey encoded-key',
			} as never,
			{
				index: 'logs-*',
				size: 5,
				query: { match: { message: 'S3CRET-DISK-TERM' } },
			},
		);

		expect(mockLog).toHaveBeenCalledTimes(1);
		const payload = mockLog.mock.calls[0]?.[2];
		expect(payload).toEqual({
			operation: 'search.run',
			index: 'logs-*',
			id: undefined,
			found: undefined,
			exists: undefined,
			hitCount: 1,
		});
		expect(JSON.stringify(payload)).not.toContain('S3CRET-DISK-TERM');
		expect(JSON.stringify(payload)).not.toContain(searchHit._source?.message);
	});
});

// ── documents input schemas ──────────────────────────────────────────────────

describe('documents write input bounds', () => {
	it('requires the document body on index and create', () => {
		expect(
			DocumentsIndexInputSchema.safeParse({ index: 'logs', id: '1' }).success,
		).toBe(false);
		expect(
			DocumentsIndexInputSchema.safeParse({
				index: 'logs',
				id: '1',
				document: { a: 1 },
			}).success,
		).toBe(true);
	});

	it('rejects an unknown op_type', () => {
		expect(
			DocumentsIndexInputSchema.safeParse({
				index: 'logs',
				id: '1',
				document: {},
				op_type: 'upsert',
			}).success,
		).toBe(false);
	});

	it('accepts refresh true/false/wait_for and rejects other strings', () => {
		for (const refresh of [true, false, 'wait_for']) {
			expect(
				DocumentsIndexInputSchema.safeParse({
					index: 'logs',
					id: '1',
					document: {},
					refresh,
				}).success,
			).toBe(true);
		}
		expect(
			DocumentsIndexInputSchema.safeParse({
				index: 'logs',
				id: '1',
				document: {},
				refresh: 'later',
			}).success,
		).toBe(false);
	});

	it('bounds if_seq_no to non-negative integers', () => {
		expect(
			DocumentsIndexInputSchema.safeParse({
				index: 'logs',
				id: '1',
				document: {},
				if_seq_no: -1,
			}).success,
		).toBe(false);
		expect(
			DocumentsIndexInputSchema.safeParse({
				index: 'logs',
				id: '1',
				document: {},
				if_seq_no: 1.5,
			}).success,
		).toBe(false);
	});

	it('accepts wait_for_active_shards as all, index-setting or a count', () => {
		for (const wait_for_active_shards of ['all', 'index-setting', 2]) {
			expect(
				DocumentsIndexInputSchema.safeParse({
					index: 'logs',
					id: '1',
					document: {},
					wait_for_active_shards,
				}).success,
			).toBe(true);
		}
		expect(
			DocumentsIndexInputSchema.safeParse({
				index: 'logs',
				id: '1',
				document: {},
				wait_for_active_shards: 0,
			}).success,
		).toBe(false);
	});
});

describe('documents.update XOR and script rules', () => {
	const base = { index: 'logs', id: '1' } as const;

	it('requires exactly one of doc or script', () => {
		expect(DocumentsUpdateInputSchema.safeParse({ ...base }).success).toBe(
			false,
		);
		expect(
			DocumentsUpdateInputSchema.safeParse({
				...base,
				doc: { level: 'warn' },
				script: { source: 'ctx._source.level=1' },
			}).success,
		).toBe(false);
		expect(
			DocumentsUpdateInputSchema.safeParse({ ...base, doc: { level: 'warn' } })
				.success,
		).toBe(true);
		expect(
			DocumentsUpdateInputSchema.safeParse({
				...base,
				script: { source: 'ctx._source.level=1' },
			}).success,
		).toBe(true);
	});

	it('rejects a script with neither source nor id', () => {
		expect(
			DocumentsUpdateInputSchema.safeParse({
				...base,
				script: { lang: 'painless' },
			}).success,
		).toBe(false);
		expect(
			DocumentsUpdateInputSchema.safeParse({
				...base,
				script: { id: 'stored-script' },
			}).success,
		).toBe(true);
	});
});

describe('documents deleteByQuery safety', () => {
	it('requires an explicit query', () => {
		expect(
			DocumentsDeleteByQueryInputSchema.safeParse({ index: 'logs' }).success,
		).toBe(false);
		expect(
			DocumentsDeleteByQueryInputSchema.safeParse({
				index: 'logs',
				query: { match_all: {} },
			}).success,
		).toBe(true);
	});

	it('bounds conflicts to abort|proceed and slices to auto|count', () => {
		expect(
			DocumentsDeleteByQueryInputSchema.safeParse({
				index: 'logs',
				query: { match_all: {} },
				conflicts: 'ignore',
			}).success,
		).toBe(false);
		expect(
			DocumentsDeleteByQueryInputSchema.safeParse({
				index: 'logs',
				query: { match_all: {} },
				slices: -1,
			}).success,
		).toBe(false);
		expect(
			DocumentsDeleteByQueryInputSchema.safeParse({
				index: 'logs',
				query: { match_all: {} },
				conflicts: 'proceed',
				slices: 'auto',
			}).success,
		).toBe(true);
	});
});

describe('documents mget/mtermvectors XOR', () => {
	it('requires exactly one of ids or docs', () => {
		expect(DocumentsMgetInputSchema.safeParse({ index: 'logs' }).success).toBe(
			false,
		);
		expect(
			DocumentsMgetInputSchema.safeParse({
				index: 'logs',
				ids: ['a'],
				docs: [{ _id: 'b' }],
			}).success,
		).toBe(false);
		expect(
			DocumentsMgetInputSchema.safeParse({ index: 'logs', ids: ['a'] }).success,
		).toBe(true);
		expect(
			DocumentsMgetInputSchema.safeParse({
				index: 'logs',
				docs: [{ _index: 'other', _id: 'b' }],
			}).success,
		).toBe(true);
		expect(
			DocumentsMgetInputSchema.safeParse({
				index: 'logs',
				docs: [{ _index: 'other' }],
			}).success,
		).toBe(false);
	});

	it('applies the same rule to mtermvectors', () => {
		expect(
			DocumentsMtermvectorsInputSchema.safeParse({ index: 'logs' }).success,
		).toBe(false);
		expect(
			DocumentsMtermvectorsInputSchema.safeParse({
				index: 'logs',
				ids: ['a', 'b'],
			}).success,
		).toBe(true);
	});
});

describe('documents bulk input', () => {
	const operations = [
		{ action: 'index', _id: '1', document: { level: 'error' } },
		{ action: 'create', _id: '2', document: { level: 'warn' } },
		{ action: 'update', _id: '1', doc: { level: 'info' } },
		{ action: 'delete', _id: '3' },
	] as const;

	it('accepts typed operations or raw ndjson, never both or neither', () => {
		expect(DocumentsBulkInputSchema.safeParse({ index: 'logs' }).success).toBe(
			false,
		);
		expect(
			DocumentsBulkInputSchema.safeParse({
				index: 'logs',
				operations,
				ndjson: '{}\n',
			}).success,
		).toBe(false);
		expect(
			DocumentsBulkInputSchema.safeParse({ index: 'logs', operations }).success,
		).toBe(true);
	});

	it('rejects malformed ndjson: missing terminator or bad JSON line', () => {
		expect(
			DocumentsBulkInputSchema.safeParse({
				index: 'logs',
				ndjson: '{"index":{"_id":"1"}}\n{"a":1}',
			}).success,
		).toBe(false);
		expect(
			DocumentsBulkInputSchema.safeParse({
				index: 'logs',
				ndjson: '{"index":{"_id":"1"}} not-json\n',
			}).success,
		).toBe(false);
		expect(
			DocumentsBulkInputSchema.safeParse({
				index: 'logs',
				ndjson: '{"index":{"_id":"1"}}\n{"a":1}\n',
			}).success,
		).toBe(true);
	});

	it('rejects unknown actions and create/update/delete without _id', () => {
		expect(
			DocumentsBulkInputSchema.safeParse({
				index: 'logs',
				operations: [{ action: 'upsert', _id: '1' }],
			}).success,
		).toBe(false);
		expect(
			DocumentsBulkInputSchema.safeParse({
				index: 'logs',
				operations: [{ action: 'delete' }],
			}).success,
		).toBe(false);
	});
});

// ── documents output schemas ─────────────────────────────────────────────────

describe('documents output schemas', () => {
	it('parses a write response with shard statistics', () => {
		const result = SearchRunResponseSchema.safeParse(searchResponse());
		expect(result.success).toBe(true); // fixture sanity
		expect(writeResponse.result).toBe('created');
		expect(writeResponse._shards.total).toBe(2);
	});

	it('parses an update response carrying an inline get', () => {
		expect(updateResponse.get?.found).toBe(true);
		expect(updateResponse.get?._source).toEqual(updateResponse.get?._source);
	});

	it('keeps by-scroll failures typed per item', () => {
		const failed = byScrollResponse({
			updated: 0,
			failures: [
				{
					index: 'logs-2026-11',
					id: '1',
					status: 409,
					cause: { type: 'version_conflict_engine_exception' },
				},
			],
		});
		expect(failed.failures?.[0]?.cause?.type).toBe(
			'version_conflict_engine_exception',
		);
	});

	it('accepts empty bulk items and empty mget docs', () => {
		expect(bulkResponse.errors).toBe(false);
		expect(bulkResponse.items).toHaveLength(2);
		expect(mgetResponse.docs).toHaveLength(3);
		expect(existsTrue.exists).toBe(true);
		expect(existsFalse.exists).toBe(false);
		expect(termvectorsResult.found).toBe(true);
		expect(mtermvectorsResponse.docs).toHaveLength(1);
		expect(explainResponse.matched).toBe(true);
		expect(writeResponseNotFound.result).toBe('not_found');
	});
});

// ── documents wire assertions (every documents op sends what the spec says) ──

describe('documents wire calls', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	// The fake context carries only what call() reads.
	const ctx = {
		options: { baseUrl: 'http://es:9200' },
		key: 'ApiKey encoded-key',
	} as never;

	function mockJson(body: unknown, status = 200) {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	}

	function mockEmpty(status: number) {
		fetchMock.mockResolvedValueOnce(new Response(null, { status }));
	}

	async function sent() {
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		return { url, init };
	}

	it('documents.exists HEADs the doc path and resolves 200 to exists: true', async () => {
		mockEmpty(200);
		const result = await Documents.exists(ctx, {
			index: 'logs-2026-11',
			id: 'a b',
		});
		expect(result).toEqual({ exists: true });
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_doc/a%20b');
		expect(init.method).toBe('HEAD');
		expect(init.body).toBeUndefined();
	});

	it('documents.exists resolves a 404 to exists: false without throwing', async () => {
		mockEmpty(404);
		const result = await Documents.exists(ctx, { index: 'logs', id: 'x' });
		expect(result).toEqual({ exists: false });
		await sent();
	});

	it('documents.exists throws on a 401', async () => {
		mockJson({ error: { type: 'security_exception' }, status: 401 }, 401);
		await expect(
			Documents.exists(ctx, { index: 'logs', id: 'x' }),
		).rejects.toMatchObject({ status: 401 });
	});

	it('documents.index POSTs the document as the JSON body with query params', async () => {
		mockJson(writeResponse);
		const result = await Documents.index(ctx, {
			index: 'logs-2026-11',
			id: '1',
			document: { level: 'error', message: 'disk' },
			refresh: 'wait_for',
			op_type: 'create',
			if_seq_no: 5,
			if_primary_term: 1,
		});
		expect(result.result).toBe('created');
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_doc/1?refresh=wait_for&if_seq_no=5&if_primary_term=1&op_type=create',
		);
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			level: 'error',
			message: 'disk',
		});
	});

	it('documents.create POSTs to _create/{id}', async () => {
		mockJson(writeResponse);
		await Documents.create(ctx, {
			index: 'logs-2026-11',
			id: '2',
			document: { level: 'warn' },
			refresh: true,
		});
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_create/2?refresh=true');
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({ level: 'warn' });
	});

	it('documents.update POSTs doc/script fields and keeps params in the query', async () => {
		mockJson(updateResponse);
		const result = await Documents.update(ctx, {
			index: 'logs-2026-11',
			id: '1',
			doc: { level: 'info' },
			refresh: false,
			retry_on_conflict: 3,
		});
		expect(result.get?.found).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_update/1?refresh=false&retry_on_conflict=3',
		);
		expect(JSON.parse(String(init.body))).toEqual({ doc: { level: 'info' } });
	});

	it('documents.delete DELETEs and treats result not_found 404s as a result', async () => {
		mockJson(writeResponseNotFound, 404);
		const result = await Documents.remove(ctx, {
			index: 'logs-2026-11',
			id: 'gone',
		});
		expect(result.result).toBe('not_found');
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_doc/gone');
		expect(init.method).toBe('DELETE');
		expect(init.body).toBeUndefined();
	});

	it('documents.updateByQuery sends only body fields in the body', async () => {
		mockJson(byScrollResponse({ updated: 4 }));
		const result = await Documents.updateByQuery(ctx, {
			index: 'logs-*',
			query: { term: { level: 'debug' } },
			script: { source: 'ctx._source.level=1' },
			wait_for_completion: false,
			slices: 'auto',
		});
		expect(result.updated).toBe(4);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-*/_update_by_query?wait_for_completion=false&slices=auto',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			query: { term: { level: 'debug' } },
			script: { source: 'ctx._source.level=1' },
		});
	});

	it('documents.deleteByQuery posts the mandatory query', async () => {
		mockJson(byScrollResponse({ updated: 0, deleted: 9 }));
		const ok = await Documents.deleteByQuery(ctx, {
			index: 'logs-2026-11',
			query: { term: { level: 'debug' } },
			max_docs: 100,
		});
		expect(ok.deleted).toBe(9);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_delete_by_query');
		expect(JSON.parse(String(init.body))).toEqual({
			query: { term: { level: 'debug' } },
			max_docs: 100,
		});
	});

	it('documents.mget posts ids under the path index', async () => {
		mockJson(mgetResponse);
		const result = await Documents.mget(ctx, {
			index: 'logs-2026-11',
			ids: ['a', 'b'],
		});
		expect(result.docs).toHaveLength(3);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_mget');
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({ ids: ['a', 'b'] });
	});

	it('documents.mget posts explicit docs entries instead', async () => {
		mockJson({ docs: [documentFound] });
		await Documents.mget(ctx, {
			index: 'logs-2026-11',
			docs: [{ _index: 'other-index', _id: 'x' }],
		});
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_mget');
		expect(JSON.parse(String(init.body))).toEqual({
			docs: [{ _index: 'other-index', _id: 'x' }],
		});
	});

	it('documents.getSource GETs the raw source', async () => {
		mockJson(documentFound._source);
		const result = await Documents.getSource(ctx, {
			index: 'logs-2026-11',
			id: 'tZ0GinMB6Y5qFuDylF8J',
		});
		expect(result).toEqual(documentFound._source);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_source/tZ0GinMB6Y5qFuDylF8J',
		);
		expect(init.method).toBe('GET');
	});

	it('documents.existsSource HEADs and resolves the status', async () => {
		mockEmpty(404);
		const result = await Documents.existsSource(ctx, {
			index: 'logs-2026-11',
			id: '1',
		});
		expect(result).toEqual({ exists: false });
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_source/1');
		expect(init.method).toBe('HEAD');
	});

	it('documents.explain posts the query body', async () => {
		mockJson(explainResponse);
		const result = await Documents.explain(ctx, {
			index: 'logs-2026-11',
			id: '1',
			query: { match: { message: 'disk' } },
		});
		expect(result.matched).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_explain/1');
		expect(JSON.parse(String(init.body))).toEqual({
			query: { match: { message: 'disk' } },
		});
	});

	it('documents.termvectors sends flags and the comma-joined field list', async () => {
		mockJson(termvectorsResult);
		const result = await Documents.termvectors(ctx, {
			index: 'logs-2026-11',
			id: '1',
			fields: ['message', 'level'],
			term_statistics: true,
		});
		expect(result.found).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_termvectors/1?term_statistics=true&fields=message%2Clevel',
		);
		expect(init.method).toBe('POST');
		expect(init.body).toBeUndefined();
	});

	it('documents.mtermvectors posts ids in the body', async () => {
		mockJson(mtermvectorsResponse);
		const result = await Documents.mtermvectors(ctx, {
			index: 'logs-2026-11',
			ids: ['a', 'b'],
			positions: false,
		});
		expect(result.docs).toHaveLength(1);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_mtermvectors?positions=false',
		);
		expect(JSON.parse(String(init.body))).toEqual({ ids: ['a', 'b'] });
	});

	it('documents.bulk PUTs serialized ndjson operations with x-ndjson content type', async () => {
		mockJson(bulkResponse);
		const result = await Documents.bulk(ctx, {
			index: 'logs-2026-11',
			operations: [
				{ action: 'index', document: { level: 'error' } },
				{ action: 'delete', _id: '3' },
			],
			refresh: true,
		});
		expect(result.errors).toBe(false);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_bulk?refresh=true');
		expect(init.method).toBe('PUT');
		expect(init.body).toBe(
			'{"index":{}}\n{"level":"error"}\n{"delete":{"_id":"3"}}\n',
		);
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/x-ndjson',
		);
	});

	it('documents.bulk passes a raw ndjson payload through verbatim', async () => {
		mockJson(bulkResponse);
		const ndjson = '{"index":{"_id":"9"}}\n{"a":1}\n';
		await Documents.bulk(ctx, { index: 'logs', ndjson });
		const { init } = await sent();
		expect(init.body).toBe(ndjson);
	});
});
