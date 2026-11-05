// Wire-format response fixtures, trimmed from the Elasticsearch OpenAPI
// spec examples: https://www.elastic.co/docs/api/doc/elasticsearch.json
// Each one satisfies the operation's output schema.
import type {
	ByScrollResponse,
	CatIndexRow,
	ClusterGetHealthResponse,
	DocumentsBulkOutput,
	DocumentsExplainOutput,
	DocumentsGetResponse,
	DocumentsMgetOutput,
	DocumentsMtermvectorsOutput,
	DocumentsUpdateOutput,
	ExistsResult,
	IndicesAddBlockOutput,
	IndicesAnalyzeOutput,
	IndicesCloseOutput,
	IndicesCreateOutput,
	IndicesDeleteAliasOutput,
	IndicesDeleteOutput,
	IndicesDeprecationsOutput,
	IndicesDownsampleOutput,
	IndicesGetResponse,
	IndicesGetSettingsOutput,
	IndicesIlmRemoveOutput,
	IndicesListResponse,
	IndicesOpenOutput,
	IndicesRemoveBlockOutput,
	IndicesResizeOutput,
	IndicesRolloverOutput,
	IndicesSearchableSnapshotStatsOutput,
	IndicesStatsOutput,
	LifecycleIndices,
	SearchHit,
	SearchRunResponse,
	TermVectorsResult,
	WriteResponse,
} from './endpoints/types';

export const clusterHealth: ClusterGetHealthResponse = {
	cluster_name: 'es-test-cluster',
	status: 'green',
	timed_out: false,
	number_of_nodes: 3,
	number_of_data_nodes: 2,
	active_primary_shards: 12,
	active_shards: 24,
	unassigned_shards: 0,
	unassigned_primary_shards: 0,
	initializing_shards: 0,
	relocating_shards: 0,
	delayed_unassigned_shards: 0,
	number_of_pending_tasks: 0,
	number_of_in_flight_fetch: 0,
	task_max_waiting_in_queue_millis: 0,
	active_shards_percent_as_number: 100,
	active_shards_percent: '100.0%',
	task_max_waiting_in_queue: '0s',
};

export const catIndexRow: CatIndexRow = {
	health: 'green',
	status: 'open',
	index: 'logs-2026-11',
	uuid: 'AxNuG5LbQs6tS3D4f9C-Rw',
	pri: '1',
	rep: '1',
	'docs.count': '4201',
	'docs.deleted': '0',
	'creation.date.string': '2026-11-01T00:00:00.000Z',
	'store.size': '1.2mb',
	'pri.store.size': '600kb',
};

export function catIndices(rows: CatIndexRow[] = [catIndexRow]) {
	return rows satisfies IndicesListResponse;
}

export const indexInfo: IndicesGetResponse = {
	'logs-2026-11': {
		aliases: {},
		mappings: {
			properties: {
				'@timestamp': { type: 'date' },
				level: { type: 'keyword' },
			},
		},
		settings: {
			index: {
				'creation.date': '1761955200000',
				number_of_shards: '1',
				number_of_replicas: '1',
				uuid: 'AxNuG5LbQs6tS3D4f9C-Rw',
				version: { created: '9020000' },
				provided_name: 'logs-2026-11',
			},
		},
	},
};

export const searchHit: SearchHit = {
	_index: 'logs-2026-11',
	_id: 'tZ0GinMB6Y5qFuDylF8J',
	_score: 1.3862942,
	_source: {
		'@timestamp': '2026-11-04T12:00:00.000Z',
		level: 'error',
		message: 'disk on node 2 above 90%',
	},
};

export function searchResponse(
	hits: SearchHit[] = [searchHit],
	total: SearchRunResponse['hits']['total'] = {
		value: hits.length,
		relation: 'eq',
	},
): SearchRunResponse {
	return {
		took: 5,
		timed_out: false,
		_shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
		hits: {
			total,
			max_score: hits.length > 0 ? 1.3862942 : null,
			hits,
		},
	};
}

export const documentFound: DocumentsGetResponse = {
	_index: 'logs-2026-11',
	_id: 'tZ0GinMB6Y5qFuDylF8J',
	_version: 1,
	_seq_no: 0,
	_primary_term: 1,
	found: true,
	_source: {
		'@timestamp': '2026-11-04T12:00:00.000Z',
		level: 'error',
		message: 'disk on node 2 above 90%',
	},
};

export const documentMissing: DocumentsGetResponse = {
	_index: 'logs-2026-11',
	_id: 'does-not-exist',
	found: false,
};

export function esErrorBody(
	status: number,
	type: string,
	reason: string,
): { error: { type: string; reason: string }; status: number } {
	return { error: { type, reason }, status };
}

export const existsTrue: ExistsResult = { exists: true };
export const existsFalse: ExistsResult = { exists: false };

const shardStats = { total: 2, successful: 1, failed: 0, skipped: 0 };

