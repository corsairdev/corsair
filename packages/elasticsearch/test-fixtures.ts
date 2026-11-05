// Wire-format response fixtures, trimmed from the Elasticsearch OpenAPI
// spec examples: https://www.elastic.co/docs/api/doc/elasticsearch.json
// Each one satisfies the operation's output schema.
import type {
	ByScrollResponse,
	CatAliasesOutput,
	CatAllocationOutput,
	CatCircuitBreakersOutput,
	CatComponentTemplatesOutput,
	CatCountOutput,
	CatFielddataOutput,
	CatHealthOutput,
	CatIndexRow,
	CatMasterOutput,
	CatMlDataFrameAnalyticsOutput,
	CatMlDatafeedsOutput,
	CatMlJobsOutput,
	CatMlTrainedModelsOutput,
	CatNodeattrsOutput,
	CatNodesOutput,
	CatPendingTasksOutput,
	CatPluginsOutput,
	CatRecoveryOutput,
	CatRepositoriesOutput,
	CatSegmentsOutput,
	CatShardsOutput,
	CatSnapshotsOutput,
	CatTasksOutput,
	CatTemplatesOutput,
	CatThreadPoolOutput,
	CatTransformsOutput,
	CcrFollowInfoOutput,
	CcrFollowOutput,
	CcrFollowStatsOutput,
	CcrForgetFollowerOutput,
	ClusterAllocationExplainOutput,
	ClusterGetHealthResponse,
	ClusterGetInfoResponse,
	ClusterGetSettingsOutput,
	ClusterGetStateOutput,
	ClusterGetStatsOutput,
	ClusterHealthReportOutput,
	ClusterPendingTasksOutput,
	ClusterPutSettingsOutput,
	ClusterRemoteInfoOutput,
	ClusterRerouteOutput,
	ClusterScriptContextsOutput,
	ClusterScriptLanguagesOutput,
	ClusterSslCertificatesOutput,
	ClusterSubsystemInfoOutput,
	DocumentsBulkOutput,
	DocumentsExplainOutput,
	DocumentsGetResponse,
	DocumentsMgetOutput,
	DocumentsMtermvectorsOutput,
	DocumentsUpdateOutput,
	ExistsResult,
	FleetGlobalCheckpointsOutput,
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
	MultiSearchResult,
	NodesClearRepositoriesMeteringOutput,
	NodesInfoOutput,
	NodesReloadSecureSettingsOutput,
	NodesRepositoriesMeteringOutput,
	NodesStatsOutput,
	NodesUsageOutput,
	SearchAsyncStatusOutput,
	SearchAsyncSubmitOutput,
	SearchCountOutput,
	SearchEqlOutput,
	SearchFieldCapsOutput,
	SearchGraphExploreOutput,
	SearchHit,
	SearchOpenPointInTimeOutput,
	SearchRankEvalOutput,
	SearchRunResponse,
	SearchShardsOutput,
	SearchTermsEnumOutput,
	SearchValidateQueryOutput,
	SecurityApiKeyItem,
	SecurityApiKeysBulkUpdateOutput,
	SecurityApiKeysGetOutput,
	SecurityApiKeysInvalidateOutput,
	SecurityApiKeysQueryOutput,
	SecurityAuthenticateOutput,
	SecurityCacheClearResponse,
	SecurityCreatedApiKey,
	SecurityGetUserPrivilegesOutput,
	SecurityHasPrivilegesOutput,
	SecurityPrivilegesGetBuiltinOutput,
	SecurityPrivilegesPutOutput,
	SecurityRoleDescriptor,
	SecurityRoleMapping,
	SecurityRoleMappingsGetOutput,
	SecurityRolesBulkDeleteOutput,
	SecurityRolesBulkPutOutput,
	SecurityRolesGetOutput,
	SecurityRolesQueryOutput,
	SecurityUser,
	SecurityUsersGetOutput,
	SecurityUsersQueryOutput,
	TasksGetOutput,
	TasksListOutput,
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

// ── search family fixtures ───────────────────────────────────────────────────

export const searchCountOutput: SearchCountOutput = {
	count: 42,
	_shards: { total: 1, successful: 1, failed: 0, skipped: 0 },
};

export const msearchResult: MultiSearchResult = {
	took: 12,
	responses: [
		{
			took: 8,
			hits: {
				total: { value: 1, relation: 'eq' },
				hits: [searchHit],
			},
			status: 200,
		},
		{
			status: 404,
			error: {
				type: 'index_not_found_exception',
				reason: 'no such index [missing]',
			},
		},
	],
};

export const msearchEmptyResult: MultiSearchResult = {
	took: 3,
	responses: [],
};

export const searchTermsEnumOutput: SearchTermsEnumOutput = {
	_shards: { total: 1, successful: 1, failed: 0, skipped: 0 },
	terms: ['error', 'error_boundary', 'errors'],
	complete: true,
};

export const searchFieldCapsOutput: SearchFieldCapsOutput = {
	indices: ['logs-2026-11'],
	fields: {
		level: {
			keyword: {
				type: 'keyword',
				searchable: true,
				aggregatable: true,
			},
		},
		message: {
			text: {
				type: 'text',
				searchable: true,
				aggregatable: false,
			},
		},
	},
};

export const searchShardsOutput: SearchShardsOutput = {
	nodes: {
		'node-1': {
			name: 'node-1',
			ephemeral_id: 'eph-1',
			transport_address: '10.0.0.1:9300',
		},
	},
	shards: [[{ state: 'STARTED', primary: true, node: 'node-1', shard: 0 }]],
	indices: { 'logs-2026-11': {} },
};

export const searchOpenPointInTimeOutput: SearchOpenPointInTimeOutput = {
	id: 'pit-46ToAwMDaWR5VG9rZW4iMmdKaFY0Yk1CbE5hNzQ2TnFmc2lTQg',
	_shards: { total: 1, successful: 1, failed: 0, skipped: 0 },
};

export const searchRankEvalOutput: SearchRankEvalOutput = {
	metric_score: 0.9,
	details: {
		my_query_id: {
			metric_score: 0.9,
			unrated_docs: [{ _index: 'logs-2026-11', _id: 'tZ0GinMB6Y5qFuDylF8J' }],
			hits: [
				{
					hit: { _index: 'logs-2026-11', _id: '1', _score: 1.5 },
					rating: 1,
				},
			],
		},
	},
	failures: {},
};

export const searchEqlOutput: SearchEqlOutput = {
	took: 15,
	timed_out: false,
	hits: {
		events: [
			{
				_index: 'logs-2026-11',
				_id: 'tZ0GinMB6Y5qFuDylF8J',
				_source: { event: { category: 'process' } },
			},
		],
	},
};

export const searchAsyncSubmitOutput: SearchAsyncSubmitOutput = {
	id: 'FmRldE8zREVEUzA2ZVpUeGs2ejJFUFEaEk03QUVQcG5KeWlBa8Kjc7KRrw',
	is_partial: true,
	is_running: true,
	start_time_in_millis: 1761955200000,
	expiration_time_in_millis: 1761955800000,
	response: {
		took: 3,
		hits: { hits: [searchHit] },
	},
};

export const searchGraphExploreOutput: SearchGraphExploreOutput = {
	took: 30,
	timed_out: false,
	vertices: [
		{ field: 'level', term: 'error', weight: 4, depth: 0 },
		{ field: 'host', term: 'node-2', weight: 2, depth: 1 },
	],
	connections: [{ source: 0, target: 1, doc_count: 2, weight: 2 }],
	failures: [],
};

export const searchValidateQueryOutput: SearchValidateQueryOutput = {
	valid: true,
	_shards: { total: 1, successful: 1, failed: 0, skipped: 0 },
	explanations: [{ index: 'logs-2026-11', valid: true }],
};

export const fleetGlobalCheckpointsOutput: FleetGlobalCheckpointsOutput = {
	global_checkpoints: [10, 25],
	timed_out: false,
};

// ── ccr fixtures ─────────────────────────────────────────────────────────────

export const ccrFollowOutput: CcrFollowOutput = {
	follow_index_created: true,
	follow_index_shards_acked: true,
	index_following_started: true,
};

export const ccrFollowInfoOutput: CcrFollowInfoOutput = {
	follower_indices: [
		{
			follower_index: 'logs-follower',
			leader_index: 'logs-2026-11',
			remote_cluster: 'leader_cluster',
			status: 'active',
		},
	],
};

export const ccrFollowStatsOutput: CcrFollowStatsOutput = {
	indices: [
		{
			index: 'logs-follower',
			shards: [
				{
					shard_id: 0,
					leader_global_checkpointer: 150,
					follower_global_checkpointer: 150,
				},
			],
		},
	],
};

export const ccrForgetFollowerOutput: CcrForgetFollowerOutput = {
	_shards: { total: 1, successful: 1, failed: 0, skipped: 0 },
};

// ── cluster family fixtures ──────────────────────────────────────────────────

export const clusterInfoOutput: ClusterGetInfoResponse = {
	name: 'node-1',
	cluster_name: 'es-test-cluster',
	cluster_uuid: 'AxNuG5LbQs6S3D4f9C-Rw',
	version: {
		number: '9.0.0',
		build_flavor: 'default',
		build_type: 'docker',
		build_hash: 'e337540bcebdd837e11b7c5d29f4bf0e4e6f5e1e',
		build_date: '2026-10-01T10:00:00.000Z',
		build_snapshot: false,
		lucene_version: '10.0.0',
		minimum_index_compatibility_version: '8.0.0',
		minimum_wire_compatibility_version: '8.0.0',
	},
	tagline: 'You Know, for Search',
};

export const clusterPendingTasksOutput: ClusterPendingTasksOutput = {
	tasks: [
		{
			insert_order: 1001,
			priority: 'URGENT',
			source: 'create-index [logs-2026-12], cause [api]',
			executing: false,
			time_in_queue_millis: 100,
			time_in_queue: '100ms',
		},
	],
};

export const clusterGetSettingsOutput: ClusterGetSettingsOutput = {
	persistent: { 'cluster.routing.allocation.enable': 'all' },
	transient: {},
	defaults: { 'cluster.max_shards_per_node': '1000' },
};

export const clusterPutSettingsOutput: ClusterPutSettingsOutput = {
	acknowledged: true,
	persistent: { 'cluster.routing.allocation.enable': 'all' },
	transient: {},
};

export const clusterRerouteOutput: ClusterRerouteOutput = {
	acknowledged: true,
	state: { cluster_uuid: 'AxNuG5LbQs6S3D4f9C-Rw' },
	explanations: [
		{
			command: 'move',
			decisions: [{ decider: 'same_shard', decision: 'NO', explanation: '' }],
			parameters: {
				index: 'logs-2026-11',
				shard: 0,
				from_node: 'node-1',
				to_node: 'node-2',
			},
		},
	],
};

export const clusterAllocationExplainOutput: ClusterAllocationExplainOutput = {
	index: 'logs-2026-11',
	shard: 0,
	primary: true,
	current_state: 'unassigned',
	can_allocate: 'no',
	allocate_explanation: "Elasticsearch isn't allowed to allocate this shard",
	explanation:
		'the shard cannot be allocated because too many shards are already on the node',
};

export const clusterRemoteInfoOutput: ClusterRemoteInfoOutput = {
	leader_cluster: {
		mode: 'sniff',
		connected: true,
		num_nodes_connected: 3,
		max_connections_per_cluster: 3,
		initial_connect_timeout: '30s',
		skip_unavailable: false,
		seeds: ['10.0.0.2:9300'],
	},
	proxy_cluster: {
		mode: 'proxy',
		connected: true,
		skip_unavailable: true,
		proxy_address: 'es.cloud.example:9443',
	},
};

export const clusterHealthReportOutput: ClusterHealthReportOutput = {
	cluster_name: 'es-test-cluster',
	indicators: {
		master_is_stable: {
			status: 'green',
			symptom: 'The cluster has a stable master node',
		},
		shards_availability: {
			status: 'yellow',
			symptom: 'Some replicas are not available',
			impacted_resources: [{ indices: ['logs-2026-11'] }],
		},
	},
};

export const clusterSslCertificatesOutput: ClusterSslCertificatesOutput = [
	{
		alias: 'http',
		expiry: '2027-10-01T10:00:00.000Z',
		format: 'PEM',
		has_private_key: false,
		path: '/etc/elasticsearch/certs/http.p12',
		serial_number: 'a1:b2:c3',
		subject_dn: 'CN=node-1',
		issuer: 'CN=Elastic Certificate Tool',
	},
];

export const clusterScriptContextsOutput: ClusterScriptContextsOutput = {
	contexts: [
		{
			name: 'filter',
			methods: [
				{ name: 'execute', return_type: 'boolean', params: [] },
				{ name: 'getScore', return_type: 'double', params: [] },
			],
		},
	],
};

export const clusterScriptLanguagesOutput: ClusterScriptLanguagesOutput = {
	types_allowed: ['inline', 'stored'],
	language_contexts: [
		{ language: 'painless', contexts: ['filter', 'score', 'ingest'] },
		{ language: 'expression', contexts: ['aggregation_context'] },
	],
};

export const clusterSubsystemInfoOutput: ClusterSubsystemInfoOutput = {
	cluster_name: 'es-test-cluster',
	http: { current_open: 3, total_opened: 12 },
};

export const clusterGetStatsOutput: ClusterGetStatsOutput = {
	cluster_name: 'es-test-cluster',
	cluster_uuid: 'AxNuG5LbQs6S3D4f9C-Rw',
	status: 'green',
	timestamp: 1761955200000,
	indices: { count: 5, shards: { total: 5 } },
	nodes: { count: { total: 3, coordinator: 1, data: 2 } },
};

export const clusterGetStateOutput: ClusterGetStateOutput = {
	cluster_uuid: 'AxNuG5LbQs6S3D4f9C-Rw',
	master_node: 'node-1',
};

// ── cat family fixtures: every value a string or null ───────────────────────

export const catHelpText =
	'=^.^=\n/_cat/allocation\n/_cat/shards\n/_cat/health\n';

export const catAliasesRows: CatAliasesOutput = [
	{
		alias: 'logs',
		index: 'logs-2026-11',
		filter: null,
		'routing.index': null,
		'routing.search': null,
		is_write_index: null,
	},
];

export const catAllocationRows: CatAllocationOutput = [
	{
		shards: '5',
		'disk.indices': '1.2gb',
		'disk.used': '10gb',
		'disk.avail': '20gb',
		'disk.total': '30gb',
		'disk.percent': '33',
		host: '10.0.0.1',
		ip: '10.0.0.1',
		node: 'node-1',
		'node.role': 'd',
	},
];

export const catCircuitBreakersRows: CatCircuitBreakersOutput = [
	{
		node_id: 'node-1',
		node_name: 'node-1',
		breaker: 'request',
		limit: '100%',
		limit_bytes: '16gb',
		estimated: '1%',
		estimated_bytes: '200mb',
		overhead: '1.0',
		tripped: '0',
	},
];

export const catComponentTemplatesRows: CatComponentTemplatesOutput = [
	{
		name: 'logs-mappings',
		version: '1',
		alias_count: '0',
		mapping_count: '3',
		settings_count: '2',
		metadata_count: '0',
		included_in: 'logs-template',
	},
];

export const catCountRows: CatCountOutput = [
	{ epoch: '1761955200', timestamp: '10:40:00', count: '4201' },
];

export const catFielddataRows: CatFielddataOutput = [
	{
		id: 'node-1',
		host: '10.0.0.1',
		ip: '10.0.0.1',
		node: 'node-1',
		field: 'host.name',
		size: '1.2kb',
	},
];

export const catHealthRows: CatHealthOutput = [
	{
		epoch: '1761955200',
		timestamp: '10:40:00',
		cluster: 'es-test-cluster',
		status: 'green',
		'node.total': '3',
		'node.data': '2',
		shards: '10',
		pri: '5',
		relo: '0',
		init: '0',
		unassign: '0',
	},
];

export const catMasterRows: CatMasterOutput = [
	{
		id: 'QGqKMntKQCSjWbwKK7wOHw',
		host: '10.0.0.1',
		ip: '10.0.0.1',
		node: 'node-1',
	},
];

export const catMlJobsRows: CatMlJobsOutput = [
	{
		id: 'total-requests',
		state: 'opened',
		'data.processed_records': '4201',
		'model.bytes': '51200',
		'model.memory_status': 'ok',
		'forecasts.total': '1',
		'buckets.count': '140',
	},
];

export const catMlDataFrameAnalyticsRows: CatMlDataFrameAnalyticsOutput = [
	{ id: 'users-analytics', type: 'classification', state: 'started' },
];

export const catMlDatafeedsRows: CatMlDatafeedsOutput = [
	{ id: 'datafeed-total-requests', state: 'started', 'buckets.count': '140' },
];

export const catMlTrainedModelsRows: CatMlTrainedModelsOutput = [
	{
		id: 'lang_ident_model_1',
		created_by: '_xpack',
		create_time: '1660000000000',
		version: '9.0.0',
		description: 'language identification',
		heap_size: '16kb',
		operations: '0',
	},
];

export const catNodeattrsRows: CatNodeattrsOutput = [
	{
		node: 'node-1',
		host: '10.0.0.1',
		ip: '10.0.0.1',
		attr: 'rack',
		value: 'r1',
	},
];

export const catNodesRows: CatNodesOutput = [
	{
		id: 'QGqKMntKQCSjWbwKK7wOHw',
		name: 'node-1',
		ip: '10.0.0.1',
		'heap.percent': '40',
		'ram.percent': '60',
		cpu: '12',
		master: '*',
		role: 'cdhilmrstw',
		version: '9.0.0',
	},
];

export const catPendingTasksRows: CatPendingTasksOutput = [
	{
		insertOrder: '1001',
		timeInQueue: '100ms',
		priority: 'URGENT',
		source: 'create-index [logs-2026-12]',
	},
];

export const catPluginsRows: CatPluginsOutput = [
	{
		id: 'QGqKMntKQCSjWbwKK7wOHw',
		name: 'analysis-icu',
		component: 'analysis-icu',
		version: '9.0.0',
		description: 'ICU analysis plugin',
		type: 'isolated',
	},
];

export const catRecoveryRows: CatRecoveryOutput = [
	{
		index: 'logs-2026-11',
		shard: '0',
		start_time: '1761955200000',
		type: 'empty_store',
		stage: 'done',
		source_host: 'n/a',
		target_host: '10.0.0.1',
		repository: null,
		snapshot: null,
		files: '1',
		bytes_recovered: '100',
		bytes_percent: '100.0%',
	},
];

export const catRepositoriesRows: CatRepositoriesOutput = [
	{ id: 'my-repo', type: 'fs' },
];

export const catSegmentsRows: CatSegmentsOutput = [
	{
		index: 'logs-2026-11',
		shard: '0',
		prirep: 'p',
		ip: '10.0.0.1',
		segment: '_0',
		generation: '0',
		'docs.count': '1',
		'docs.deleted': '0',
		size: '3kb',
		'size.memory': '0',
		committed: 'true',
		version: '10.0.0',
	},
];

export const catShardsRows: CatShardsOutput = [
	{
		index: 'logs-2026-11',
		shard: '0',
		prirep: 'p',
		state: 'STARTED',
		docs: '4201',
		store: '1.2mb',
		ip: '10.0.0.1',
		node: 'node-1',
		'unassigned.reason': null,
	},
];

export const catSnapshotsRows: CatSnapshotsOutput = [
	{
		id: 'snapshot-1',
		repository: 'my-repo',
		status: 'SUCCESS',
		start_epoch: '1761955200',
		end_epoch: '1761955300',
		start_time: '10:40:00',
		end_time: '10:41:40',
		duration: '1.6m',
		indices: '5',
	},
];

export const catTasksRows: CatTasksOutput = [
	{
		id: 'oTUltX4IQMOUUVeiohTt8A:124',
		action: 'cluster:monitor/tasks/lists',
		task_id: 'oTUltX4IQMOUUVeiohTt8A:124',
		parent_task_id: null,
		type: 'transport',
		start_time: '1761955200000',
		timestamp: '10:40:00',
		running_time_ns: '1000000',
		node_id: 'oTUltX4IQMOUUVeiohTt8A',
		node: 'node-1',
	},
];

export const catTemplatesRows: CatTemplatesOutput = [
	{
		name: 'logs-template',
		index_patterns: 'logs-*',
		order: '0',
		version: null,
		composed_of: 'logs-mappings',
	},
];

export const catThreadPoolRows: CatThreadPoolOutput = [
	{
		node_name: 'node-1',
		name: 'search',
		type: 'fixed',
		active: '1',
		pool_size: '13',
		queue: '0',
		rejected: '0',
	},
];

export const catTransformsRows: CatTransformsOutput = [
	{
		id: 'logs-pivot',
		state: 'started',
		checkpoint: '140',
		documents_processed: '4201',
		checkpoint_progress: '100.0%',
		last_search_time: '1761955200000',
		changes_last_detection_time: '1761955100000',
	},
];

// ── nodes family fixtures ────────────────────────────────────────────────────

const nodesEnvelope = {
	cluster_name: 'es-test-cluster',
	_nodes: { total: 3, successful: 3, failed: 0 },
};

export const nodesInfoOutput: NodesInfoOutput = {
	...nodesEnvelope,
	nodes: {
		'node-1': {
			name: 'node-1',
			transport_address: '10.0.0.1:9300',
			roles: ['data'],
			os: { available_processors: 8 },
		},
	},
};

export const nodesStatsOutput: NodesStatsOutput = {
	...nodesEnvelope,
	nodes: {
		'node-1': {
			timestamp: 1761955200000,
			name: 'node-1',
			indices: { docs: { count: 4201 } },
		},
	},
};

export const nodesUsageOutput: NodesUsageOutput = {
	...nodesEnvelope,
	nodes: {
		'node-1': {
			timestamp: 1761955200000,
			since: 1761950000000,
			rest_actions: { search_action: 10 },
		},
	},
};

export const nodesHotThreadsText =
	'::: {node-1}{QGqKMntKQCSjWbwKK7wOHw}{10.0.0.1}{dim}{10.0.0.1:9300}\n   Hot threads at 2026-11-01 10:40:00, interval=500ms, busiestThreads=3\n';

export const nodesReloadSecureSettingsOutput: NodesReloadSecureSettingsOutput =
	{
		...nodesEnvelope,
		nodes: {
			'node-1': { name: 'node-1', stats: { reloaded_secure_settings: 2 } },
		},
	};

export const nodesRepositoriesMeteringOutput: NodesRepositoriesMeteringOutput =
	{
		...nodesEnvelope,
		nodes: {
			'node-1': {
				cloud_repository: { repository_metering: { searched_snapshots: {} } },
			},
		},
	};

export const nodesClearRepositoriesMeteringOutput: NodesClearRepositoriesMeteringOutput =
	{
		...nodesEnvelope,
		nodes: { 'node-1': {} },
	};

// ── tasks family fixtures ────────────────────────────────────────────────────

export const tasksListOutput: TasksListOutput = {
	nodes: {
		'node-1': {
			name: 'node-1',
			transport_address: '10.0.0.1:9300',
			tasks: {
				'oTUltX4IQMOUUVeiohTt8A:124': {
					node: 'node-1',
					id: 124,
					type: 'transport',
					action: 'cluster:monitor/tasks/lists',
					start_time_in_millis: 1761955200000,
					running_time_in_nanos: 1000000,
					cancellable: false,
					headers: {},
				},
			},
		},
	},
};

export const taskGetOutput: TasksGetOutput = {
	completed: true,
	task: {
		node: 'node-1',
		id: 124,
		type: 'transport',
		action: 'indices:data/write/reindex',
		start_time_in_millis: 1761955200000,
		running_time_in_nanos: 5000000,
		cancellable: true,
		headers: {},
		description: 'reindex from logs-2025 to logs-2026',
	},
	response: { total: 4201, updated: 4201 },
};

// ── security family fixtures ─────────────────────────────────────────────────

export const securityApiKeyItem: SecurityApiKeyItem = {
	id: 'VuaOCfVY4sH4Qf7d9CAAa3',
	name: 'my-api-key',
	type: 'rest',
	creation: 1761955200000,
	invalidated: false,
	username: 'elastic',
	realm: 'default_file',
	realm_type: 'file',
	metadata: { application: 'logs-agent' },
};

export function securityApiKeysGetOutput(
	items: SecurityApiKeyItem[] = [securityApiKeyItem],
): SecurityApiKeysGetOutput {
	return { api_keys: items };
}

export const securityCreatedApiKey: SecurityCreatedApiKey = {
	id: 'VuaOCfVY4sH4Qf7d9CAAa3',
	name: 'my-api-key',
	api_key: 'u3Vlc3QtdXNlci1hcGkta2V5LXBsZWFzZS1pZ25vcmUtbWU',
	encoded: 'VnVhT0NmVlk0c0g0UWY3ZDlDQUFhMzp1M1ZsYzNNRFEwT2ZpQnFsZUP1NLZiOFh3',
};

export const securityApiKeysInvalidateOutput: SecurityApiKeysInvalidateOutput =
	{
		error_count: 0,
		invalidated_api_keys: ['VuaOCfVY4sH4Qf7d9CAAa3'],
		previously_invalidated_api_keys: [],
	};

export const securityApiKeysBulkUpdateOutput: SecurityApiKeysBulkUpdateOutput =
	{
		noops: [],
		updated: ['VuaOCfVY4sH4Qf7d9CAAa3'],
	};

export const securityApiKeysUpdateOutput = { updated: true } as const;

export const securityCacheClearOutput: SecurityCacheClearResponse = {
	_nodes: { total: 3, successful: 3, failed: 0 },
	cluster_name: 'es-test-cluster',
	nodes: { 'node-1': { name: 'node-1' } },
};

export const securityApiKeysQueryOutput: SecurityApiKeysQueryOutput = {
	total: 1,
	count: 1,
	api_keys: [securityApiKeyItem],
};

export const securityUserRow: SecurityUser = {
	username: 'jacknich',
	roles: ['admin', 'other_role1'],
	full_name: 'Jack Nicholson',
	email: 'jacknich@example.com',
	metadata: { intelligence: 7 },
	enabled: true,
};

export function securityUsersGetOutput(
	users: Record<string, SecurityUser> = { jacknich: securityUserRow },
): SecurityUsersGetOutput {
	return users;
}

export const securityAuthenticateOutput: SecurityAuthenticateOutput = {
	username: 'elastic',
	roles: ['superuser'],
	enabled: true,
	authentication_type: 'API key',
	authentication_realm: { name: '_es_api_key', type: 'api_key' },
	lookup_realm: { name: 'default_file', type: 'file' },
	metadata: {},
	api_key: {
		id: 'VuaOCfVY4sH4Qf7d9CAAa3',
		name: 'my-api-key',
		managed_by: 'elasticsearch',
		internal: false,
	},
};

export const securityHasPrivilegesOutput: SecurityHasPrivilegesOutput = {
	username: 'jacknich',
	has_all_requested: true,
	cluster: { monitor: true, manage: false },
	index: { 'logs-*': { read: true } },
};

export const securityGetUserPrivilegesOutput: SecurityGetUserPrivilegesOutput =
	{
		applications: [
			{
				application: 'myapp',
				privileges: ['read', 'write'],
				resources: ['*'],
			},
		],
		cluster: ['monitor', 'manage_api_key'],
		global: [],
		indices: [{ names: ['logs-*'], privileges: ['read'] }],
		run_as: [],
	};

export const securityUsersQueryOutput: SecurityUsersQueryOutput = {
	total: 1,
	count: 1,
	users: [securityUserRow],
};

export const securityLogsReaderRole: SecurityRoleDescriptor = {
	cluster: ['monitor'],
	indices: [
		{
			names: ['logs-*'],
			privileges: ['read', 'view_index_metadata'],
		},
	],
};

export const securityRolesGetOutput: SecurityRolesGetOutput = {
	'logs-reader': securityLogsReaderRole,
};

export const securityRoleMapping: SecurityRoleMapping = {
	enabled: true,
	roles: ['logs-reader'],
	rules: { any: [{ field: { 'metadata.department': 'operations' } }] },
};

export const securityRoleMappingsGetOutput: SecurityRoleMappingsGetOutput = {
	operations_mapping: securityRoleMapping,
};

export const securityRolesBulkPutOutput: SecurityRolesBulkPutOutput = {
	created: ['logs-reader'],
	updated: [],
	noop: [],
};

export const securityRolesBulkDeleteOutput: SecurityRolesBulkDeleteOutput = {
	deleted: ['old-role'],
	not_found: [],
};

export const securityRolesQueryOutput: SecurityRolesQueryOutput = {
	total: 1,
	count: 1,
	roles: [{ cluster: ['monitor'] }],
};

export const securityPrivilegesPutOutput: SecurityPrivilegesPutOutput = {
	myapp: {
		read: { created: true },
	},
};

export const securityPrivilegesGetBuiltinOutput: SecurityPrivilegesGetBuiltinOutput =
	{
		cluster: ['monitor', 'manage'],
		index: ['all', 'create', 'delete', 'read', 'write'],
		remote_cluster: ['monitor_enrich', 'monitor_stats'],
	};

export const searchAsyncStatusOutput: SearchAsyncStatusOutput = {
	id: 'FmRldE8zREVEUzA2ZVpUeGs2dmJFUZRWWG5PQF9B',
	is_running: false,
	is_partial: false,
	start_time_in_millis: 1758_000_000_000,
	expiration_time_in_millis: 1758_000_300_000,
};
