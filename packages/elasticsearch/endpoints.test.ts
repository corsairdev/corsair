import { logEventFromContext } from 'corsair/core';
import {
	Cat,
	Ccr,
	Cluster,
	Documents,
	Fleet,
	Indices,
	Nodes,
	Search,
	Tasks,
} from './endpoints';
import {
	CcrForgetFollowerInputSchema,
	ClusterAddVotingConfigExclusionsInputSchema,
	ClusterGetHealthInputSchema,
	ClusterGetHealthResponseSchema,
	ClusterRerouteInputSchema,
	ClusterSubsystemInfoInputSchema,
	DocumentsBulkInputSchema,
	DocumentsDeleteByQueryInputSchema,
	DocumentsGetInputSchema,
	DocumentsGetResponseSchema,
	DocumentsIndexInputSchema,
	DocumentsMgetInputSchema,
	DocumentsMtermvectorsInputSchema,
	DocumentsUpdateInputSchema,
	IndicesAddBlockInputSchema,
	IndicesAnalyzeInputSchema,
	IndicesDiskUsageInputSchema,
	IndicesDownsampleInputSchema,
	IndicesForceMergeInputSchema,
	IndicesGetInputSchema,
	IndicesGetResponseSchema,
	IndicesListInputSchema,
	IndicesListResponseSchema,
	IndicesPutMappingInputSchema,
	IndicesPutSettingsInputSchema,
	IndicesStatsInputSchema,
	NodesHotThreadsInputSchema,
	NodesStatsInputSchema,
	SearchMsearchInputSchema,
	SearchRunInputSchema,
	SearchRunResponseSchema,
	SearchTemplateInputSchema,
	SearchVectorTileInputSchema,
	TasksListInputSchema,
} from './endpoints/types';
import {
	acknowledgedResponse,
	bulkResponse,
	byScrollResponse,
	catAliasesRows,
	catAllocationRows,
	catCircuitBreakersRows,
	catComponentTemplatesRows,
	catCountRows,
	catFielddataRows,
	catHealthRows,
	catHelpText,
	catIndexRow,
	catIndices,
	catMasterRows,
	catMlDataFrameAnalyticsRows,
	catMlDatafeedsRows,
	catMlJobsRows,
	catMlTrainedModelsRows,
	catNodeattrsRows,
	catNodesRows,
	catPendingTasksRows,
	catPluginsRows,
	catRecoveryRows,
	catRepositoriesRows,
	catSegmentsRows,
	catShardsRows,
	catSnapshotsRows,
	catTasksRows,
	catTemplatesRows,
	catThreadPoolRows,
	catTransformsRows,
	ccrFollowInfoOutput,
	ccrFollowOutput,
	ccrFollowStatsOutput,
	ccrForgetFollowerOutput,
	clusterAllocationExplainOutput,
	clusterGetSettingsOutput,
	clusterGetStateOutput,
	clusterGetStatsOutput,
	clusterHealth,
	clusterHealthReportOutput,
	clusterInfoOutput,
	clusterPendingTasksOutput,
	clusterPutSettingsOutput,
	clusterRemoteInfoOutput,
	clusterRerouteOutput,
	clusterScriptContextsOutput,
	clusterScriptLanguagesOutput,
	clusterSslCertificatesOutput,
	clusterSubsystemInfoOutput,
	documentFound,
	documentMissing,
	existsFalse,
	existsTrue,
	explainResponse,
	fleetGlobalCheckpointsOutput,
	indexInfo,
	indicesAddBlockOutput,
	indicesAnalyzeOutput,
	indicesCloseOutput,
	indicesCreateOutput,
	indicesDeleteAliasOutput,
	indicesDeleteOutput,
	indicesDeprecationsOutput,
	indicesDiskUsageOutput,
	indicesDownsampleOutput,
	indicesFieldUsageStatsOutput,
	indicesGetAliasOutput,
	indicesGetFieldMappingOutput,
	indicesGetMappingOutput,
	indicesGetSettingsOutput,
	indicesIlmRemoveOutput,
	indicesOpenOutput,
	indicesPutAliasOutput,
	indicesRecoveryOutput,
	indicesReloadSearchAnalyzersOutput,
	indicesRemoveBlockOutput,
	indicesResizeOutput,
	indicesRolloverOutput,
	indicesSearchableSnapshotStatsOutput,
	indicesSegmentsOutput,
	indicesShardStoresOutput,
	indicesStatsOutput,
	lifecycleIndicesOutput,
	mgetResponse,
	msearchEmptyResult,
	msearchResult,
	mtermvectorsResponse,
	nodesClearRepositoriesMeteringOutput,
	nodesHotThreadsText,
	nodesInfoOutput,
	nodesReloadSecureSettingsOutput,
	nodesRepositoriesMeteringOutput,
	nodesStatsOutput,
	nodesUsageOutput,
	searchAsyncSubmitOutput,
	searchCountOutput,
	searchEqlOutput,
	searchFieldCapsOutput,
	searchGraphExploreOutput,
	searchHit,
	searchOpenPointInTimeOutput,
	searchRankEvalOutput,
	searchResponse,
	searchShardsOutput,
	searchTermsEnumOutput,
	searchValidateQueryOutput,
	shardsOpResponse,
	taskGetOutput,
	tasksListOutput,
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
	it('accepts a no-arg call and the documented filters', () => {
		expect(ClusterGetHealthInputSchema.parse({})).toEqual({});
		expect(
			ClusterGetHealthInputSchema.parse({
				index: 'logs-*',
				level: 'indices',
				wait_for_status: 'yellow',
			}),
		).toEqual({ index: 'logs-*', level: 'indices', wait_for_status: 'yellow' });
	});

	it('rejects unknown keys and bad level/wait_for_status values', () => {
		expect(
			ClusterGetHealthInputSchema.safeParse({ level: 'shard' }).success,
		).toBe(false);
		expect(
			ClusterGetHealthInputSchema.safeParse({ wait_for_status: 'blue' })
				.success,
		).toBe(false);
		expect(
			ClusterGetHealthInputSchema.safeParse({ anything: 'ignored' }).success,
		).toBe(false);
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

// ── indices lifecycle wire assertions ────────────────────────────────────────

describe('indices lifecycle wire calls', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

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

	it('indices.create PUTs mappings/settings/aliases as the body', async () => {
		mockJson(indicesCreateOutput);
		const result = await Indices.create(ctx, {
			index: 'logs-2026-12',
			mappings: { properties: { level: { type: 'keyword' } } },
			settings: { number_of_shards: 1 },
			wait_for_active_shards: 'all',
		});
		expect(result.index).toBe('logs-2026-12');
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-12?wait_for_active_shards=all');
		expect(init.method).toBe('PUT');
		expect(JSON.parse(String(init.body))).toEqual({
			mappings: { properties: { level: { type: 'keyword' } } },
			settings: { number_of_shards: 1 },
		});
	});

	it('indices.exists HEADs and resolves 404 to exists: false', async () => {
		mockEmpty(404);
		const result = await Indices.exists(ctx, { index: 'nope' });
		expect(result).toEqual({ exists: false });
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/nope');
		expect(init.method).toBe('HEAD');
	});

	it('indices.delete DELETEs the index', async () => {
		mockJson(indicesDeleteOutput);
		const result = await Indices.remove(ctx, { index: 'logs-2026-11' });
		expect(result.acknowledged).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11');
		expect(init.method).toBe('DELETE');
	});

	it('indices.open and indices.close POST their _open/_close paths', async () => {
		mockJson(indicesOpenOutput);
		mockJson(indicesCloseOutput);
		await Indices.open(ctx, { index: 'logs-2026-11' });
		await Indices.close(ctx, { index: 'logs-2026-11' });
		const [openUrl, openInit] = fetchMock.mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(openUrl).toBe('http://es:9200/logs-2026-11/_open');
		expect(openInit.method).toBe('POST');
		const [closeUrl, closeInit] = fetchMock.mock.calls[1] as [
			string,
			RequestInit,
		];
		expect(closeUrl).toBe('http://es:9200/logs-2026-11/_close');
		expect(closeInit.method).toBe('POST');
	});

	it('indices.addBlock PUTs the block enum and indices.removeBlock DELETEs it', async () => {
		mockJson(indicesAddBlockOutput);
		mockJson(indicesRemoveBlockOutput);
		const added = await Indices.addBlock(ctx, {
			index: 'logs-2026-11',
			block: 'write',
		});
		expect(added.indices[0]?.blocked).toBe(true);
		await Indices.removeBlock(ctx, { index: 'logs-2026-11', block: 'write' });
		const [addUrl, addInit] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(addUrl).toBe('http://es:9200/logs-2026-11/_block/write');
		expect(addInit.method).toBe('PUT');
		const [removeUrl, removeInit] = fetchMock.mock.calls[1] as [
			string,
			RequestInit,
		];
		expect(removeUrl).toBe('http://es:9200/logs-2026-11/_block/write');
		expect(removeInit.method).toBe('DELETE');
	});

	it('indices.getMapping and indices.getFieldMapping GET the mapping paths', async () => {
		mockJson(indicesGetMappingOutput);
		mockJson(indicesGetFieldMappingOutput);
		await Indices.getMapping(ctx, { index: 'logs-2026-11' });
		await Indices.getFieldMapping(ctx, {
			index: 'logs-2026-11',
			fields: 'level,@timestamp',
		});
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_mapping',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_mapping/field/level%2C%40timestamp',
		);
	});

	it('indices.putMapping POSTs the mapping body', async () => {
		mockJson(indicesDeleteOutput);
		const result = await Indices.putMapping(ctx, {
			index: 'logs-2026-11',
			mappings: { properties: { host: { type: 'keyword' } } },
			write_index_only: true,
		});
		expect(result.acknowledged).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_mapping?write_index_only=true',
		);
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			properties: { host: { type: 'keyword' } },
		});
	});

	it('indices.getSettings GETs by name and indices.putSettings PUTs the settings body', async () => {
		mockJson(indicesGetSettingsOutput);
		mockJson(acknowledgedResponse);
		await Indices.getSettings(ctx, { index: 'logs-*', name: 'index.*' });
		await Indices.putSettings(ctx, {
			index: 'logs-2026-11',
			settings: { 'index.number_of_replicas': 2 },
			preserve_existing: true,
		});
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-*/_settings/index.*',
		);
		const [putUrl, putInit] = fetchMock.mock.calls[1] as [string, RequestInit];
		expect(putUrl).toBe(
			'http://es:9200/logs-2026-11/_settings?preserve_existing=true',
		);
		expect(putInit.method).toBe('PUT');
		expect(JSON.parse(String(putInit.body))).toEqual({
			'index.number_of_replicas': 2,
		});
	});

	it('indices.getAlias GETs, indices.existsAlias HEADs, indices.putAlias POSTs the filter body', async () => {
		mockJson(indicesGetAliasOutput);
		mockEmpty(200);
		mockJson(indicesPutAliasOutput);
		await Indices.getAlias(ctx, { index: 'logs-*', name: 'logs-current' });
		const existsResult = await Indices.existsAlias(ctx, {
			index: 'logs-*',
			name: 'logs-current',
		});
		expect(existsResult).toEqual({ exists: true });
		await Indices.putAlias(ctx, {
			index: 'logs-2026-11',
			name: 'logs-error',
			filter: { term: { level: 'error' } },
			is_write_index: false,
		});
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-*/_alias/logs-current',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-*/_alias/logs-current',
		);
		const [putUrl, putInit] = fetchMock.mock.calls[2] as [string, RequestInit];
		expect(putUrl).toBe('http://es:9200/logs-2026-11/_aliases/logs-error');
		expect(putInit.method).toBe('POST');
		expect(JSON.parse(String(putInit.body))).toEqual({
			filter: { term: { level: 'error' } },
			is_write_index: false,
		});
	});

	it('indices.deleteAlias DELETEs the alias path', async () => {
		mockJson(indicesDeleteAliasOutput);
		const result = await Indices.deleteAlias(ctx, {
			index: 'logs-2026-11',
			name: 'logs-error',
		});
		expect(result.acknowledged).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_aliases/logs-error');
		expect(init.method).toBe('DELETE');
	});

	it('indices.rollover POSTs conditions in the body and dry_run in the query', async () => {
		mockJson(indicesRolloverOutput);
		const result = await Indices.rollover(ctx, {
			alias: 'logs-write',
			new_index: 'logs-000002',
			conditions: { max_size: '5gb', max_docs: 1000 },
			dry_run: true,
		});
		expect(result.rolled_over).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-write/_rollover/logs-000002?dry_run=true',
		);
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			conditions: { max_size: '5gb', max_docs: 1000 },
		});
	});

	it('indices.clone/split/shrink POST their paths with settings bodies', async () => {
		mockJson(indicesResizeOutput);
		mockJson(indicesResizeOutput);
		mockJson(indicesResizeOutput);
		await Indices.clone(ctx, {
			index: 'logs-2026-11',
			target: 'logs-clone',
			settings: { 'index.number_of_replicas': 0 },
		});
		await Indices.split(ctx, { index: 'logs-2026-11', target: 'logs-split' });
		await Indices.shrink(ctx, { index: 'logs-2026-11', target: 'logs-shrink' });
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_clone/logs-clone',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_split/logs-split',
		);
		expect(fetchMock.mock.calls[2]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_shrink/logs-shrink',
		);
		const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
		expect(JSON.parse(String(init.body))).toEqual({
			settings: { 'index.number_of_replicas': 0 },
		});
	});

	it('indices.downsample POSTs the fixed_interval body', async () => {
		mockJson(indicesDownsampleOutput);
		const result = await Indices.downsample(ctx, {
			index: 'metrics-2026-11',
			target_index: 'metrics-2026-11-1d',
			fixed_interval: '1d',
			sampling_method: 'last_value',
		});
		expect(result.acknowledged).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/metrics-2026-11/_downsample/metrics-2026-11-1d',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			fixed_interval: '1d',
			sampling_method: 'last_value',
		});
	});

	it('indices.analyze POSTs text and analyzer as the body', async () => {
		mockJson(indicesAnalyzeOutput);
		const result = await Indices.analyze(ctx, {
			index: 'logs-2026-11',
			text: ['disk error', 'disk warning'],
			analyzer: 'standard',
		});
		expect(result.tokens?.[0]?.token).toBe('disk');
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_analyze');
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			text: ['disk error', 'disk warning'],
			analyzer: 'standard',
		});
	});
});

