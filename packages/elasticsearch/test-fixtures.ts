// Wire-format response fixtures, trimmed from the Elasticsearch OpenAPI
// spec examples: https://www.elastic.co/docs/api/doc/elasticsearch.json
// Each one satisfies the operation's output schema.
import type {
	CatIndexRow,
	ClusterGetHealthResponse,
	DocumentsGetResponse,
	IndicesGetResponse,
	IndicesListResponse,
	SearchHit,
	SearchRunResponse,
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