export const writeResponse: WriteResponse = {
	_index: 'logs-2026-11',
	_id: 'tZ0GinMB6Y5qFuDylF8J',
	_version: 1,
	result: 'created',
	_shards: shardStats,
	_seq_no: 0,
	_primary_term: 1,
};

export const writeResponseNotFound: WriteResponse = {
	_index: 'logs-2026-11',
	_id: 'does-not-exist',
	_version: 1,
	result: 'not_found',
	_shards: shardStats,
	_seq_no: 0,
	_primary_term: 1,
};

export const updateResponse: DocumentsUpdateOutput = {
	...writeResponse,
	result: 'updated',
	get: {
		found: true,
		_source: {
			'@timestamp': '2026-11-04T12:00:00.000Z',
			level: 'warn',
			message: 'disk on node 2 above 80%',
		},
	},
};

export function byScrollResponse(
	overrides: Partial<ByScrollResponse> = {},
): ByScrollResponse {
	return {
		took: 67,
		timed_out: false,
		total: 117,
		updated: 117,
		deleted: 0,
		noops: 0,
		batches: 1,
		version_conflicts: 0,
		retries: { bulk: 0, search: 0 },
		failures: [],
		requests_per_second: -1,
		throttled_millis: 0,
		throttled_until_millis: 0,
		...overrides,
	};
}

export const mgetResponse: DocumentsMgetOutput = {
	docs: [
		documentFound,
		documentMissing,
		{
			_index: 'logs-2026-10',
			_id: 'other-index-doc',
			found: true,
			_source: { level: 'info' },
		},
	],
};

export const termvectorsResult: TermVectorsResult = {
	_index: 'logs-2026-11',
	_id: 'tZ0GinMB6Y5qFuDylF8J',
	_version: 1,
	found: true,
	took: 4,
	term_vectors: {
		message: {
			field_statistics: { doc_count: 4201, sum_doc_freq: 9000, sum_ttf: 12000 },
			terms: { disk: { term_freq: 1, tokens: [{ position: 0 }] } },
		},
	},
};

export const mtermvectorsResponse: DocumentsMtermvectorsOutput = {
	docs: [termvectorsResult],
};

export const bulkResponse: DocumentsBulkOutput = {
	errors: false,
	took: 30,
	items: [
		{
			index: {
				_index: 'logs-2026-11',
				_id: '1',
				_version: 1,
				result: 'created',
				status: 201,
			},
		},
		{
			delete: {
				_index: 'logs-2026-11',
				_id: '2',
				result: 'not_found',
				status: 404,
				error: { type: 'document_missing_exception', reason: 'no doc' },
			},
		},
	],
};

export const explainResponse: DocumentsExplainOutput = {
	_index: 'logs-2026-11',
	_id: 'tZ0GinMB6Y5qFuDylF8J',
	matched: true,
	explanation: {
		value: 1.3862942,
		description: 'weight(message:disk in 0) [PerFieldSimilarity]',
		details: [],
	},
};

// ── indices lifecycle fixtures ───────────────────────────────────────────────

export const acknowledgedResponse = { acknowledged: true } as const;

export const indicesCreateOutput: IndicesCreateOutput = {
	acknowledged: true,
	index: 'logs-2026-12',
	shards_acknowledged: true,
};

export const indicesOpenOutput: IndicesOpenOutput = {
	acknowledged: true,
	shards_acknowledged: true,
};

export const indicesCloseOutput: IndicesCloseOutput = {
	acknowledged: true,
	shards_acknowledged: true,
	indices: { 'logs-2026-11': { closed: true } },
};

export const indicesDeleteOutput: IndicesDeleteOutput = {
	acknowledged: true,
};

export const indicesAddBlockOutput: IndicesAddBlockOutput = {
	acknowledged: true,
	shards_acknowledged: true,
	indices: [{ name: 'logs-2026-11', blocked: true }],
};

export const indicesRemoveBlockOutput: IndicesRemoveBlockOutput = {
	acknowledged: true,
	indices: [{ name: 'logs-2026-11', unblocked: true }],
};

export const indicesGetMappingOutput = {
	'logs-2026-11': {
		mappings: {
			properties: {
				'@timestamp': { type: 'date' },
				level: { type: 'keyword' },
			},
		},
	},
} as const;

export const indicesGetFieldMappingOutput = {
	'logs-2026-11': {
		mappings: {
			level: { full_name: 'level', mapping: { level: { type: 'keyword' } } },
		},
	},
} as const;

export const indicesGetSettingsOutput: IndicesGetSettingsOutput = {
	'logs-2026-11': {
		settings: {
			index: { number_of_shards: '1', number_of_replicas: '1' },
		},
	},
};

export const indicesGetAliasOutput = {
	'logs-2026-11': {
		aliases: { 'logs-current': { is_write_index: false } },
	},
} as const;

export const indicesPutAliasOutput = { acknowledged: true } as const;

export const indicesDeleteAliasOutput: IndicesDeleteAliasOutput = {
	acknowledged: true,
};