describe('indices lifecycle input bounds', () => {
	it('rejects an unknown block type', () => {
		expect(
			IndicesAddBlockInputSchema.safeParse({
				index: 'logs',
				block: 'everything',
			}).success,
		).toBe(false);
		expect(
			IndicesAddBlockInputSchema.safeParse({
				index: 'logs',
				block: 'read_only',
			}).success,
		).toBe(true);
	});

	it('requires mappings on putMapping and settings on putSettings', () => {
		expect(
			IndicesPutMappingInputSchema.safeParse({ index: 'logs' }).success,
		).toBe(false);
		expect(
			IndicesPutSettingsInputSchema.safeParse({ index: 'logs' }).success,
		).toBe(false);
		expect(
			IndicesPutSettingsInputSchema.safeParse({
				index: 'logs',
				settings: { 'index.refresh_interval': '30s' },
			}).success,
		).toBe(true);
	});

	it('bounds downsample sampling_method to the enum', () => {
		expect(
			IndicesDownsampleInputSchema.safeParse({
				index: 'metrics',
				target_index: 'metrics-1d',
				fixed_interval: '1d',
				sampling_method: 'average',
			}).success,
		).toBe(false);
		expect(
			IndicesDownsampleInputSchema.safeParse({
				index: 'metrics',
				target_index: 'metrics-1d',
				fixed_interval: '1d',
				sampling_method: 'aggregate',
			}).success,
		).toBe(true);
		expect(
			IndicesDownsampleInputSchema.safeParse({
				index: 'metrics',
				target_index: 'metrics-1d',
			}).success,
		).toBe(false);
	});

	it('requires non-blank text on analyze and rejects unknown analyzers keys', () => {
		expect(
			IndicesAnalyzeInputSchema.safeParse({ index: 'logs', text: '' }).success,
		).toBe(false);
		expect(
			IndicesAnalyzeInputSchema.safeParse({ index: 'logs', text: [''] })
				.success,
		).toBe(false);
		expect(
			IndicesAnalyzeInputSchema.safeParse({
				index: 'logs',
				text: 'ok',
				char_filter: ['html_strip'],
			}).success,
		).toBe(false);
	});
});

// ── stats and maintenance wire assertions ────────────────────────────────────

describe('indices stats and maintenance wire calls', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

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

	async function sent() {
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		return { url, init };
	}

	it('indices.stats GETs the metric path with the level query', async () => {
		mockJson(indicesStatsOutput);
		const result = await Indices.stats(ctx, {
			index: 'logs-*',
			metric: 'store,docs',
			level: 'indices',
		});
		expect(result.indices?.['logs-2026-11']).toBeDefined();
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_stats/store%2Cdocs?level=indices');
		expect(init.method).toBe('GET');
	});

	it('indices.stats rejects metrics outside the documented enum', () => {
		expect(
			IndicesStatsInputSchema.safeParse({
				index: 'logs',
				metric: 'everything',
			}).success,
		).toBe(false);
		expect(
			IndicesStatsInputSchema.safeParse({ index: 'logs', metric: '_all' })
				.success,
		).toBe(true);
	});

	it('indices.segments and indices.recovery GET their paths', async () => {
		mockJson(indicesSegmentsOutput);
		mockJson(indicesRecoveryOutput);
		const segments = await Indices.segments(ctx, { index: 'logs-2026-11' });
		expect(segments.indices['logs-2026-11']).toBeDefined();
		await Indices.recovery(ctx, { index: 'logs-2026-11', detailed: true });
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_segments',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_recovery?detailed=true',
		);
	});

	it('indices.shardStores filters by status enum', async () => {
		mockJson(indicesShardStoresOutput);
		const result = await Indices.shardStores(ctx, {
			index: 'logs-*',
			status: 'yellow',
		});
		expect(result.indices['logs-2026-11']).toBeDefined();
		const { url } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_shard_stores?status=yellow');
	});

	it('indices.refresh and indices.flush use the documented GET methods', async () => {
		mockJson(shardsOpResponse);
		mockJson(shardsOpResponse);
		const refreshed = await Indices.refresh(ctx, { index: 'logs-2026-11' });
		expect(refreshed._shards?.successful).toBe(4);
		await Indices.flush(ctx, { index: 'logs-2026-11', force: true });
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_refresh',
		);
		expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: 'GET' });
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_flush?force=true',
		);
	});

	it('indices.forceMerge POSTs with the segment target', async () => {
		mockJson(shardsOpResponse);
		await Indices.forceMerge(ctx, {
			index: 'logs-2026-11',
			max_num_segments: 1,
			only_expunge_deletes: true,
		});
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_forcemerge?max_num_segments=1&only_expunge_deletes=true',
		);
		expect(init.method).toBe('POST');
	});

	it('indices.forceMerge rejects a non-positive segment count', () => {
		expect(
			IndicesForceMergeInputSchema.safeParse({
				index: 'logs',
				max_num_segments: 0,
			}).success,
		).toBe(false);
	});

	it('indices.cacheClear POSTs with the comma-joined field list', async () => {
		mockJson(shardsOpResponse);
		await Indices.cacheClear(ctx, {
			index: 'logs-2026-11',
			fielddata: true,
			fields: ['message', 'host'],
		});
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_cache/clear?fielddata=true&fields=message%2Chost',
		);
		expect(init.method).toBe('POST');
	});

	it('indices.reloadSearchAnalyzers POSTs and parses reload details', async () => {
		mockJson(indicesReloadSearchAnalyzersOutput);
		const result = await Indices.reloadSearchAnalyzers(ctx, {
			index: 'logs-2026-11',
		});
		expect(result.reload_details[0]?.reloaded_analyzers).toEqual([
			'my_synonyms',
		]);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_reload_search_analyzers');
		expect(init.method).toBe('POST');
	});

	it('indices.diskUsage requires the explicit expensive-tasks opt-in', () => {
		expect(
			IndicesDiskUsageInputSchema.safeParse({ index: 'logs' }).success,
		).toBe(false);
		expect(
			IndicesDiskUsageInputSchema.safeParse({
				index: 'logs',
				run_expensive_tasks: false,
			}).success,
		).toBe(false);
	});

	it('indices.diskUsage POSTs with run_expensive_tasks=true', async () => {
		mockJson(indicesDiskUsageOutput);
		const result = await Indices.diskUsage(ctx, {
			index: 'logs-2026-11',
			run_expensive_tasks: true,
		});
		expect(result['logs-2026-11']?.store_size_in_bytes).toBe(1_258_291);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_disk_usage?run_expensive_tasks=true',
		);
		expect(init.method).toBe('POST');
	});

	it('indices.fieldUsageStats GETs the usage stats', async () => {
		mockJson(indicesFieldUsageStatsOutput);
		const result = await Indices.fieldUsageStats(ctx, { index: 'logs-*' });
		expect(result._shards.total).toBe(4);
		const { url } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_field_usage_stats');
	});

	it('indices.deprecations parses per-section deprecation rows', async () => {
		mockJson(indicesDeprecationsOutput);
		const result = await Indices.deprecations(ctx, { index: 'logs-2026-11' });
		expect(result.index_settings['logs-2026-11']?.[0]?.level).toBe('warning');
		const { url } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_migration/deprecations');
	});

	it('indices.explainDataLifecycle and indices.ilmExplain GET their explain paths', async () => {
		mockJson(lifecycleIndicesOutput);
		mockJson(lifecycleIndicesOutput);
		const lifecycle = await Indices.explainDataLifecycle(ctx, {
			index: 'logs-2026-11',
			include_defaults: true,
		});
		const ilm = await Indices.ilmExplain(ctx, {
			index: 'logs-2026-11',
			only_managed: true,
		});
		expect(lifecycle.indices['logs-2026-11']).toMatchObject({
			managed: true,
		});
		expect(ilm.indices['logs-2026-11']).toMatchObject({ phase: 'hot' });
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_lifecycle/explain?include_defaults=true',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_ilm/explain?only_managed=true',
		);
	});

	it('indices.ilmRemove and indices.ilmRetry POST their paths', async () => {
		mockJson(indicesIlmRemoveOutput);
		mockJson(acknowledgedResponse);
		const removed = await Indices.ilmRemove(ctx, { index: 'logs-2026-11' });
		const retried = await Indices.ilmRetry(ctx, { index: 'logs-2026-11' });
		expect(removed.has_failures).toBe(false);
		expect(retried.acknowledged).toBe(true);
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_ilm/remove',
		);
		expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: 'POST' });
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-2026-11/_ilm/retry',
		);
	});

	it('indices.clearSearchableSnapshotCache POSTs and tolerates an empty body', async () => {
		mockJson({});
		const result = await Indices.clearSearchableSnapshotCache(ctx, {
			index: 'logs-2026-11',
		});
		expect(result).toEqual({});
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_searchable_snapshots/cache/clear',
		);
		expect(init.method).toBe('POST');
	});

	it('indices.searchableSnapshotStats GETs with the level enum', async () => {
		mockJson(indicesSearchableSnapshotStatsOutput);
		const result = await Indices.searchableSnapshotStats(ctx, {
			index: 'logs-*',
			level: 'indices',
		});
		expect(result.stats).toBeDefined();
		const { url } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-*/_searchable_snapshots/stats?level=indices',
		);
	});
});

// ── search family wire assertions ────────────────────────────────────────────