export const indicesRolloverOutput: IndicesRolloverOutput = {
	acknowledged: true,
	conditions: { '[_conditions][max_size]': true },
	dry_run: false,
	new_index: 'logs-000002',
	old_index: 'logs-000001',
	rolled_over: true,
	shards_acknowledged: true,
};

export const indicesResizeOutput: IndicesResizeOutput = {
	acknowledged: true,
	shards_acknowledged: true,
	index: 'logs-2026-11-clone',
};

export const indicesDownsampleOutput: IndicesDownsampleOutput = {
	acknowledged: true,
	shards_acknowledged: true,
};

export const indicesAnalyzeOutput: IndicesAnalyzeOutput = {
	tokens: [
		{
			token: 'disk',
			start_offset: 0,
			end_offset: 4,
			type: '<ALPHANUM>',
			position: 0,
		},
		{
			token: 'error',
			start_offset: 5,
			end_offset: 10,
			type: '<ALPHANUM>',
			position: 1,
		},
	],
};

// ── stats and maintenance fixtures ───────────────────────────────────────────

export const shardsOpResponse = {
	_shards: { total: 4, successful: 4, failed: 0, skipped: 0 },
} as const;

export const indicesStatsOutput: IndicesStatsOutput = {
	_shards: shardsOpResponse._shards,
	_all: {
		primaries: {},
		total: {},
	},
	indices: {
		'logs-2026-11': {
			uuid: 'AxNuG5LbQs6tS3D4f9C-Rw',
			health: 'green',
			primaries: { docs: { count: 4201, deleted: 0 } },
			total: { store: { size_in_bytes: 1_258_291 } },
		},
	},
};

export const indicesSegmentsOutput = {
	indices: {
		'logs-2026-11': {
			shards: {
				0: [
					{
						routing: { state: 'STARTED', primary: true, node: 'node-1' },
						num_committed_segments: 1,
						num_search_segments: 1,
						segments: {
							_0: {
								generation: 0,
								num_docs: 1,
								size_in_bytes: 260,
								committed: true,
								search: true,
							},
						},
					},
				],
			},
		},
	},
	_shards: shardsOpResponse._shards,
} as const;

export const indicesRecoveryOutput = {
	'logs-2026-11': {
		shards: [
			{
				id: 0,
				type: 'EMPTY_STORE',
				stage: 'DONE',
				primary: true,
				start_time_in_millis: 1761955200000,
				total_time_in_millis: 100,
				index: { size: { total_in_bytes: 0 } },
			},
		],
	},
} as const;

export const indicesShardStoresOutput = {
	indices: {
		'logs-2026-11': {
			shards: {
				0: {
					stores: [
						{
							'node-1': { sync_id: 'sync-1', allocation_id: 'alloc-1' },
						},
					],
				},
			},
		},
	},
} as const;

export const indicesFieldUsageStatsOutput = {
	_shards: shardsOpResponse._shards,
	'logs-2026-11': {
		id: 0,
		'shard-stats': {
			'search.total': 12,
			'search.query_time': '20ms',
			'aggregation.total': 3,
			fields: { message: 9, level: 3 },
		},
	},
} as const;

export const indicesReloadSearchAnalyzersOutput = {
	reload_details: [
		{
			index: 'logs-2026-11',
			reloaded_analyzers: ['my_synonyms'],
			reloaded_node_ids: ['node-1', 'node-2'],
		},
	],
	_shards: shardsOpResponse._shards,
} as const;

export const indicesDiskUsageOutput = {
	'logs-2026-11': {
		store_size_in_bytes: 1_258_291,
		fielddata: 0,
		fields: {
			_all: { total_in_bytes: 411, inverted_index: { total_in_bytes: 411 } },
		},
	},
} as const;

export const indicesDeprecationsOutput: IndicesDeprecationsOutput = {
	cluster_settings: [],
	index_settings: {
		'logs-2026-11': [
			{
				level: 'warning',
				message: 'Index name uses custom routing',
				url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/breaking-changes-9.0.html',
				details: 'custom routing is deprecated',
				resolve_during_rolling_upgrade: false,
			},
		],
	},
	data_streams: {},
	node_settings: [],
	ml_settings: [],
	templates: {},
	ilm_policies: {},
};

export const lifecycleIndicesOutput: LifecycleIndices = {
	indices: {
		'logs-2026-11': {
			index_name: '.logs-2026-11',
			managed: true,
			policy: 'logs-policy',
			index_creation_date_millis: 1761955200000,
			lifecycle_date_millis: 1761955200000,
			phase: 'hot',
			phase_time_millis: 1761955200001,
			action: 'rollover',
			step: 'check-rollover-ready',
		},
	},
};

export const indicesIlmRemoveOutput: IndicesIlmRemoveOutput = {
	failed_indexes: [],
	has_failures: false,
};

export const indicesSearchableSnapshotStatsOutput: IndicesSearchableSnapshotStatsOutput =
	{
		stats: {
			total: { index_n: 1, copy_n: 0, copy_cached_n: 0 },
			indices: {},
		},
		total: { reclaimed_bytes: 0, reclaimed_file_count: 0 },
	};