describe('search family wire calls', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

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

	async function sent() {
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		return { url, init };
	}

	it('search.count GETs without a query and POSTs the query body when present', async () => {
		mockJson(searchCountOutput);
		mockJson(searchCountOutput);
		await Search.count(ctx, { index: 'logs-*' });
		const counted = await Search.count(ctx, {
			index: 'logs-*',
			query: { term: { level: 'error' } },
		});
		expect(counted.count).toBe(42);
		const [getUrl, getInit] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(getUrl).toBe('http://es:9200/logs-*/_count');
		expect(getInit.method).toBe('GET');
		expect(getInit.body).toBeUndefined();
		const [postUrl, postInit] = fetchMock.mock.calls[1] as [
			string,
			RequestInit,
		];
		expect(postUrl).toBe('http://es:9200/logs-*/_count');
		expect(postInit.method).toBe('POST');
		expect(JSON.parse(String(postInit.body))).toEqual({
			query: { term: { level: 'error' } },
		});
	});

	it('search.msearch serializes sub-searches to header/body ndjson pairs', async () => {
		mockJson(msearchResult);
		const result = await Search.msearch(ctx, {
			index: 'logs-*',
			searches: [
				{ query: { term: { level: 'error' } }, size: 5 },
				{ index: 'other-index' },
			],
		});
		expect(result.responses).toHaveLength(2);
		expect(result.responses[1]?.error?.type).toBe('index_not_found_exception');
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_msearch');
		expect(init.method).toBe('POST');
		expect(init.body).toBe(
			'{}\n{"query":{"term":{"level":"error"}},"size":5}\n{"index":"other-index"}\n{}\n',
		);
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/x-ndjson',
		);
	});

	it('search.msearch passes raw ndjson through and accepts empty responses', async () => {
		mockJson(msearchEmptyResult);
		const result = await Search.msearch(ctx, {
			index: 'logs',
			ndjson: '{}\n{}\n',
		});
		expect(result.responses).toEqual([]);
		const { init } = await sent();
		expect(init.body).toBe('{}\n{}\n');
	});

	it('search.msearch rejects both or neither of searches/ndjson', () => {
		expect(SearchMsearchInputSchema.safeParse({ index: 'logs' }).success).toBe(
			false,
		);
		expect(
			SearchMsearchInputSchema.safeParse({
				index: 'logs',
				searches: [{}],
				ndjson: '{}\n',
			}).success,
		).toBe(false);
	});

	it('search.msearchTemplate serializes template id/params pairs', async () => {
		mockJson(msearchResult);
		const result = await Search.msearchTemplate(ctx, {
			index: 'logs-*',
			searches: [{ id: 'my-template', params: { level: 'error' } }],
		});
		expect(result.took).toBe(12);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_msearch/template');
		expect(init.body).toBe(
			'{}\n{"id":"my-template","params":{"level":"error"}}\n',
		);
	});

	it('search.template requires exactly one of id or source', () => {
		expect(SearchTemplateInputSchema.safeParse({ index: 'logs' }).success).toBe(
			false,
		);
		expect(
			SearchTemplateInputSchema.safeParse({
				index: 'logs',
				id: 't',
				source: '{}',
			}).success,
		).toBe(false);
		expect(
			SearchTemplateInputSchema.safeParse({
				index: 'logs',
				id: 'my-template',
				params: { n: 5 },
			}).success,
		).toBe(true);
	});

	it('search.template POSTs the template body', async () => {
		mockJson(searchResponse());
		const result = await Search.template(ctx, {
			index: 'logs-*',
			id: 'my-template',
			params: { level: 'error' },
		});
		expect(result.hits.hits).toHaveLength(1);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_search/template');
		expect(JSON.parse(String(init.body))).toEqual({
			id: 'my-template',
			params: { level: 'error' },
		});
	});

	it('search.termsEnum POSTs the field and prefix body', async () => {
		mockJson(searchTermsEnumOutput);
		const result = await Search.termsEnum(ctx, {
			index: 'logs-*',
			field: 'level',
			string: 'err',
			size: 10,
		});
		expect(result.terms).toEqual(['error', 'error_boundary', 'errors']);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_terms_enum');
		expect(JSON.parse(String(init.body))).toEqual({
			field: 'level',
			string: 'err',
			size: 10,
		});
	});

	it('search.fieldCaps POSTs with the fields query', async () => {
		mockJson(searchFieldCapsOutput);
		const result = await Search.fieldCaps(ctx, {
			index: 'logs-*',
			fields: 'level,message',
		});
		expect(result.fields.level?.keyword?.aggregatable).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-*/_field_caps?fields=level%2Cmessage',
		);
		expect(init.method).toBe('POST');
		expect(init.body).toBeUndefined();
	});

	it('search.shards POSTs with routing and preference queries', async () => {
		mockJson(searchShardsOutput);
		const result = await Search.shards(ctx, {
			index: 'logs-2026-11',
			preference: '_local',
		});
		expect(result.nodes['node-1']).toBeDefined();
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_search_shards?preference=_local',
		);
		expect(init.method).toBe('POST');
	});

	it('search.openPointInTime POSTs keep_alive as a query param', async () => {
		mockJson(searchOpenPointInTimeOutput);
		const result = await Search.openPointInTime(ctx, {
			index: 'logs-*',
			keep_alive: '1m',
		});
		expect(result.id).toContain('pit-');
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_pit?keep_alive=1m');
		expect(init.method).toBe('POST');
	});

	it('search.rankEval POSTs rated requests and the metric', async () => {
		mockJson(searchRankEvalOutput);
		const result = await Search.rankEval(ctx, {
			index: 'logs-*',
			requests: [
				{
					id: 'my_query_id',
					request: { query: { match: { message: 'disk' } } },
					ratings: [{ _id: '1', rating: 1 }],
				},
			],
			metric: { precision: { k: 10 } },
		});
		expect(result.metric_score).toBe(0.9);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_rank_eval');
		expect(JSON.parse(String(init.body))).toEqual({
			requests: [
				{
					id: 'my_query_id',
					request: { query: { match: { message: 'disk' } } },
					ratings: [{ _id: '1', rating: 1 }],
				},
			],
			metric: { precision: { k: 10 } },
		});
	});

	it('search.vectorTile bounds zoom/coordinates and grid enums', () => {
		expect(
			SearchVectorTileInputSchema.safeParse({
				index: 'logs',
				field: 'geo',
				zoom: 3,
				x: 8,
				y: 5,
			}).success,
		).toBe(false); // x must be < 2^zoom
		expect(
			SearchVectorTileInputSchema.safeParse({
				index: 'logs',
				field: 'geo',
				zoom: 30,
				x: 0,
				y: 0,
			}).success,
		).toBe(false);
		expect(
			SearchVectorTileInputSchema.safeParse({
				index: 'logs',
				field: 'geo',
				zoom: 3,
				x: 7,
				y: 5,
				grid_agg: 'geohash',
			}).success,
		).toBe(false);
		expect(
			SearchVectorTileInputSchema.safeParse({
				index: 'logs',
				field: 'geo',
				zoom: 3,
				x: 7,
				y: 5,
				grid_precision: 9,
			}).success,
		).toBe(false);
	});

	it('search.vectorTile GETs the tile path and returns base64 bytes', async () => {
		const bytes = new Uint8Array([0x1a, 0x04, 0x74, 0x65, 0x73, 0x74]);
		fetchMock.mockResolvedValueOnce(
			new Response(bytes, {
				status: 200,
				headers: { 'Content-Type': 'application/x-protobuf' },
			}),
		);
		const result = await Search.vectorTile(ctx, {
			index: 'places',
			field: 'location',
			zoom: 12,
			x: 3000,
			y: 2000,
			grid_type: 'centroid',
		});
		expect(result).toEqual({
			contentType: 'application/x-protobuf',
			base64: Buffer.from(bytes).toString('base64'),
		});
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/places/_mvt/location/12/3000/2000?grid_type=centroid',
		);
		// The raw-fetch binary path omits method, which fetch treats as GET.
		expect(init.method ?? 'GET').toBe('GET');
	});

	it('search.eql POSTs the EQL query with wait controls in the query', async () => {
		mockJson(searchEqlOutput);
		const result = await Search.eql(ctx, {
			index: 'logs-*',
			query: 'process where process.name == "sudo"',
			size: 10,
			keep_on_completion: false,
		});
		expect(result.hits.events).toHaveLength(1);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-*/_eql/search?keep_on_completion=false',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			query: 'process where process.name == "sudo"',
			size: 10,
		});
	});

	it('search.asyncSubmit POSTs the search body with async controls', async () => {
		mockJson(searchAsyncSubmitOutput);
		const result = await Search.asyncSubmit(ctx, {
			index: 'logs-*',
			query: { match_all: {} },
			size: 100,
			wait_for_completion_timeout: '1s',
			keep_alive: '5m',
		});
		expect(result.is_running).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-*/_async_search?wait_for_completion_timeout=1s&keep_alive=5m',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			query: { match_all: {} },
			size: 100,
		});
	});

	it('search.graphExplore POSTs the vertices body', async () => {
		mockJson(searchGraphExploreOutput);
		const result = await Search.graphExplore(ctx, {
			index: 'logs-*',
			vertices: [{ field: 'level' }, { field: 'host' }],
		});
		expect(result.vertices[0]?.term).toBe('error');
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_graph/explore');
		expect(JSON.parse(String(init.body))).toEqual({
			vertices: [{ field: 'level' }, { field: 'host' }],
		});
	});

	it('search.validateQuery posts the query and all_shards flag', async () => {
		mockJson(searchValidateQueryOutput);
		const result = await Search.validateQuery(ctx, {
			index: 'logs-*',
			query: { match: { message: 'disk' } },
			all_shards: true,
		});
		expect(result.valid).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-*/_validate/query?all_shards=true');
		expect(JSON.parse(String(init.body))).toEqual({
			query: { match: { message: 'disk' } },
		});
	});
});

// ── fleet and ccr wire assertions ────────────────────────────────────────────

describe('fleet and ccr wire calls', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

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

	async function sent() {
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		return { url, init };
	}

	it('fleet.search POSTs with the comma-joined checkpoint wait', async () => {
		mockJson(searchResponse());
		const result = await Fleet.search(ctx, {
			index: 'logs-2026-11',
			query: { match_all: {} },
			wait_for_checkpoints: [10, 25],
		});
		expect(result.hits.hits).toHaveLength(1);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_fleet/_fleet_search?wait_for_checkpoints=10%2C25',
		);
		expect(JSON.parse(String(init.body))).toEqual({ query: { match_all: {} } });
	});

	it('fleet.msearch POSTs ndjson pairs with the checkpoint wait', async () => {
		mockJson(msearchResult);
		const result = await Fleet.msearch(ctx, {
			index: 'logs-2026-11',
			searches: [{ size: 1 }],
			wait_for_checkpoints: [10],
		});
		expect(result.responses).toHaveLength(2);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_fleet/_fleet_msearch?wait_for_checkpoints=10',
		);
		expect(init.body).toBe('{}\n{"size":1}\n');
	});

	it('fleet.globalCheckpoints GETs with wait and checkpoint params', async () => {
		mockJson(fleetGlobalCheckpointsOutput);
		const result = await Fleet.globalCheckpoints(ctx, {
			index: 'logs-2026-11',
			wait_for_advance: true,
			checkpoints: [10],
			timeout: '10s',
		});
		expect(result.global_checkpoints).toEqual([10, 25]);
		const { url, init } = await sent();
		expect(url).toBe(
			'http://es:9200/logs-2026-11/_fleet/global_checkpoints?wait_for_advance=true&timeout=10s&checkpoints=10',
		);
		expect(init.method).toBe('GET');
	});

	it('ccr.follow PUTs the leader and remote cluster body', async () => {
		mockJson(ccrFollowOutput);
		const result = await Ccr.follow(ctx, {
			index: 'logs-follower',
			leader_index: 'logs-2026-11',
			remote_cluster: 'leader_cluster',
			max_outstanding_read_requests: 8,
		});
		expect(result.index_following_started).toBe(true);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-follower/_ccr/follow');
		expect(init.method).toBe('PUT');
		expect(JSON.parse(String(init.body))).toEqual({
			leader_index: 'logs-2026-11',
			remote_cluster: 'leader_cluster',
			max_outstanding_read_requests: 8,
		});
	});

	it('ccr.followInfo and ccr.followStats GET their paths', async () => {
		mockJson(ccrFollowInfoOutput);
		mockJson(ccrFollowStatsOutput);
		const info = await Ccr.followInfo(ctx, { index: 'logs-follower' });
		const stats = await Ccr.followStats(ctx, { index: 'logs-follower' });
		expect(info.follower_indices[0]?.status).toBe('active');
		expect(stats.indices[0]?.index).toBe('logs-follower');
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-follower/_ccr/info',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-follower/_ccr/stats',
		);
	});

	it('ccr.forgetFollower requires a follower identifier and POSTs the body', async () => {
		expect(
			CcrForgetFollowerInputSchema.safeParse({ index: 'leader' }).success,
		).toBe(false);
		mockJson(ccrForgetFollowerOutput);
		const result = await Ccr.forgetFollower(ctx, {
			index: 'logs-2026-11',
			follower_cluster: 'follower_cluster',
			follower_index: 'logs-follower',
		});
		expect(result._shards.successful).toBe(1);
		const { url, init } = await sent();
		expect(url).toBe('http://es:9200/logs-2026-11/_ccr/forget_follower');
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			follower_cluster: 'follower_cluster',
			follower_index: 'logs-follower',
		});
	});

	it('ccr.pauseFollow, resumeFollow and unfollow POST their paths', async () => {
		mockJson(acknowledgedResponse);
		mockJson(acknowledgedResponse);
		mockJson(acknowledgedResponse);
		const paused = await Ccr.pauseFollow(ctx, { index: 'logs-follower' });
		const resumed = await Ccr.resumeFollow(ctx, { index: 'logs-follower' });
		const unfollowed = await Ccr.unfollow(ctx, { index: 'logs-follower' });
		expect(paused.acknowledged).toBe(true);
		expect(resumed.acknowledged).toBe(true);
		expect(unfollowed.acknowledged).toBe(true);
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'http://es:9200/logs-follower/_ccr/pause_follow',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'http://es:9200/logs-follower/_ccr/resume_follow',
		);
		expect(fetchMock.mock.calls[2]?.[0]).toBe(
			'http://es:9200/logs-follower/_ccr/unfollow',
		);
	});
});

// ── cluster, cat, nodes, tasks schema bounds ────────────────────────────────

describe('cluster family input bounds', () => {
	it('subsystemInfo only accepts documented targets', () => {
		expect(
			ClusterSubsystemInfoInputSchema.safeParse({ target: 'http,ingest' })
				.success,
		).toBe(true);
		expect(
			ClusterSubsystemInfoInputSchema.safeParse({ target: '_all' }).success,
		).toBe(true);
		expect(
			ClusterSubsystemInfoInputSchema.safeParse({ target: 'http,nonsense' })
				.success,
		).toBe(false);
		expect(ClusterSubsystemInfoInputSchema.safeParse({}).success).toBe(false);
	});

	it('reroute commands are typed with explicit data-loss opt-ins', () => {
		const valid = ClusterRerouteInputSchema.safeParse({
			dry_run: true,
			commands: [
				{
					move: {
						index: 'logs-2026-11',
						shard: 0,
						from_node: 'node-1',
						to_node: 'node-2',
					},
				},
				{
					allocate_stale_primary: {
						index: 'logs-2026-11',
						shard: 0,
						node: 'node-2',
						accept_data_loss: true,
					},
				},
			],
		});
		expect(valid.success).toBe(true);
		// accept_data_loss must be the literal true, never false or absent on
		// the data-loss commands.
		expect(
			ClusterRerouteInputSchema.safeParse({
				commands: [
					{
						allocate_stale_primary: {
							index: 'logs',
							shard: 0,
							node: 'node-2',
							accept_data_loss: false,
						},
					},
				],
			}).success,
		).toBe(false);
		expect(
			ClusterRerouteInputSchema.safeParse({
				commands: [
					{ allocate_stale_primary: { index: 'logs', shard: 0, node: 'n' } },
				],
			}).success,
		).toBe(false);
		// A command needs exactly one action key.
		expect(
			ClusterRerouteInputSchema.safeParse({
				commands: [
					{
						move: { index: 'l', shard: 0, from_node: 'a', to_node: 'b' },
						cancel: { index: 'l', shard: 0, node: 'a' },
					},
				],
			}).success,
		).toBe(false);
		expect(
			ClusterRerouteInputSchema.safeParse({
				commands: [
					{ move: { index: 'l', shard: -1, from_node: 'a', to_node: 'b' } },
				],
			}).success,
		).toBe(false);
	});

	it('voting config exclusions take exactly one of names or ids', () => {
		expect(
			ClusterAddVotingConfigExclusionsInputSchema.safeParse({
				node_names: ['node-1', 'node-2'],
			}).success,
		).toBe(true);
		expect(
			ClusterAddVotingConfigExclusionsInputSchema.safeParse({
				node_ids: ['id-1'],
			}).success,
		).toBe(true);
		expect(
			ClusterAddVotingConfigExclusionsInputSchema.safeParse({
				node_names: ['node-1'],
				node_ids: ['id-1'],
			}).success,
		).toBe(false);
		expect(
			ClusterAddVotingConfigExclusionsInputSchema.safeParse({
				node_names: [],
			}).success,
		).toBe(false);
	});

	it('reroute and allocationExplain accept empty option sets', () => {
		expect(ClusterRerouteInputSchema.safeParse({}).success).toBe(true);
		// With no body, allocation explain picks the first unassigned shard.
		expect(ClusterRerouteInputSchema.parse({ commands: undefined })).toEqual(
			{},
		);
	});
});

describe('nodes family input bounds', () => {
	it('nodes.stats metric selectors are validated', () => {
		expect(
			NodesStatsInputSchema.safeParse({ metric: 'indices,os' }).success,
		).toBe(true);
		expect(
			NodesStatsInputSchema.safeParse({ metric: 'not-a-metric' }).success,
		).toBe(false);
	});

	it('nodes.stats index_metric requires the indices metric', () => {
		expect(
			NodesStatsInputSchema.safeParse({
				metric: 'indices',
				index_metric: 'docs,store',
			}).success,
		).toBe(true);
		expect(
			NodesStatsInputSchema.safeParse({
				metric: '_all',
				index_metric: 'docs',
			}).success,
		).toBe(true);
		expect(
			NodesStatsInputSchema.safeParse({ index_metric: 'docs' }).success,
		).toBe(false);
		expect(
			NodesStatsInputSchema.safeParse({
				metric: 'os',
				index_metric: 'docs',
			}).success,
		).toBe(false);
	});

	it('hot threads pins the documented type and sort enums', () => {
		expect(
			NodesHotThreadsInputSchema.safeParse({ type: 'gpu', sort: 'total' })
				.success,
		).toBe(true);
		expect(NodesHotThreadsInputSchema.safeParse({ type: 'io' }).success).toBe(
			false,
		);
		expect(NodesHotThreadsInputSchema.safeParse({ sort: 'wait' }).success).toBe(
			false,
		);
		expect(NodesHotThreadsInputSchema.safeParse({ threads: 0 }).success).toBe(
			false,
		);
	});
});

describe('tasks family input bounds', () => {
	it('tasks.list takes actions/nodes as string or list and validates group_by', () => {
		expect(
			TasksListInputSchema.safeParse({ actions: 'cluster:*' }).success,
		).toBe(true);
		expect(
			TasksListInputSchema.safeParse({ nodes: ['node-1', 'node-2'] }).success,
		).toBe(true);
		expect(
			TasksListInputSchema.safeParse({ group_by: 'parents' }).success,
		).toBe(true);
		expect(
			TasksListInputSchema.safeParse({ group_by: 'clusters' }).success,
		).toBe(false);
		expect(TasksListInputSchema.safeParse({ nodes: [] }).success).toBe(false);
	});
});

// ── cluster, cat, nodes, tasks wire calls ───────────────────────────────────

describe('cluster, cat, nodes and tasks wire calls', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

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

	function mockText(body: string) {
		fetchMock.mockResolvedValueOnce(
			new Response(body, {
				status: 200,
				headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
			}),
		);
	}

	// Empty-body 200: no Content-Type, so the client surfaces undefined.
	function mockEmptyBody() {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
	}

	async function sent() {
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		return { url, init };
	}

	type WireCase = {
		name: string;
		url: string;
		method?: string;
		body?: unknown;
		text?: boolean;
		empty?: boolean;
		response: unknown;
		run: () => Promise<unknown>;
	};

	const cases: WireCase[] = [
		{
			name: 'cluster.ping HEADs the root and resolves exists',
			url: 'http://es:9200/',
			method: 'HEAD',
			empty: true,
			response: { exists: true },
			run: () => Cluster.ping(ctx, {}),
		},
		{
			name: 'cluster.getInfo GETs the root info block',
			url: 'http://es:9200/',
			response: clusterInfoOutput,
			run: () => Cluster.getInfo(ctx, {}),
		},
		{
			name: 'cluster.getHealth targets an index with a level filter',
			url: 'http://es:9200/_cluster/health/logs-*?level=indices',
			response: clusterHealth,
			run: () => Cluster.getHealth(ctx, { index: 'logs-*', level: 'indices' }),
		},
		{
			name: 'cluster.subsystemInfo encodes a comma target list',
			url: 'http://es:9200/_info/http,ingest',
			response: clusterSubsystemInfoOutput,
			run: () => Cluster.subsystemInfo(ctx, { target: 'http,ingest' }),
		},
		{
			name: 'cluster.pendingTasks passes the local flag',
			url: 'http://es:9200/_cluster/pending_tasks?local=true',
			response: clusterPendingTasksOutput,
			run: () => Cluster.pendingTasks(ctx, { local: true }),
		},
		{
			name: 'cluster.getSettings requests defaults',
			url: 'http://es:9200/_cluster/settings?include_defaults=true',
			response: clusterGetSettingsOutput,
			run: () => Cluster.getSettings(ctx, { include_defaults: true }),
		},
		{
			name: 'cluster.putSettings PUTs persistent settings',
			url: 'http://es:9200/_cluster/settings',
			method: 'PUT',
			body: { persistent: { 'cluster.routing.allocation.enable': 'all' } },
			response: clusterPutSettingsOutput,
			run: () =>
				Cluster.putSettings(ctx, {
					persistent: { 'cluster.routing.allocation.enable': 'all' },
				}),
		},
		{
			name: 'cluster.reroute POSTs typed commands with dry_run',
			url: 'http://es:9200/_cluster/reroute?dry_run=true',
			method: 'POST',
			body: {
				commands: [
					{
						move: {
							index: 'logs-2026-11',
							shard: 0,
							from_node: 'node-1',
							to_node: 'node-2',
						},
					},
				],
			},
			response: clusterRerouteOutput,
			run: () =>
				Cluster.reroute(ctx, {
					dry_run: true,
					commands: [
						{
							move: {
								index: 'logs-2026-11',
								shard: 0,
								from_node: 'node-1',
								to_node: 'node-2',
							},
						},
					],
				}),
		},
		{
			name: 'cluster.allocationExplain POSTs the shard body',
			url: 'http://es:9200/_cluster/allocation/explain',
			method: 'POST',
			body: { index: 'logs-2026-11', shard: 0, primary: true },
			response: clusterAllocationExplainOutput,
			run: () =>
				Cluster.allocationExplain(ctx, {
					index: 'logs-2026-11',
					shard: 0,
					primary: true,
				}),
		},
		{
			name: 'cluster.getState filters metrics and indices in the path',
			url: 'http://es:9200/_cluster/state/metadata,blocks/logs-*',
			response: clusterGetStateOutput,
			run: () =>
				Cluster.getState(ctx, { metric: 'metadata,blocks', index: 'logs-*' }),
		},
		{
			name: 'cluster.getStats targets a node filter',
			url: 'http://es:9200/_cluster/stats/nodes/node-1,node-2',
			response: clusterGetStatsOutput,
			run: () => Cluster.getStats(ctx, { node_id: 'node-1,node-2' }),
		},
		{
			name: 'cluster.addVotingConfigExclusions joins names into the query',
			url: 'http://es:9200/_cluster/voting_config_exclusions?node_names=node-1%2Cnode-2',
			method: 'POST',
			empty: true,
			response: {},
			run: () =>
				Cluster.addVotingConfigExclusions(ctx, {
					node_names: ['node-1', 'node-2'],
				}),
		},
		{
			name: 'cluster.clearVotingConfigExclusions DELETEs with wait flag',
			url: 'http://es:9200/_cluster/voting_config_exclusions?wait_for_removal=false',
			method: 'DELETE',
			empty: true,
			response: {},
			run: () =>
				Cluster.clearVotingConfigExclusions(ctx, { wait_for_removal: false }),
		},
		{
			name: 'cluster.remoteInfo GETs remote clusters',
			url: 'http://es:9200/_remote/info',
			response: clusterRemoteInfoOutput,
			run: () => Cluster.remoteInfo(ctx, {}),
		},
		{
			name: 'cluster.healthReport selects one indicator with a size',
			url: 'http://es:9200/_health_report/shards_availability?size=50',
			response: clusterHealthReportOutput,
			run: () =>
				Cluster.healthReport(ctx, { feature: 'shards_availability', size: 50 }),
		},
		{
			name: 'cluster.sslCertificates GETs the certificate list',
			url: 'http://es:9200/_ssl/certificates',
			response: clusterSslCertificatesOutput,
			run: () => Cluster.sslCertificates(ctx, {}),
		},
		{
			name: 'cluster.scriptContexts GETs script contexts',
			url: 'http://es:9200/_script_context',
			response: clusterScriptContextsOutput,
			run: () => Cluster.scriptContexts(ctx, {}),
		},
		{
			name: 'cluster.scriptLanguages GETs script languages',
			url: 'http://es:9200/_script_language',
			response: clusterScriptLanguagesOutput,
			run: () => Cluster.scriptLanguages(ctx, {}),
		},
		{
			name: 'cat.help GETs the plain-text command list',
			url: 'http://es:9200/_cat',
			text: true,
			response: catHelpText,
			run: () => Cat.help(ctx, {}),
		},
		{
			name: 'cat.aliases filters by name with format=json',
			url: 'http://es:9200/_cat/aliases/logs?format=json&expand_wildcards=open',
			response: catAliasesRows,
			run: () => Cat.aliases(ctx, { name: 'logs', expand_wildcards: 'open' }),
		},
		{
			name: 'cat.allocation targets a node filter',
			url: 'http://es:9200/_cat/allocation/node-1?format=json',
			response: catAllocationRows,
			run: () => Cat.allocation(ctx, { node_id: 'node-1' }),
		},
		{
			name: 'cat.circuitBreakers takes a pattern filter',
			url: 'http://es:9200/_cat/circuit_breaker/request*?format=json',
			response: catCircuitBreakersRows,
			run: () => Cat.circuitBreakers(ctx, { patterns: 'request*' }),
		},
		{
			name: 'cat.componentTemplates filters by name',
			url: 'http://es:9200/_cat/component_templates/logs-*?format=json',
			response: catComponentTemplatesRows,
			run: () => Cat.componentTemplates(ctx, { name: 'logs-*' }),
		},
		{
			name: 'cat.count targets an index',
			url: 'http://es:9200/_cat/count/logs-2026-11?format=json',
			response: catCountRows,
			run: () => Cat.count(ctx, { index: 'logs-2026-11' }),
		},
		{
			name: 'cat.fielddata filters by fields',
			url: 'http://es:9200/_cat/fielddata/host.name?format=json',
			response: catFielddataRows,
			run: () => Cat.fielddata(ctx, { fields: 'host.name' }),
		},
		{
			name: 'cat.health disables timestamps',
			url: 'http://es:9200/_cat/health?format=json&ts=false',
			response: catHealthRows,
			run: () => Cat.health(ctx, { ts: false }),
		},
		{
			name: 'cat.master GETs the master row',
			url: 'http://es:9200/_cat/master?format=json',
			response: catMasterRows,
			run: () => Cat.master(ctx, {}),
		},
		{
			name: 'cat.mlJobs lists anomaly detectors',
			url: 'http://es:9200/_cat/ml/anomaly_detectors/total-*?format=json&allow_no_match=true',
			response: catMlJobsRows,
			run: () => Cat.mlJobs(ctx, { job_id: 'total-*', allow_no_match: true }),
		},
		{
			name: 'cat.mlDataFrameAnalytics lists analytics jobs',
			url: 'http://es:9200/_cat/ml/data_frame/analytics?format=json',
			response: catMlDataFrameAnalyticsRows,
			run: () => Cat.mlDataFrameAnalytics(ctx, {}),
		},
		{
			name: 'cat.mlDatafeeds lists datafeeds',
			url: 'http://es:9200/_cat/ml/datafeeds/datafeed-*?format=json',
			response: catMlDatafeedsRows,
			run: () => Cat.mlDatafeeds(ctx, { datafeed_id: 'datafeed-*' }),
		},
		{
			name: 'cat.mlTrainedModels pages with from and size',
			url: 'http://es:9200/_cat/ml/trained_models?format=json&from=10&size=5',
			response: catMlTrainedModelsRows,
			run: () => Cat.mlTrainedModels(ctx, { from: 10, size: 5 }),
		},
		{
			name: 'cat.nodeattrs GETs node attributes',
			url: 'http://es:9200/_cat/nodeattrs?format=json',
			response: catNodeattrsRows,
			run: () => Cat.nodeattrs(ctx, {}),
		},
		{
			name: 'cat.nodes asks for full node ids',
			url: 'http://es:9200/_cat/nodes?format=json&full_id=true',
			response: catNodesRows,
			run: () => Cat.nodes(ctx, { full_id: true }),
		},
		{
			name: 'cat.pendingTasks GETs pending tasks',
			url: 'http://es:9200/_cat/pending_tasks?format=json',
			response: catPendingTasksRows,
			run: () => Cat.pendingTasks(ctx, {}),
		},
		{
			name: 'cat.plugins includes bootstrap plugins',
			url: 'http://es:9200/_cat/plugins?format=json&include_bootstrap=true',
			response: catPluginsRows,
			run: () => Cat.plugins(ctx, { include_bootstrap: true }),
		},
		{
			name: 'cat.recovery targets an index with detailed rows',
			url: 'http://es:9200/_cat/recovery/logs-*?format=json&active_only=false&detailed=true',
			response: catRecoveryRows,
			run: () =>
				Cat.recovery(ctx, {
					index: 'logs-*',
					detailed: true,
					active_only: false,
				}),
		},
		{
			name: 'cat.repositories GETs repositories',
			url: 'http://es:9200/_cat/repositories?format=json',
			response: catRepositoriesRows,
			run: () => Cat.repositories(ctx, {}),
		},
		{
			name: 'cat.segments targets an index with wildcard expansion',
			url: 'http://es:9200/_cat/segments/logs-*?format=json&expand_wildcards=open',
			response: catSegmentsRows,
			run: () =>
				Cat.segments(ctx, { index: 'logs-*', expand_wildcards: 'open' }),
		},
		{
			name: 'cat.shards targets an index',
			url: 'http://es:9200/_cat/shards/logs-2026-11?format=json',
			response: catShardsRows,
			run: () => Cat.shards(ctx, { index: 'logs-2026-11' }),
		},
		{
			name: 'cat.snapshots targets a repository',
			url: 'http://es:9200/_cat/snapshots/my-repo?format=json&ignore_unavailable=true',
			response: catSnapshotsRows,
			run: () =>
				Cat.snapshots(ctx, { repository: 'my-repo', ignore_unavailable: true }),
		},
		{
			name: 'cat.tasks joins action and node filters',
			url: 'http://es:9200/_cat/tasks?format=json&actions=cluster%3A*%2Cindices%3A*&nodes=node-1&detailed=true',
			response: catTasksRows,
			run: () =>
				Cat.tasks(ctx, {
					actions: ['cluster:*', 'indices:*'],
					nodes: 'node-1',
					detailed: true,
				}),
		},
		{
			name: 'cat.templates filters by name',
			url: 'http://es:9200/_cat/templates/logs-*?format=json',
			response: catTemplatesRows,
			run: () => Cat.templates(ctx, { name: 'logs-*' }),
		},
		{
			name: 'cat.threadPool takes pool patterns',
			url: 'http://es:9200/_cat/thread_pool/search*?format=json',
			response: catThreadPoolRows,
			run: () => Cat.threadPool(ctx, { thread_pool_patterns: 'search*' }),
		},
		{
			name: 'cat.transforms pages with from and size',
			url: 'http://es:9200/_cat/transforms/logs-*?format=json&from=0&size=10',
			response: catTransformsRows,
			run: () =>
				Cat.transforms(ctx, { transform_id: 'logs-*', from: 0, size: 10 }),
		},
		{
			name: 'nodes.info targets nodes and metrics in the path',
			url: 'http://es:9200/_nodes/node-1,node-2/jvm,os?flat_settings=true',
			response: nodesInfoOutput,
			run: () =>
				Nodes.info(ctx, {
					node_id: 'node-1,node-2',
					metric: 'jvm,os',
					flat_settings: true,
				}),
		},
		{
			name: 'nodes.stats builds the metric and index_metric path',
			url: 'http://es:9200/_nodes/node-1/stats/indices,os/docs,store?level=shards',
			response: nodesStatsOutput,
			run: () =>
				Nodes.stats(ctx, {
					node_id: 'node-1',
					metric: 'indices,os',
					index_metric: 'docs,store',
					level: 'shards',
				}),
		},
		{
			name: 'nodes.stats without filters hits the bare stats path',
			url: 'http://es:9200/_nodes/stats',
			response: nodesStatsOutput,
			run: () => Nodes.stats(ctx, {}),
		},
		{
			name: 'nodes.usage filters by metric',
			url: 'http://es:9200/_nodes/usage/rest_actions',
			response: nodesUsageOutput,
			run: () => Nodes.usage(ctx, { metric: 'rest_actions' }),
		},
		{
			name: 'nodes.hotThreads returns the text dump',
			url: 'http://es:9200/_nodes/node-1/hot_threads?threads=5&type=cpu',
			text: true,
			response: nodesHotThreadsText,
			run: () =>
				Nodes.hotThreads(ctx, { node_id: 'node-1', threads: 5, type: 'cpu' }),
		},
		{
			name: 'nodes.reloadSecureSettings POSTs to the node path',
			url: 'http://es:9200/_nodes/node-1/reload_secure_settings?timeout=30s',
			method: 'POST',
			response: nodesReloadSecureSettingsOutput,
			run: () =>
				Nodes.reloadSecureSettings(ctx, { node_id: 'node-1', timeout: '30s' }),
		},
		{
			name: 'nodes.repositoriesMetering hits the metering path',
			url: 'http://es:9200/_nodes/_repositories_metering',
			response: nodesRepositoriesMeteringOutput,
			run: () => Nodes.repositoriesMetering(ctx, {}),
		},
		{
			name: 'nodes.clearRepositoriesMetering DELETEs up to a version',
			url: 'http://es:9200/_nodes/node-1/_repositories_metering/3',
			method: 'DELETE',
			response: nodesClearRepositoriesMeteringOutput,
			run: () =>
				Nodes.clearRepositoriesMetering(ctx, {
					node_id: 'node-1',
					max_archive_version: 3,
				}),
		},
		{
			name: 'tasks.list passes actions, group_by and nodes',
			url: 'http://es:9200/_tasks?detailed=true&group_by=parents&actions=cluster%3A*',
			response: tasksListOutput,
			run: () =>
				Tasks.list(ctx, {
					actions: 'cluster:*',
					detailed: true,
					group_by: 'parents',
				}),
		},
		{
			name: 'tasks.get URL-encodes the task id',
			url: 'http://es:9200/_tasks/oTUltX4IQMOUUVeiohTt8A%3A124?wait_for_completion=true',
			response: taskGetOutput,
			run: () =>
				Tasks.get(ctx, {
					task_id: 'oTUltX4IQMOUUVeiohTt8A:124',
					wait_for_completion: true,
				}),
		},
		{
			name: 'tasks.cancel POSTs the cancel path with filters',
			url: 'http://es:9200/_tasks/oTUltX4IQMOUUVeiohTt8A%3A124/_cancel?actions=indices%3A*',
			method: 'POST',
			response: tasksListOutput,
			run: () =>
				Tasks.cancel(ctx, {
					task_id: 'oTUltX4IQMOUUVeiohTt8A:124',
					actions: 'indices:*',
				}),
		},
	];

	it.each(cases)('$name', async (wire) => {
		if (wire.text) {
			mockText(String(wire.response));
		} else if (wire.empty) {
			mockEmptyBody();
		} else {
			mockJson(wire.response);
		}
		const result = await wire.run();
		// The output schema parsed the mock before this assertion ran; a typed
		// field read proves the caller sees the parsed body.
		expect(result).toBeDefined();
		const { url, init } = await sent();
		expect(url).toBe(wire.url);
		expect(init.method ?? 'GET').toBe(wire.method ?? 'GET');
		if (wire.body !== undefined) {
			expect(JSON.parse(String(init.body))).toEqual(wire.body);
		}
	});

	it('cluster.ping resolves a 404 HEAD to exists: false', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
		const result = await Cluster.ping(ctx, {});
		expect(result).toEqual({ exists: false });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('returns typed results from the parsed bodies', async () => {
		mockJson(clusterPendingTasksOutput);
		const pending = await Cluster.pendingTasks(ctx, {});
		expect(pending.tasks[0]?.insert_order).toBe(1001);

		mockJson(catShardsRows);
		const shards = await Cat.shards(ctx, { index: 'logs-2026-11' });
		expect(shards[0]?.state).toBe('STARTED');
		expect(shards[0]?.['unassigned.reason']).toBeNull();

		mockText(nodesHotThreadsText);
		const hot = await Nodes.hotThreads(ctx, {});
		expect(hot).toContain('Hot threads');

		mockJson(taskGetOutput);
		const task = await Tasks.get(ctx, {
			task_id: 'oTUltX4IQMOUUVeiohTt8A:124',
		});
		expect(task.completed).toBe(true);
		expect(task.task.cancellable).toBe(true);
	});

	it('accepts empty cat results as valid empty arrays', async () => {
		for (const run of [
			() => Cat.aliases(ctx, {}),
			() => Cat.allocation(ctx, {}),
			() => Cat.circuitBreakers(ctx, {}),
			() => Cat.componentTemplates(ctx, {}),
			() => Cat.count(ctx, {}),
			() => Cat.fielddata(ctx, {}),
			() => Cat.health(ctx, {}),
			() => Cat.master(ctx, {}),
			() => Cat.mlJobs(ctx, {}),
			() => Cat.mlDataFrameAnalytics(ctx, {}),
			() => Cat.mlDatafeeds(ctx, {}),
			() => Cat.mlTrainedModels(ctx, {}),
			() => Cat.nodeattrs(ctx, {}),
			() => Cat.nodes(ctx, {}),
			() => Cat.pendingTasks(ctx, {}),
			() => Cat.plugins(ctx, {}),
			() => Cat.recovery(ctx, {}),
			() => Cat.repositories(ctx, {}),
			() => Cat.segments(ctx, {}),
			() => Cat.shards(ctx, {}),
			() => Cat.snapshots(ctx, {}),
			() => Cat.tasks(ctx, {}),
			() => Cat.templates(ctx, {}),
			() => Cat.threadPool(ctx, {}),
			() => Cat.transforms(ctx, {}),
		]) {
			mockJson([]);
			await expect(run()).resolves.toEqual([]);
		}
		expect(fetchMock).toHaveBeenCalledTimes(25);
	});
});
