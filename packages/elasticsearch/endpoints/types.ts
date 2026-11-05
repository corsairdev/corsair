import { z } from 'zod';

// Schemas follow the Elasticsearch OpenAPI spec (openapi 3.0.3) published at
// https://www.elastic.co/docs/api/doc/elasticsearch.json and the per-operation
// pages under https://www.elastic.co/docs/api/doc/elasticsearch/operation/.
// Outputs type the fields agents use and pass vendor additions through
// (`z.looseObject`); inputs are strict only where they become request bodies.

// Field values the typed query subset accepts. The full Query DSL allows more
// (per-field objects with boost, scripts, ...); v1 deliberately exposes only
// the leaf queries an agent needs, documented in README.md.
const QueryFieldValue = z.union([z.string(), z.number(), z.boolean()]);

const FieldMap = (value: z.ZodType) => z.record(z.string().min(1), value);

// Index names and document ids are caller-controlled path segments; blank
// strings are never valid targets.
const NonBlankString = z
	.string()
	.min(1)
	.regex(/\S/, 'Expected a non-blank string');

const MatchAllQuerySchema = z.strictObject({
	match_all: z.looseObject({}),
});
const MatchQuerySchema = z.strictObject({
	match: FieldMap(QueryFieldValue),
});
const MatchPhraseQuerySchema = z.strictObject({
	match_phrase: FieldMap(QueryFieldValue),
});
const TermQuerySchema = z.strictObject({
	term: FieldMap(QueryFieldValue),
});
const TermsQuerySchema = z.strictObject({
	terms: FieldMap(z.array(QueryFieldValue).min(1)),
});
const IdsQuerySchema = z.strictObject({
	ids: z.strictObject({ values: z.array(z.string().min(1)).min(1) }),
});

type LeafQuery =
	| z.infer<typeof MatchAllQuerySchema>
	| z.infer<typeof MatchQuerySchema>
	| z.infer<typeof MatchPhraseQuerySchema>
	| z.infer<typeof TermQuerySchema>
	| z.infer<typeof TermsQuerySchema>
	| z.infer<typeof IdsQuerySchema>;

// bool clauses take one query or a non-empty list of them.
type BoolQuery = {
	bool: {
		must?: SearchQuery | SearchQuery[];
		filter?: SearchQuery | SearchQuery[];
		should?: SearchQuery | SearchQuery[];
		must_not?: SearchQuery | SearchQuery[];
		minimum_should_match?: number | string;
	};
};

export type SearchQuery = LeafQuery | BoolQuery;

// A rule's clauses can nest more bool queries (Query DSL is recursive). The
// second type parameter keeps z.input<> from widening the field to unknown.
const QuerySchema: z.ZodType<SearchQuery, SearchQuery> = z.lazy(() =>
	z.union([
		MatchAllQuerySchema,
		MatchQuerySchema,
		MatchPhraseQuerySchema,
		TermQuerySchema,
		TermsQuerySchema,
		IdsQuerySchema,
		BoolQuerySchema,
	]),
);

const BoolQuerySchema = z.strictObject({
	bool: z.strictObject({
		must: z.union([QuerySchema, z.array(QuerySchema).min(1)]).optional(),
		filter: z.union([QuerySchema, z.array(QuerySchema).min(1)]).optional(),
		should: z.union([QuerySchema, z.array(QuerySchema).min(1)]).optional(),
		must_not: z.union([QuerySchema, z.array(QuerySchema).min(1)]).optional(),
		minimum_should_match: z
			.union([z.number().int().min(0), z.string().min(1)])
			.optional(),
	}),
});

// ── shared response fragments (spec _types.*) ───────────────────────────────

const ErrorCauseSchema = z.looseObject({
	type: z.string().optional(),
	reason: z.string().optional(),
});

const ShardStatisticsSchema = z.looseObject({
	total: z.number(),
	successful: z.number(),
	failed: z.number(),
	skipped: z.number().optional(),
	// Failures are open error-cause objects per shard.
	failures: z.array(z.looseObject({})).optional(),
});

// _types.AcknowledgedResponseBase
const AcknowledgedResponseSchema = z.looseObject({
	acknowledged: z.boolean(),
});

// _types.ShardsOperationResponseBase
const ShardsOperationResponseSchema = z.looseObject({
	_shards: ShardStatisticsSchema.optional(),
});

// _types.WriteResponseBase (index/create/update/delete document replies)
const WriteResponseSchema = z.looseObject({
	_id: z.string(),
	_index: z.string(),
	_version: z.number(),
	result: z.string(),
	_shards: ShardStatisticsSchema,
	_seq_no: z.number().optional(),
	_primary_term: z.number().optional(),
	forced_refresh: z.boolean().optional(),
});
export type WriteResponse = z.infer<typeof WriteResponseSchema>;

// z.unknown() values: the document source is caller-indexed JSON; no stricter
// value type can hold it (same precedent as SearchHit._source).
const SourceRecord = z.record(z.string(), z.unknown());

// Bulk-index-by-scroll replies (_delete_by_query, _update_by_query): every
// field is optional; failures carry a typed per-item error cause.
const ByScrollResponseSchema = z.looseObject({
	took: z.number().optional(),
	timed_out: z.boolean().optional(),
	total: z.number().optional(),
	updated: z.number().optional(),
	deleted: z.number().optional(),
	noops: z.number().optional(),
	batches: z.number().optional(),
	version_conflicts: z.number().optional(),
	retries: z.looseObject({ bulk: z.number(), search: z.number() }).optional(),
	failures: z
		.array(
			z.looseObject({
				index: z.string().optional(),
				id: z.string().optional(),
				status: z.number().optional(),
				cause: ErrorCauseSchema.optional(),
			}),
		)
		.optional(),
	task: z.string().optional(),
	requests_per_second: z.number().optional(),
	throttled_millis: z.number().optional(),
	throttled_until_millis: z.number().optional(),
});
export type ByScrollResponse = z.infer<typeof ByScrollResponseSchema>;

// ── shared request-param fragments ──────────────────────────────────────────

// _types.Refresh: `true` | `false` | `wait_for`.
const RefreshParam = z.union([z.boolean(), z.literal('wait_for')]);

// _types.WaitForActiveShards: `all`, `index-setting`, or a positive count.
const WaitForActiveShardsParam = z.union([
	z.literal('all'),
	z.literal('index-setting'),
	z.number().int().min(1),
]);

// _types.Script: an inline `source` or a stored `id`, plus optional params.
const ScriptSchema = z
	.strictObject({
		source: z.string().min(1).optional(),
		id: z.string().min(1).optional(),
		lang: z.string().min(1).optional(),
		// z.unknown() values: script params are arbitrary name/value pairs the
		// script itself defines.
		params: z.record(z.string(), z.unknown()).optional(),
	})
	.refine((script) => script.source !== undefined || script.id !== undefined, {
		message: 'script requires source or id',
	});

// _global.search._types.SourceConfigParam: enable/disable or field includes.
const SourceFilterParam = z.union([
	z.boolean(),
	z.array(z.string().min(1)).min(1),
]);

// Raw newline-delimited JSON (bulk, msearch). Every non-empty line must parse
// and the payload must end with the terminator newline the APIs require.
const NdjsonPayload = z
	.string()
	.min(2)
	.refine(
		(payload) =>
			payload.endsWith('\n') &&
			payload
				.split('\n')
				.slice(0, -1)
				.every((line) => {
					try {
						JSON.parse(line);
						return true;
					} catch {
						return false;
					}
				}),
		{ message: 'expected newline-delimited JSON terminated by a newline' },
	);

// ── cluster.getHealth: GET /_cluster/health/{index} ───────────────────────────

// The params become query filters, so the object is strict. `index` is the
// documented optional target (GET /_cluster/health targets every index).
export const ClusterGetHealthInputSchema = z.strictObject({
	index: NonBlankString.optional(),
	level: z.enum(['cluster', 'indices', 'shards']).optional(),
	expand_wildcards: z
		.string()
		.min(1)
		.refine(
			(value) =>
				value
					.split(',')
					.every((token) =>
						['all', 'open', 'closed', 'hidden', 'none'].includes(token.trim()),
					),
			{
				message:
					'expand_wildcards must be a comma-separated list of all, open, closed, hidden, none',
			},
		)
		.optional(),
	local: z.boolean().optional(),
	wait_for_status: z.enum(['green', 'yellow', 'red']).optional(),
	timeout: NonBlankString.optional(),
});
export type ClusterGetHealthInput = z.input<typeof ClusterGetHealthInputSchema>;

export const ClusterGetHealthResponseSchema = z.looseObject({
	cluster_name: z.string(),
	status: z.string(),
	timed_out: z.boolean(),
	number_of_nodes: z.number(),
	number_of_data_nodes: z.number(),
	active_primary_shards: z.number(),
	active_shards: z.number(),
	unassigned_shards: z.number(),
	unassigned_primary_shards: z.number().optional(),
	initializing_shards: z.number(),
	relocating_shards: z.number(),
	delayed_unassigned_shards: z.number(),
	number_of_pending_tasks: z.number(),
	number_of_in_flight_fetch: z.number(),
	task_max_waiting_in_queue_millis: z.number(),
	active_shards_percent_as_number: z.number(),
	active_shards_percent: z.string().optional(),
	task_max_waiting_in_queue: z.string().optional(),
	// level=indices|shards adds per-index (and per-shard) detail.
	indices: z.record(z.string(), z.looseObject({})).optional(),
});
export type ClusterGetHealthResponse = z.infer<
	typeof ClusterGetHealthResponseSchema
>;

// ── indices.list: GET /_cat/indices?format=json ──────────────────────────────

// `index` becomes a path filter, so the object is strict.
export const IndicesListInputSchema = z.strictObject({
	index: NonBlankString.optional(),
});
export type IndicesListInput = z.infer<typeof IndicesListInputSchema>;

const CatIndexRowSchema = z.looseObject({
	health: z.string().optional(),
	status: z.string().optional(),
	index: z.string(),
	uuid: z.string().optional(),
	pri: z.string().optional(),
	rep: z.string().optional(),
	'docs.count': z.string().nullable().optional(),
	'docs.deleted': z.string().nullable().optional(),
	'creation.date.string': z.string().optional(),
	'store.size': z.string().nullable().optional(),
	'pri.store.size': z.string().nullable().optional(),
});
export type CatIndexRow = z.infer<typeof CatIndexRowSchema>;

// Every CAT value arrives as a string (spec: array[object] of string fields);
// an empty cluster or a no-match wildcard returns an empty array, which is
// valid.
export const IndicesListResponseSchema = z.array(CatIndexRowSchema);
export type IndicesListResponse = z.infer<typeof IndicesListResponseSchema>;

// ── indices.get: GET /{index} ────────────────────────────────────────────────

export const IndicesGetInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesGetInput = z.infer<typeof IndicesGetInputSchema>;

export const IndicesGetResponseSchema = z.record(
	z.string().min(1),
	z.looseObject({
		aliases: z.record(z.string(), z.looseObject({})).optional(),
		mappings: z.looseObject({}).optional(),
		settings: z.record(z.string(), z.looseObject({})).optional(),
		data_streams: z.array(z.string()).optional(),
	}),
);
export type IndicesGetResponse = z.infer<typeof IndicesGetResponseSchema>;

// ── search.run: POST /{index}/_search ────────────────────────────────────────

// The whole object (minus `index`, which goes into the path) becomes the
// request body, so it is strict. `from`/`size` bounds come from the spec
// ("must be non-negative"; ES caps from+size paging at 10,000).
export const SearchRunInputSchema = z.strictObject({
	index: NonBlankString,
	query: QuerySchema.optional(),
	from: z.number().int().min(0).default(0),
	size: z.number().int().min(0).max(10_000).default(10),
	_source: z.union([z.boolean(), z.array(z.string().min(1)).min(1)]).optional(),
});
export type SearchRunInput = z.input<typeof SearchRunInputSchema>;

const SearchHitSchema = z.looseObject({
	_index: z.string(),
	_id: z.string(),
	_score: z.number().nullable().optional(),
	// z.unknown(): _source is whatever the caller indexed; any stricter value
	// type would reject valid documents.
	_source: z.record(z.string(), z.unknown()).optional(),
	_ignored: z.array(z.string()).optional(),
	sort: z
		.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
		.optional(),
});
export type SearchHit = z.infer<typeof SearchHitSchema>;

export const SearchRunResponseSchema = z.looseObject({
	took: z.number(),
	timed_out: z.boolean(),
	_shards: z
		.looseObject({
			total: z.number(),
			successful: z.number(),
			skipped: z.number().optional(),
			failed: z.number().optional(),
		})
		.optional(),
	hits: z.looseObject({
		total: z
			.union([
				z.looseObject({
					value: z.number(),
					relation: z.string(),
				}),
				z.number(),
			])
			.optional(),
		max_score: z.number().nullable().optional(),
		// Empty results are valid.
		hits: z.array(SearchHitSchema),
	}),
});
export type SearchRunResponse = z.infer<typeof SearchRunResponseSchema>;

// ── documents.get: GET /{index}/_doc/{id} ────────────────────────────────────

export const DocumentsGetInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
});
export type DocumentsGetInput = z.infer<typeof DocumentsGetInputSchema>;

export const DocumentsGetResponseSchema = z.looseObject({
	_index: z.string().optional(),
	_id: z.string().optional(),
	found: z.boolean(),
	// z.unknown(): the document source is caller-indexed JSON; no stricter
	// value type can hold it.
	_source: z.record(z.string(), z.unknown()).optional(),
	_version: z.number().optional(),
	_seq_no: z.number().optional(),
	_primary_term: z.number().optional(),
});
export type DocumentsGetResponse = z.infer<typeof DocumentsGetResponseSchema>;

// ── documents.exists: HEAD /{index}/_doc/{id} ────────────────────────────────

// HEAD answers 200/404 with an empty body; the plugin resolves the status to
// a boolean (convention documented in README.md).
export const ExistsResultSchema = z.strictObject({ exists: z.boolean() });
export type ExistsResult = z.infer<typeof ExistsResultSchema>;

export const DocumentsExistsInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
});
export type DocumentsExistsInput = z.infer<typeof DocumentsExistsInputSchema>;
export type DocumentsExistsOutput = ExistsResult;

// ── documents.index: POST /{index}/_doc/{id} ─────────────────────────────────

export const DocumentsIndexInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
	document: SourceRecord,
	op_type: z.enum(['index', 'create']).optional(),
	refresh: RefreshParam.optional(),
	routing: NonBlankString.optional(),
	pipeline: NonBlankString.optional(),
	if_seq_no: z.number().int().min(0).optional(),
	if_primary_term: z.number().int().min(0).optional(),
	require_alias: z.boolean().optional(),
	timeout: NonBlankString.optional(),
	wait_for_active_shards: WaitForActiveShardsParam.optional(),
});
export type DocumentsIndexInput = z.input<typeof DocumentsIndexInputSchema>;
export type DocumentsIndexOutput = WriteResponse;

// ── documents.create: POST /{index}/_create/{id} ─────────────────────────────

export const DocumentsCreateInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
	document: SourceRecord,
	refresh: RefreshParam.optional(),
	routing: NonBlankString.optional(),
	pipeline: NonBlankString.optional(),
	timeout: NonBlankString.optional(),
	wait_for_active_shards: WaitForActiveShardsParam.optional(),
});
export type DocumentsCreateInput = z.input<typeof DocumentsCreateInputSchema>;
export type DocumentsCreateOutput = WriteResponse;

// ── documents.update: POST /{index}/_update/{id} ─────────────────────────────

export const DocumentsUpdateInputSchema = z
	.strictObject({
		index: NonBlankString,
		id: NonBlankString,
		doc: SourceRecord.optional(),
		script: ScriptSchema.optional(),
		doc_as_upsert: z.boolean().optional(),
		detect_noop: z.boolean().optional(),
		scripted_upsert: z.boolean().optional(),
		upsert: SourceRecord.optional(),
		_source: SourceFilterParam.optional(),
		refresh: RefreshParam.optional(),
		retry_on_conflict: z.number().int().min(0).optional(),
		routing: NonBlankString.optional(),
		if_seq_no: z.number().int().min(0).optional(),
		if_primary_term: z.number().int().min(0).optional(),
	})
	.refine(
		(input) => (input.doc !== undefined) !== (input.script !== undefined),
		{
			message: 'provide exactly one of doc or script',
		},
	);
export type DocumentsUpdateInput = z.input<typeof DocumentsUpdateInputSchema>;

export const DocumentsUpdateOutputSchema = WriteResponseSchema.extend({
	get: z
		.looseObject({
			found: z.boolean().optional(),
			_source: SourceRecord.optional(),
		})
		.optional(),
});
export type DocumentsUpdateOutput = z.infer<typeof DocumentsUpdateOutputSchema>;

// ── documents.delete: DELETE /{index}/_doc/{id} ──────────────────────────────

export const DocumentsDeleteInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
	refresh: RefreshParam.optional(),
	routing: NonBlankString.optional(),
	if_seq_no: z.number().int().min(0).optional(),
	if_primary_term: z.number().int().min(0).optional(),
	timeout: NonBlankString.optional(),
	wait_for_active_shards: WaitForActiveShardsParam.optional(),
});
export type DocumentsDeleteInput = z.input<typeof DocumentsDeleteInputSchema>;
export type DocumentsDeleteOutput = WriteResponse;

// ── documents.updateByQuery: POST /{index}/_update_by_query ──────────────────

const ByQuerySharedFields = {
	query: QuerySchema.optional(),
	max_docs: z.number().int().min(1).optional(),
	conflicts: z.enum(['abort', 'proceed']).optional(),
	refresh: z.boolean().optional(),
	wait_for_completion: z.boolean().optional(),
	requests_per_second: z.number().min(-1).optional(),
	scroll: NonBlankString.optional(),
	slices: z.union([z.number().int().min(0), z.literal('auto')]).optional(),
};

export const DocumentsUpdateByQueryInputSchema = z.strictObject({
	index: NonBlankString,
	...ByQuerySharedFields,
	script: ScriptSchema.optional(),
	pipeline: NonBlankString.optional(),
});
export type DocumentsUpdateByQueryInput = z.input<
	typeof DocumentsUpdateByQueryInputSchema
>;
export type DocumentsUpdateByQueryOutput = z.infer<
	typeof ByScrollResponseSchema
>;

// deleteByQuery requires an explicit query: without one Elasticsearch would
// delete every document in the target, and a typo must not do that.
export const DocumentsDeleteByQueryInputSchema = z
	.strictObject({
		index: NonBlankString,
		...ByQuerySharedFields,
	})
	.refine((input) => input.query !== undefined, {
		message: 'query is required so the deletion set is explicit',
	});
export type DocumentsDeleteByQueryInput = z.input<
	typeof DocumentsDeleteByQueryInputSchema
>;
export type DocumentsDeleteByQueryOutput = z.infer<
	typeof ByScrollResponseSchema
>;

// ── documents.mget: POST /{index}/_mget ──────────────────────────────────────

// One lookup: by id under the path index, or a full { _index?, _id } entry.
const MgetDocsSchema = z
	.array(
		z.strictObject({
			_index: NonBlankString.optional(),
			_id: NonBlankString,
		}),
	)
	.min(1);

export const DocumentsMgetInputSchema = z
	.strictObject({
		index: NonBlankString,
		ids: z.array(NonBlankString).min(1).optional(),
		docs: MgetDocsSchema.optional(),
	})
	.refine((input) => (input.ids !== undefined) !== (input.docs !== undefined), {
		message: 'provide exactly one of ids or docs',
	});
export type DocumentsMgetInput = z.input<typeof DocumentsMgetInputSchema>;

const MgetItemSchema = z.looseObject({
	_index: z.string().optional(),
	_id: z.string().optional(),
	found: z.boolean().optional(),
	_version: z.number().optional(),
	_source: SourceRecord.optional(),
	error: ErrorCauseSchema.optional(),
});

export const DocumentsMgetOutputSchema = z.looseObject({
	// Empty lookups return an empty array, which is valid.
	docs: z.array(MgetItemSchema),
});
export type DocumentsMgetOutput = z.infer<typeof DocumentsMgetOutputSchema>;

// ── documents.getSource: GET /{index}/_source/{id} ───────────────────────────

export const DocumentsGetSourceInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
	routing: NonBlankString.optional(),
});
export type DocumentsGetSourceInput = z.infer<
	typeof DocumentsGetSourceInputSchema
>;
// The response body is the document source itself.
export type DocumentsGetSourceOutput = z.infer<typeof SourceRecord>;

export const DocumentsGetSourceOutputSchema = SourceRecord;

// ── documents.existsSource: HEAD /{index}/_source/{id} ───────────────────────

export const DocumentsExistsSourceInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
});
export type DocumentsExistsSourceInput = z.infer<
	typeof DocumentsExistsSourceInputSchema
>;
export type DocumentsExistsSourceOutput = ExistsResult;

// ── documents.explain: POST /{index}/_explain/{id} ───────────────────────────

export const DocumentsExplainInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
	query: QuerySchema.optional(),
	routing: NonBlankString.optional(),
});
export type DocumentsExplainInput = z.input<typeof DocumentsExplainInputSchema>;

export const DocumentsExplainOutputSchema = z.looseObject({
	_index: z.string(),
	_id: z.string(),
	matched: z.boolean(),
	explanation: z.looseObject({}).optional(),
	get: z.looseObject({}).optional(),
});
export type DocumentsExplainOutput = z.infer<
	typeof DocumentsExplainOutputSchema
>;

// ── documents.termvectors: POST /{index}/_termvectors/{id} ───────────────────

const TermVectorFlags = {
	fields: z.array(NonBlankString).min(1).optional(),
	field_statistics: z.boolean().optional(),
	term_statistics: z.boolean().optional(),
	positions: z.boolean().optional(),
	offsets: z.boolean().optional(),
	payloads: z.boolean().optional(),
	routing: NonBlankString.optional(),
};

export const DocumentsTermvectorsInputSchema = z.strictObject({
	index: NonBlankString,
	id: NonBlankString,
	...TermVectorFlags,
});
export type DocumentsTermvectorsInput = z.input<
	typeof DocumentsTermvectorsInputSchema
>;

export const TermVectorsResultSchema = z.looseObject({
	_id: z.string().optional(),
	_index: z.string(),
	_version: z.number().optional(),
	took: z.number().optional(),
	found: z.boolean().optional(),
	// Per-field token statistics are deeply nested and version-dependent.
	term_vectors: z.record(z.string(), z.looseObject({})).optional(),
	error: ErrorCauseSchema.optional(),
});
export type TermVectorsResult = z.infer<typeof TermVectorsResultSchema>;

// ── documents.mtermvectors: POST /{index}/_mtermvectors ──────────────────────

export const DocumentsMtermvectorsInputSchema = z
	.strictObject({
		index: NonBlankString,
		ids: z.array(NonBlankString).min(1).optional(),
		docs: MgetDocsSchema.optional(),
		...TermVectorFlags,
	})
	.refine((input) => (input.ids !== undefined) !== (input.docs !== undefined), {
		message: 'provide exactly one of ids or docs',
	});
export type DocumentsMtermvectorsInput = z.input<
	typeof DocumentsMtermvectorsInputSchema
>;

export const DocumentsMtermvectorsOutputSchema = z.looseObject({
	docs: z.array(TermVectorsResultSchema),
});
export type DocumentsMtermvectorsOutput = z.infer<
	typeof DocumentsMtermvectorsOutputSchema
>;

// ── documents.bulk: PUT /{index}/_bulk ───────────────────────────────────────

// One bulk action; `document`/`doc` bodies are caller-defined JSON.
const BulkOperationSchema = z.discriminatedUnion('action', [
	z.strictObject({
		action: z.literal('index'),
		_id: NonBlankString.optional(),
		document: SourceRecord,
	}),
	z.strictObject({
		action: z.literal('create'),
		_id: NonBlankString,
		document: SourceRecord,
	}),
	z.strictObject({
		action: z.literal('update'),
		_id: NonBlankString,
		doc: SourceRecord.optional(),
		script: ScriptSchema.optional(),
		doc_as_upsert: z.boolean().optional(),
		upsert: SourceRecord.optional(),
	}),
	z.strictObject({
		action: z.literal('delete'),
		_id: NonBlankString,
	}),
]);

export const DocumentsBulkInputSchema = z
	.strictObject({
		index: NonBlankString,
		operations: z.array(BulkOperationSchema).min(1).optional(),
		ndjson: NdjsonPayload.optional(),
		refresh: RefreshParam.optional(),
		routing: NonBlankString.optional(),
		pipeline: NonBlankString.optional(),
		require_alias: z.boolean().optional(),
		timeout: NonBlankString.optional(),
	})
	.refine(
		(input) =>
			(input.operations !== undefined) !== (input.ndjson !== undefined),
		{ message: 'provide exactly one of operations or ndjson' },
	);
export type DocumentsBulkInput = z.input<typeof DocumentsBulkInputSchema>;

// Each item is keyed by its action name; values carry the per-item outcome
// and a typed error cause.
const BulkItemSchema = z.record(
	z.string(),
	z.looseObject({
		_id: z.string().optional(),
		_index: z.string().optional(),
		status: z.number().optional(),
		result: z.string().optional(),
		error: ErrorCauseSchema.optional(),
	}),
);

export const DocumentsBulkOutputSchema = z.looseObject({
	errors: z.boolean(),
	took: z.number().optional(),
	ingest_took: z.number().optional(),
	// An all-noop bulk returns items: [].
	items: z.array(BulkItemSchema),
});
export type DocumentsBulkOutput = z.infer<typeof DocumentsBulkOutputSchema>;

// ── indices lifecycle (create/exists/delete/open/close/blocks) ───────────────

// z.unknown() values: index settings accept numbers, booleans, strings and
// nested objects across hundreds of documented keys; the cluster validates
// setting names, so a stricter value type would reject valid settings.
const SettingsRecord = z.record(z.string(), z.unknown());

// Per-field mapping definitions are open-ended (dozens of field types with
// per-type options); the cluster validates them.
const MappingDefinition = z.looseObject({});

export const IndicesCreateInputSchema = z.strictObject({
	index: NonBlankString,
	aliases: z.record(z.string(), z.looseObject({})).optional(),
	mappings: MappingDefinition.optional(),
	settings: SettingsRecord.optional(),
	wait_for_active_shards: WaitForActiveShardsParam.optional(),
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
});
export type IndicesCreateInput = z.input<typeof IndicesCreateInputSchema>;

export const IndicesCreateOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	index: z.string(),
	shards_acknowledged: z.boolean(),
});
export type IndicesCreateOutput = z.infer<typeof IndicesCreateOutputSchema>;

export const IndicesExistsInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesExistsInput = z.infer<typeof IndicesExistsInputSchema>;
export type IndicesExistsOutput = ExistsResult;

// _types.IndicesResponseBase: acknowledged plus optional shard stats.
const IndicesResponseBaseSchema = AcknowledgedResponseSchema.extend({
	_shards: ShardStatisticsSchema.optional(),
});

export const IndicesDeleteInputSchema = z.strictObject({
	index: NonBlankString,
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
});
export type IndicesDeleteInput = z.infer<typeof IndicesDeleteInputSchema>;
export type IndicesDeleteOutput = z.infer<typeof IndicesResponseBaseSchema>;

const IndicesOpenCloseFields = {
	wait_for_active_shards: WaitForActiveShardsParam.optional(),
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
};

export const IndicesOpenInputSchema = z.strictObject({
	index: NonBlankString,
	...IndicesOpenCloseFields,
});
export type IndicesOpenInput = z.input<typeof IndicesOpenInputSchema>;

export const IndicesOpenOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	shards_acknowledged: z.boolean(),
});
export type IndicesOpenOutput = z.infer<typeof IndicesOpenOutputSchema>;

export const IndicesCloseInputSchema = z.strictObject({
	index: NonBlankString,
	...IndicesOpenCloseFields,
});
export type IndicesCloseInput = z.input<typeof IndicesCloseInputSchema>;

export const IndicesCloseOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	shards_acknowledged: z.boolean(),
	// Keyed by index name with per-index close details.
	indices: z.record(z.string(), z.looseObject({})).optional(),
});
export type IndicesCloseOutput = z.infer<typeof IndicesCloseOutputSchema>;

// indices._types.IndicesBlockOptions
const BlockOption = z.enum(['metadata', 'read', 'read_only', 'write']);

export const IndicesAddBlockInputSchema = z.strictObject({
	index: NonBlankString,
	block: BlockOption,
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
});
export type IndicesAddBlockInput = z.input<typeof IndicesAddBlockInputSchema>;

export const IndicesAddBlockOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	shards_acknowledged: z.boolean(),
	indices: z.array(z.looseObject({ name: z.string(), blocked: z.boolean() })),
});
export type IndicesAddBlockOutput = z.infer<typeof IndicesAddBlockOutputSchema>;

export const IndicesRemoveBlockInputSchema = z.strictObject({
	index: NonBlankString,
	block: BlockOption,
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
});
export type IndicesRemoveBlockInput = z.input<
	typeof IndicesRemoveBlockInputSchema
>;

export const IndicesRemoveBlockOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	indices: z.array(
		z.looseObject({
			name: z.string(),
			unblocked: z.boolean().optional(),
			exception: ErrorCauseSchema.optional(),
		}),
	),
});
export type IndicesRemoveBlockOutput = z.infer<
	typeof IndicesRemoveBlockOutputSchema
>;

// ── mappings and settings ────────────────────────────────────────────────────

const IndexKeyedMappingSchema = z.record(
	z.string().min(1),
	z.looseObject({ mappings: MappingDefinition.optional() }),
);
export type IndexKeyedMapping = z.infer<typeof IndexKeyedMappingSchema>;

export const IndicesGetMappingInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesGetMappingInput = z.infer<
	typeof IndicesGetMappingInputSchema
>;
export type IndicesGetMappingOutput = IndexKeyedMapping;

export const IndicesPutMappingInputSchema = z.strictObject({
	index: NonBlankString,
	mappings: MappingDefinition,
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
	write_index_only: z.boolean().optional(),
});
export type IndicesPutMappingInput = z.input<
	typeof IndicesPutMappingInputSchema
>;
export type IndicesPutMappingOutput = z.infer<typeof IndicesResponseBaseSchema>;

export const IndicesGetFieldMappingInputSchema = z.strictObject({
	index: NonBlankString,
	fields: NonBlankString,
});
export type IndicesGetFieldMappingInput = z.infer<
	typeof IndicesGetFieldMappingInputSchema
>;
export type IndicesGetFieldMappingOutput = IndexKeyedMapping;

export const IndicesGetSettingsInputSchema = z.strictObject({
	index: NonBlankString,
	// Comma-separated setting names or wildcards; `_all` is the documented
	// default in the spec path.
	name: NonBlankString,
	flat_settings: z.boolean().optional(),
	include_defaults: z.boolean().optional(),
	local: z.boolean().optional(),
});
export type IndicesGetSettingsInput = z.input<
	typeof IndicesGetSettingsInputSchema
>;

export const IndicesGetSettingsOutputSchema = z.record(
	z.string().min(1),
	z.looseObject({ settings: SettingsRecord.optional() }),
);
export type IndicesGetSettingsOutput = z.infer<
	typeof IndicesGetSettingsOutputSchema
>;

export const IndicesPutSettingsInputSchema = z.strictObject({
	index: NonBlankString,
	settings: SettingsRecord,
	preserve_existing: z.boolean().optional(),
	reopen: z.boolean().optional(),
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
});
export type IndicesPutSettingsInput = z.input<
	typeof IndicesPutSettingsInputSchema
>;
export type IndicesPutSettingsOutput = z.infer<
	typeof AcknowledgedResponseSchema
>;

// ── aliases per index ────────────────────────────────────────────────────────

const IndexKeyedAliasesSchema = z.record(
	z.string().min(1),
	z.looseObject({
		aliases: z.record(z.string(), z.looseObject({})).optional(),
	}),
);
export type IndexKeyedAliases = z.infer<typeof IndexKeyedAliasesSchema>;

export const IndicesGetAliasInputSchema = z.strictObject({
	index: NonBlankString,
	// Comma-separated alias names or wildcards; `*`/`_all` selects all.
	name: NonBlankString,
});
export type IndicesGetAliasInput = z.infer<typeof IndicesGetAliasInputSchema>;
export type IndicesGetAliasOutput = IndexKeyedAliases;

export const IndicesExistsAliasInputSchema = z.strictObject({
	index: NonBlankString,
	name: NonBlankString,
});
export type IndicesExistsAliasInput = z.infer<
	typeof IndicesExistsAliasInputSchema
>;
export type IndicesExistsAliasOutput = ExistsResult;

export const IndicesPutAliasInputSchema = z.strictObject({
	index: NonBlankString,
	name: NonBlankString,
	filter: QuerySchema.optional(),
	routing: NonBlankString.optional(),
	index_routing: NonBlankString.optional(),
	search_routing: NonBlankString.optional(),
	is_write_index: z.boolean().optional(),
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
});
export type IndicesPutAliasInput = z.input<typeof IndicesPutAliasInputSchema>;
export type IndicesPutAliasOutput = z.infer<typeof AcknowledgedResponseSchema>;

export const IndicesDeleteAliasInputSchema = z.strictObject({
	index: NonBlankString,
	name: NonBlankString,
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
});
export type IndicesDeleteAliasInput = z.infer<
	typeof IndicesDeleteAliasInputSchema
>;

export const IndicesDeleteAliasOutputSchema = AcknowledgedResponseSchema.extend(
	{
		errors: z.boolean().optional(),
	},
);
export type IndicesDeleteAliasOutput = z.infer<
	typeof IndicesDeleteAliasOutputSchema
>;

// ── rollover, clone, split, shrink, downsample ───────────────────────────────

// Rollover conditions (max_docs, max_size, max_age, ...) take string or
// number thresholds; the keys are a documented but growing set.
const RolloverConditions = z.record(
	z.string(),
	z.union([z.string(), z.number()]),
);

const ResizeSettingsFields = {
	settings: SettingsRecord.optional(),
	aliases: z.record(z.string(), z.looseObject({})).optional(),
	wait_for_active_shards: WaitForActiveShardsParam.optional(),
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
};

export const IndicesRolloverInputSchema = z.strictObject({
	alias: NonBlankString,
	new_index: NonBlankString,
	dry_run: z.boolean().optional(),
	lazy: z.boolean().optional(),
	conditions: RolloverConditions.optional(),
	mappings: MappingDefinition.optional(),
	...ResizeSettingsFields,
});
export type IndicesRolloverInput = z.input<typeof IndicesRolloverInputSchema>;

export const IndicesRolloverOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	conditions: z.record(z.string(), z.boolean()).optional(),
	dry_run: z.boolean(),
	new_index: z.string(),
	old_index: z.string(),
	rolled_over: z.boolean(),
	shards_acknowledged: z.boolean(),
});
export type IndicesRolloverOutput = z.infer<typeof IndicesRolloverOutputSchema>;

export const IndicesCloneInputSchema = z.strictObject({
	index: NonBlankString,
	target: NonBlankString,
	...ResizeSettingsFields,
});
export type IndicesCloneInput = z.input<typeof IndicesCloneInputSchema>;

export const IndicesSplitInputSchema = z.strictObject({
	index: NonBlankString,
	target: NonBlankString,
	...ResizeSettingsFields,
});
export type IndicesSplitInput = z.input<typeof IndicesSplitInputSchema>;

export const IndicesShrinkInputSchema = z.strictObject({
	index: NonBlankString,
	target: NonBlankString,
	...ResizeSettingsFields,
});
export type IndicesShrinkInput = z.input<typeof IndicesShrinkInputSchema>;

const IndicesResizeOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	shards_acknowledged: z.boolean(),
	index: z.string(),
});
export type IndicesResizeOutput = z.infer<typeof IndicesResizeOutputSchema>;

export const IndicesDownsampleInputSchema = z.strictObject({
	index: NonBlankString,
	target_index: NonBlankString,
	fixed_interval: NonBlankString,
	sampling_method: z.enum(['aggregate', 'last_value']).optional(),
});
export type IndicesDownsampleInput = z.input<
	typeof IndicesDownsampleInputSchema
>;

export const IndicesDownsampleOutputSchema = z.looseObject({
	acknowledged: z.boolean().optional(),
	shards_acknowledged: z.boolean().optional(),
});
export type IndicesDownsampleOutput = z.infer<
	typeof IndicesDownsampleOutputSchema
>;

// ── indices.analyze: POST /{index}/_analyze ──────────────────────────────────

export const IndicesAnalyzeInputSchema = z.strictObject({
	index: NonBlankString,
	text: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
	analyzer: NonBlankString.optional(),
	field: NonBlankString.optional(),
	tokenizer: NonBlankString.optional(),
	explain: z.boolean().optional(),
});
export type IndicesAnalyzeInput = z.input<typeof IndicesAnalyzeInputSchema>;

const AnalyzeTokenSchema = z.looseObject({
	token: z.string(),
	start_offset: z.number(),
	end_offset: z.number(),
	type: z.string(),
	position: z.number(),
});

export const IndicesAnalyzeOutputSchema = z.looseObject({
	// explain=true returns detail instead of tokens; both are optional.
	tokens: z.array(AnalyzeTokenSchema).optional(),
	detail: z.looseObject({}).optional(),
});
export type IndicesAnalyzeOutput = z.infer<typeof IndicesAnalyzeOutputSchema>;

// ── indices stats and maintenance ────────────────────────────────────────────

// _types.CommonStatsFlag: the documented metric selectors; the path takes a
// comma-separated combination of them.
const STATS_METRICS = new Set([
	'_all',
	'store',
	'indexing',
	'get',
	'search',
	'merge',
	'flush',
	'refresh',
	'query_cache',
	'fielddata',
	'docs',
	'warmer',
	'completion',
	'segments',
	'translog',
	'request_cache',
	'recovery',
	'bulk',
	'shard_stats',
	'mappings',
	'dense_vector',
	'sparse_vector',
]);

export const IndicesStatsInputSchema = z
	.strictObject({
		index: NonBlankString,
		metric: NonBlankString,
		level: z.enum(['cluster', 'indices', 'shards']).optional(),
	})
	.refine(
		(parsed) =>
			parsed.metric
				.split(',')
				.map((metric) => metric.trim())
				.every((metric) => STATS_METRICS.has(metric)),
		{ message: 'metric must be a comma-separated list of documented stats' },
	);
export type IndicesStatsInput = z.input<typeof IndicesStatsInputSchema>;

export const IndicesStatsOutputSchema = z.looseObject({
	_shards: ShardStatisticsSchema,
	_all: z.looseObject({}).optional(),
	// Keyed by index name; per-index stats are deeply nested per metric.
	indices: z.record(z.string(), z.looseObject({})).optional(),
});
export type IndicesStatsOutput = z.infer<typeof IndicesStatsOutputSchema>;

export const IndicesSegmentsInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesSegmentsInput = z.infer<typeof IndicesSegmentsInputSchema>;

export const IndicesSegmentsOutputSchema = z.looseObject({
	indices: z.record(z.string(), z.looseObject({})),
	_shards: ShardStatisticsSchema,
});
export type IndicesSegmentsOutput = z.infer<typeof IndicesSegmentsOutputSchema>;

export const IndicesRecoveryInputSchema = z.strictObject({
	index: NonBlankString,
	detailed: z.boolean().optional(),
	active_only: z.boolean().optional(),
});
export type IndicesRecoveryInput = z.input<typeof IndicesRecoveryInputSchema>;

// Keyed by index name; shard recovery details are deeply nested.
export const IndicesRecoveryOutputSchema = z.record(
	z.string(),
	z.looseObject({}),
);
export type IndicesRecoveryOutput = z.infer<typeof IndicesRecoveryOutputSchema>;

export const IndicesShardStoresInputSchema = z.strictObject({
	index: NonBlankString,
	status: z.enum(['green', 'yellow', 'red', 'all']).optional(),
});
export type IndicesShardStoresInput = z.input<
	typeof IndicesShardStoresInputSchema
>;

export const IndicesShardStoresOutputSchema = z.looseObject({
	indices: z.record(z.string(), z.looseObject({})),
});
export type IndicesShardStoresOutput = z.infer<
	typeof IndicesShardStoresOutputSchema
>;

export const IndicesRefreshInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesRefreshInput = z.infer<typeof IndicesRefreshInputSchema>;
export type IndicesRefreshOutput = z.infer<
	typeof ShardsOperationResponseSchema
>;

export const IndicesFlushInputSchema = z.strictObject({
	index: NonBlankString,
	force: z.boolean().optional(),
	wait_if_ongoing: z.boolean().optional(),
});
export type IndicesFlushInput = z.input<typeof IndicesFlushInputSchema>;
export type IndicesFlushOutput = z.infer<typeof ShardsOperationResponseSchema>;

export const IndicesForceMergeInputSchema = z.strictObject({
	index: NonBlankString,
	max_num_segments: z.number().int().min(1).optional(),
	only_expunge_deletes: z.boolean().optional(),
	flush: z.boolean().optional(),
	wait_for_completion: z.boolean().optional(),
});
export type IndicesForceMergeInput = z.input<
	typeof IndicesForceMergeInputSchema
>;

export const IndicesForceMergeOutputSchema =
	ShardsOperationResponseSchema.extend({ task: z.string().optional() });
export type IndicesForceMergeOutput = z.infer<
	typeof IndicesForceMergeOutputSchema
>;

export const IndicesCacheClearInputSchema = z.strictObject({
	index: NonBlankString,
	fielddata: z.boolean().optional(),
	query: z.boolean().optional(),
	request: z.boolean().optional(),
	fields: z.array(NonBlankString).min(1).optional(),
});
export type IndicesCacheClearInput = z.input<
	typeof IndicesCacheClearInputSchema
>;
export type IndicesCacheClearOutput = z.infer<
	typeof ShardsOperationResponseSchema
>;

export const IndicesReloadSearchAnalyzersInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesReloadSearchAnalyzersInput = z.infer<
	typeof IndicesReloadSearchAnalyzersInputSchema
>;

export const IndicesReloadSearchAnalyzersOutputSchema = z.looseObject({
	reload_details: z.array(
		z.looseObject({
			index: z.string(),
			reloaded_analyzers: z.array(z.string()),
			reloaded_node_ids: z.array(z.string()),
		}),
	),
	_shards: ShardStatisticsSchema,
});
export type IndicesReloadSearchAnalyzersOutput = z.infer<
	typeof IndicesReloadSearchAnalyzersOutputSchema
>;

// The disk usage API refuses to run unless run_expensive_tasks is true, so
// the literal pins the opt-in.
export const IndicesDiskUsageInputSchema = z.strictObject({
	index: NonBlankString,
	run_expensive_tasks: z.literal(true),
	flush: z.boolean().optional(),
});
export type IndicesDiskUsageInput = z.input<typeof IndicesDiskUsageInputSchema>;

export const IndicesDiskUsageOutputSchema = z.record(
	z.string(),
	z.looseObject({}),
);
export type IndicesDiskUsageOutput = z.infer<
	typeof IndicesDiskUsageOutputSchema
>;

export const IndicesFieldUsageStatsInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesFieldUsageStatsInput = z.infer<
	typeof IndicesFieldUsageStatsInputSchema
>;

export const IndicesFieldUsageStatsOutputSchema = z.looseObject({
	_shards: ShardStatisticsSchema,
});
export type IndicesFieldUsageStatsOutput = z.infer<
	typeof IndicesFieldUsageStatsOutputSchema
>;

// migration.deprecations.Deprecation rows.
const DeprecationSchema = z.looseObject({
	level: z.string(),
	message: z.string(),
	details: z.string().optional(),
	url: z.string().optional(),
	resolve_during_rolling_upgrade: z.boolean().optional(),
});

export const IndicesDeprecationsInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesDeprecationsInput = z.infer<
	typeof IndicesDeprecationsInputSchema
>;

export const IndicesDeprecationsOutputSchema = z.looseObject({
	cluster_settings: z.array(DeprecationSchema),
	index_settings: z.record(z.string(), z.array(DeprecationSchema)),
	data_streams: z.record(z.string(), z.array(DeprecationSchema)),
	node_settings: z.array(DeprecationSchema),
	ml_settings: z.array(DeprecationSchema),
	templates: z.record(z.string(), z.array(DeprecationSchema)),
	ilm_policies: z.record(z.string(), z.array(DeprecationSchema)),
});
export type IndicesDeprecationsOutput = z.infer<
	typeof IndicesDeprecationsOutputSchema
>;

export const IndicesExplainDataLifecycleInputSchema = z.strictObject({
	index: NonBlankString,
	include_defaults: z.boolean().optional(),
});
export type IndicesExplainDataLifecycleInput = z.input<
	typeof IndicesExplainDataLifecycleInputSchema
>;

const LifecycleIndicesSchema = z.looseObject({
	indices: z.record(z.string(), z.looseObject({})),
});
export type LifecycleIndices = z.infer<typeof LifecycleIndicesSchema>;

export const IndicesIlmExplainInputSchema = z.strictObject({
	index: NonBlankString,
	only_errors: z.boolean().optional(),
	only_managed: z.boolean().optional(),
});
export type IndicesIlmExplainInput = z.input<
	typeof IndicesIlmExplainInputSchema
>;

export const IndicesIlmRemoveInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesIlmRemoveInput = z.infer<typeof IndicesIlmRemoveInputSchema>;

export const IndicesIlmRemoveOutputSchema = z.looseObject({
	failed_indexes: z.array(z.string()),
	has_failures: z.boolean(),
});
export type IndicesIlmRemoveOutput = z.infer<
	typeof IndicesIlmRemoveOutputSchema
>;

export const IndicesIlmRetryInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesIlmRetryInput = z.infer<typeof IndicesIlmRetryInputSchema>;
export type IndicesIlmRetryOutput = z.infer<typeof AcknowledgedResponseSchema>;

export const IndicesClearSearchableSnapshotCacheInputSchema = z.strictObject({
	index: NonBlankString,
});
export type IndicesClearSearchableSnapshotCacheInput = z.infer<
	typeof IndicesClearSearchableSnapshotCacheInputSchema
>;
// The documented response body is an empty object.
const EmptyObjectSchema = z.looseObject({});
export type IndicesClearSearchableSnapshotCacheOutput = z.infer<
	typeof EmptyObjectSchema
>;

export const IndicesSearchableSnapshotStatsInputSchema = z.strictObject({
	index: NonBlankString,
	level: z.enum(['cluster', 'indices', 'shards']).optional(),
});
export type IndicesSearchableSnapshotStatsInput = z.input<
	typeof IndicesSearchableSnapshotStatsInputSchema
>;

export const IndicesSearchableSnapshotStatsOutputSchema = z.looseObject({
	stats: z.looseObject({}),
	total: z.looseObject({}),
});
export type IndicesSearchableSnapshotStatsOutput = z.infer<
	typeof IndicesSearchableSnapshotStatsOutputSchema
>;

// ── search family on index-scoped paths ─────────────────────────────────────

export const SearchCountInputSchema = z.strictObject({
	index: NonBlankString,
	query: QuerySchema.optional(),
});
export type SearchCountInput = z.input<typeof SearchCountInputSchema>;

export const SearchCountOutputSchema = z.looseObject({
	count: z.number(),
	_shards: ShardStatisticsSchema,
});
export type SearchCountOutput = z.infer<typeof SearchCountOutputSchema>;

// One sub-search in an msearch body: optional target override plus the same
// typed query subset search.run accepts. All fields optional: an empty
// sub-search is a valid match_all.
const MsearchSearchSchema = z.strictObject({
	index: NonBlankString.optional(),
	query: QuerySchema.optional(),
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(0).optional(),
});

export const SearchMsearchInputSchema = z
	.strictObject({
		index: NonBlankString,
		searches: z.array(MsearchSearchSchema).min(1).optional(),
		ndjson: NdjsonPayload.optional(),
	})
	.refine(
		(parsed) =>
			(parsed.searches !== undefined) !== (parsed.ndjson !== undefined),
		{ message: 'provide exactly one of searches or ndjson' },
	);
export type SearchMsearchInput = z.input<typeof SearchMsearchInputSchema>;

// Each msearch response item is either a search result or an error envelope.
const MsearchItemSchema = z.looseObject({
	took: z.number().optional(),
	hits: z.looseObject({}).optional(),
	aggregations: z.looseObject({}).optional(),
	status: z.number().optional(),
	error: ErrorCauseSchema.optional(),
});

const MultiSearchResultSchema = z.looseObject({
	took: z.number(),
	// Empty sub-search lists are valid.
	responses: z.array(MsearchItemSchema),
});
export type MultiSearchResult = z.infer<typeof MultiSearchResultSchema>;

// One templated sub-search: a stored template id plus its params.
const MsearchTemplateSearchSchema = z.strictObject({
	index: NonBlankString.optional(),
	id: NonBlankString,
	// z.unknown() values: template params are defined by the template.
	params: z.record(z.string(), z.unknown()).optional(),
});

export const SearchMsearchTemplateInputSchema = z
	.strictObject({
		index: NonBlankString,
		searches: z.array(MsearchTemplateSearchSchema).min(1).optional(),
		ndjson: NdjsonPayload.optional(),
	})
	.refine(
		(parsed) =>
			(parsed.searches !== undefined) !== (parsed.ndjson !== undefined),
		{ message: 'provide exactly one of searches or ndjson' },
	);
export type SearchMsearchTemplateInput = z.input<
	typeof SearchMsearchTemplateInputSchema
>;
export type SearchMsearchTemplateOutput = MultiSearchResult;

export const SearchTemplateInputSchema = z
	.strictObject({
		index: NonBlankString,
		id: NonBlankString.optional(),
		source: NonBlankString.optional(),
		// z.unknown() values: template params are defined by the template.
		params: z.record(z.string(), z.unknown()).optional(),
	})
	.refine(
		(parsed) => (parsed.id !== undefined) !== (parsed.source !== undefined),
		{
			message: 'provide exactly one of id or source',
		},
	);
export type SearchTemplateInput = z.input<typeof SearchTemplateInputSchema>;
export type SearchTemplateOutput = SearchRunResponse;

export const SearchTermsEnumInputSchema = z.strictObject({
	index: NonBlankString,
	field: NonBlankString,
	string: NonBlankString.optional(),
	size: z.number().int().min(1).optional(),
	case_insensitive: z.boolean().optional(),
});
export type SearchTermsEnumInput = z.input<typeof SearchTermsEnumInputSchema>;

export const SearchTermsEnumOutputSchema = z.looseObject({
	_shards: ShardStatisticsSchema,
	terms: z.array(z.string()),
	complete: z.boolean(),
});
export type SearchTermsEnumOutput = z.infer<typeof SearchTermsEnumOutputSchema>;

export const SearchFieldCapsInputSchema = z.strictObject({
	index: NonBlankString,
	// Comma-separated field list or wildcard; defaults to all fields.
	fields: NonBlankString.optional(),
});
export type SearchFieldCapsInput = z.input<typeof SearchFieldCapsInputSchema>;

export const SearchFieldCapsOutputSchema = z.looseObject({
	indices: z.array(z.string()),
	// field name -> capability type (text, keyword, ...) -> capabilities.
	fields: z.record(
		z.string(),
		z.record(
			z.string(),
			z.looseObject({
				type: z.string().optional(),
				searchable: z.boolean().optional(),
				aggregatable: z.boolean().optional(),
				indices: z.array(z.string()).optional(),
			}),
		),
	),
});
export type SearchFieldCapsOutput = z.infer<typeof SearchFieldCapsOutputSchema>;

export const SearchShardsInputSchema = z.strictObject({
	index: NonBlankString,
	routing: NonBlankString.optional(),
	preference: NonBlankString.optional(),
	local: z.boolean().optional(),
});
export type SearchShardsInput = z.input<typeof SearchShardsInputSchema>;

export const SearchShardsOutputSchema = z.looseObject({
	nodes: z.record(z.string(), z.looseObject({})),
	// Shard copies nested by shard number.
	shards: z.array(z.array(z.looseObject({}))),
	indices: z.record(z.string(), z.looseObject({})),
});
export type SearchShardsOutput = z.infer<typeof SearchShardsOutputSchema>;

export const SearchOpenPointInTimeInputSchema = z.strictObject({
	index: NonBlankString,
	keep_alive: NonBlankString,
	preference: NonBlankString.optional(),
	routing: NonBlankString.optional(),
});
export type SearchOpenPointInTimeInput = z.input<
	typeof SearchOpenPointInTimeInputSchema
>;

export const SearchOpenPointInTimeOutputSchema = z.looseObject({
	id: z.string(),
	_shards: ShardStatisticsSchema,
});
export type SearchOpenPointInTimeOutput = z.infer<
	typeof SearchOpenPointInTimeOutputSchema
>;

export const SearchRankEvalInputSchema = z.strictObject({
	index: NonBlankString,
	requests: z
		.array(
			z.strictObject({
				id: NonBlankString,
				request: z.strictObject({ query: QuerySchema }),
				ratings: z
					.array(
						z.strictObject({
							_index: NonBlankString.optional(),
							_id: NonBlankString,
							rating: z.number(),
						}),
					)
					.min(1),
			}),
		)
		.min(1),
	// metric name (precision, recall, dcg...) -> its typed-but-open options.
	metric: z.record(z.string(), z.looseObject({})).optional(),
});
export type SearchRankEvalInput = z.input<typeof SearchRankEvalInputSchema>;

export const SearchRankEvalOutputSchema = z.looseObject({
	metric_score: z.number(),
	details: z.record(z.string(), z.looseObject({})),
	failures: z.record(z.string(), z.looseObject({})),
});
export type SearchRankEvalOutput = z.infer<typeof SearchRankEvalOutputSchema>;

export const SearchVectorTileInputSchema = z
	.strictObject({
		index: NonBlankString,
		field: NonBlankString,
		zoom: z.number().int().min(0).max(29),
		x: z.number().int().min(0),
		y: z.number().int().min(0),
		exact_bounds: z.boolean().optional(),
		extent: z.number().int().min(1).optional(),
		grid_agg: z.enum(['geotile', 'geohex']).optional(),
		grid_precision: z.number().int().min(0).max(8).optional(),
		grid_type: z.enum(['grid', 'point', 'centroid']).optional(),
		size: z.number().int().min(0).max(10_000).optional(),
		with_labels: z.boolean().optional(),
	})
	.refine(
		(parsed) => parsed.x < 2 ** parsed.zoom && parsed.y < 2 ** parsed.zoom,
		{ message: 'x and y must be valid tile coordinates for the zoom level' },
	);
export type SearchVectorTileInput = z.input<typeof SearchVectorTileInputSchema>;

// The tile is a binary Mapbox vector tile; the binary client returns the
// bytes base64-encoded with the response content type.
export const SearchVectorTileOutputSchema = z.strictObject({
	contentType: z.string(),
	base64: z.string(),
});
export type SearchVectorTileOutput = z.infer<
	typeof SearchVectorTileOutputSchema
>;

export const SearchEqlInputSchema = z.strictObject({
	index: NonBlankString,
	query: NonBlankString,
	size: z.number().int().min(0).optional(),
	event_category: NonBlankString.optional(),
	wait_for_completion_timeout: NonBlankString.optional(),
	keep_alive: NonBlankString.optional(),
	keep_on_completion: z.boolean().optional(),
});
export type SearchEqlInput = z.input<typeof SearchEqlInputSchema>;

export const SearchEqlOutputSchema = z.looseObject({
	id: z.string().optional(),
	is_partial: z.boolean().optional(),
	is_running: z.boolean().optional(),
	took: z.number().optional(),
	timed_out: z.boolean().optional(),
	hits: z.looseObject({
		total: z.looseObject({}).optional(),
		// EQL events and sequences are matched documents.
		events: z.array(z.looseObject({})).optional(),
		sequences: z.array(z.looseObject({})).optional(),
	}),
	shard_failures: z.array(z.looseObject({})).optional(),
});
export type SearchEqlOutput = z.infer<typeof SearchEqlOutputSchema>;

export const SearchAsyncSubmitInputSchema = z.strictObject({
	index: NonBlankString,
	query: QuerySchema.optional(),
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(0).max(10_000).optional(),
	wait_for_completion_timeout: NonBlankString.optional(),
	keep_alive: NonBlankString.optional(),
	keep_on_completion: z.boolean().optional(),
});
export type SearchAsyncSubmitInput = z.input<
	typeof SearchAsyncSubmitInputSchema
>;

export const SearchAsyncSubmitOutputSchema = z.looseObject({
	id: z.string().optional(),
	is_partial: z.boolean(),
	is_running: z.boolean(),
	start_time_in_millis: z.number(),
	expiration_time_in_millis: z.number(),
	error: ErrorCauseSchema.optional(),
	// The wrapped search response, present once results are available.
	response: z.looseObject({}).optional(),
});
export type SearchAsyncSubmitOutput = z.infer<
	typeof SearchAsyncSubmitOutputSchema
>;

export const SearchGraphExploreInputSchema = z.strictObject({
	index: NonBlankString,
	vertices: z.array(z.looseObject({ field: z.string() })).min(1),
	timeout: NonBlankString.optional(),
});
export type SearchGraphExploreInput = z.input<
	typeof SearchGraphExploreInputSchema
>;

export const SearchGraphExploreOutputSchema = z.looseObject({
	vertices: z.array(z.looseObject({})),
	connections: z.array(z.looseObject({})),
	failures: z.array(z.looseObject({})),
	timed_out: z.boolean(),
	took: z.number(),
});
export type SearchGraphExploreOutput = z.infer<
	typeof SearchGraphExploreOutputSchema
>;

export const SearchValidateQueryInputSchema = z.strictObject({
	index: NonBlankString,
	query: QuerySchema.optional(),
	q: NonBlankString.optional(),
	explain: z.boolean().optional(),
	rewrite: z.boolean().optional(),
	all_shards: z.boolean().optional(),
});
export type SearchValidateQueryInput = z.input<
	typeof SearchValidateQueryInputSchema
>;

export const SearchValidateQueryOutputSchema = z.looseObject({
	valid: z.boolean(),
	_shards: ShardStatisticsSchema.optional(),
	explanations: z
		.array(
			z.looseObject({
				index: z.string().optional(),
				shard: z.number().optional(),
				valid: z.boolean(),
				error: z.string().optional(),
				explanation: z.string().optional(),
			}),
		)
		.optional(),
	error: z.string().optional(),
});
export type SearchValidateQueryOutput = z.infer<
	typeof SearchValidateQueryOutputSchema
>;

// ── fleet (CCS internal) on index-scoped paths ──────────────────────────────

export const FleetSearchInputSchema = z.strictObject({
	index: NonBlankString,
	query: QuerySchema.optional(),
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(0).max(10_000).optional(),
	wait_for_checkpoints: z.array(z.number().int().min(0)).min(1).optional(),
});
export type FleetSearchInput = z.input<typeof FleetSearchInputSchema>;
export type FleetSearchOutput = SearchRunResponse;

export const FleetMsearchInputSchema = z
	.strictObject({
		index: NonBlankString,
		searches: z.array(MsearchSearchSchema).min(1).optional(),
		ndjson: NdjsonPayload.optional(),
		wait_for_checkpoints: z.array(z.number().int().min(0)).min(1).optional(),
	})
	.refine(
		(parsed) =>
			(parsed.searches !== undefined) !== (parsed.ndjson !== undefined),
		{ message: 'provide exactly one of searches or ndjson' },
	);
export type FleetMsearchInput = z.input<typeof FleetMsearchInputSchema>;
export type FleetMsearchOutput = MultiSearchResult;

export const FleetGlobalCheckpointsInputSchema = z.strictObject({
	index: NonBlankString,
	wait_for_advance: z.boolean().optional(),
	wait_for_index: z.boolean().optional(),
	checkpoints: z.array(z.number().int().min(0)).min(1).optional(),
	timeout: NonBlankString.optional(),
});
export type FleetGlobalCheckpointsInput = z.input<
	typeof FleetGlobalCheckpointsInputSchema
>;

export const FleetGlobalCheckpointsOutputSchema = z.looseObject({
	global_checkpoints: z.array(z.number()),
	timed_out: z.boolean(),
});
export type FleetGlobalCheckpointsOutput = z.infer<
	typeof FleetGlobalCheckpointsOutputSchema
>;

// ── cross-cluster replication on index-scoped paths ─────────────────────────

export const CcrFollowInputSchema = z.strictObject({
	index: NonBlankString,
	leader_index: NonBlankString,
	remote_cluster: NonBlankString,
	max_outstanding_read_requests: z.number().int().min(1).optional(),
	max_retry_delay: NonBlankString.optional(),
	read_poll_timeout: NonBlankString.optional(),
	settings: SettingsRecord.optional(),
	master_timeout: NonBlankString.optional(),
	wait_for_active_shards: WaitForActiveShardsParam.optional(),
});
export type CcrFollowInput = z.input<typeof CcrFollowInputSchema>;

export const CcrFollowOutputSchema = z.looseObject({
	follow_index_created: z.boolean(),
	follow_index_shards_acked: z.boolean(),
	index_following_started: z.boolean(),
});
export type CcrFollowOutput = z.infer<typeof CcrFollowOutputSchema>;

export const CcrFollowInfoInputSchema = z.strictObject({
	index: NonBlankString,
});
export type CcrFollowInfoInput = z.infer<typeof CcrFollowInfoInputSchema>;

export const CcrFollowInfoOutputSchema = z.looseObject({
	follower_indices: z.array(
		z.looseObject({
			follower_index: z.string(),
			leader_index: z.string(),
			remote_cluster: z.string(),
			status: z.string(),
		}),
	),
});
export type CcrFollowInfoOutput = z.infer<typeof CcrFollowInfoOutputSchema>;

export const CcrFollowStatsInputSchema = z.strictObject({
	index: NonBlankString,
});
export type CcrFollowStatsInput = z.infer<typeof CcrFollowStatsInputSchema>;

export const CcrFollowStatsOutputSchema = z.looseObject({
	indices: z.array(
		z.looseObject({
			index: z.string(),
			shards: z.array(z.looseObject({})),
		}),
	),
});
export type CcrFollowStatsOutput = z.infer<typeof CcrFollowStatsOutputSchema>;

export const CcrForgetFollowerInputSchema = z
	.strictObject({
		index: NonBlankString,
		follower_cluster: NonBlankString.optional(),
		follower_index: NonBlankString.optional(),
		follower_index_uuid: NonBlankString.optional(),
		leader_remote_cluster: NonBlankString.optional(),
		timeout: NonBlankString.optional(),
	})
	.refine(
		(parsed) =>
			parsed.follower_cluster !== undefined ||
			parsed.follower_index !== undefined ||
			parsed.follower_index_uuid !== undefined ||
			parsed.leader_remote_cluster !== undefined,
		{ message: 'provide at least one follower identifier' },
	);
export type CcrForgetFollowerInput = z.input<
	typeof CcrForgetFollowerInputSchema
>;

export const CcrForgetFollowerOutputSchema = z.looseObject({
	_shards: ShardStatisticsSchema,
});
export type CcrForgetFollowerOutput = z.infer<
	typeof CcrForgetFollowerOutputSchema
>;

const CcrIndexInputSchema = z.strictObject({
	index: NonBlankString,
	master_timeout: NonBlankString.optional(),
});
export type CcrIndexInput = z.input<typeof CcrIndexInputSchema>;
export type CcrAcknowledgedOutput = z.infer<typeof AcknowledgedResponseSchema>;

// ── shared fragments for cluster, cat, nodes and tasks families ─────────────

// Metric selectors arrive as a comma-separated list; every token must be one
// of the documented values (spec _types.* metrics enums).
const commaTokensIn =
	(tokens: ReadonlySet<string>) =>
	(value: string): boolean =>
		value.split(',').every((token) => tokens.has(token.trim()));

const CommaMetric = (tokens: ReadonlySet<string>) =>
	NonBlankString.refine(commaTokensIn(tokens), {
		message: 'must be a comma-separated list of documented selectors',
	});

const CLUSTER_INFO_TARGETS = new Set([
	'_all',
	'http',
	'ingest',
	'thread_pool',
	'script',
]);

const CLUSTER_STATE_METRICS = new Set([
	'_all',
	'version',
	'master_node',
	'blocks',
	'nodes',
	'metadata',
	'routing_table',
	'routing_nodes',
	'customs',
]);

const NODES_INFO_METRICS = new Set([
	'_all',
	'_none',
	'settings',
	'os',
	'process',
	'jvm',
	'thread_pool',
	'transport',
	'http',
	'remote_cluster_server',
	'plugins',
	'ingest',
	'aggregations',
	'indices',
]);

const NODES_STATS_METRICS = new Set([
	'_all',
	'_none',
	'indices',
	'os',
	'process',
	'jvm',
	'thread_pool',
	'fs',
	'transport',
	'http',
	'breaker',
	'script',
	'discovery',
	'ingest',
	'adaptive_selection',
	'script_cache',
	'indexing_pressure',
	'repositories',
	'allocations',
]);

const NODES_USAGE_METRICS = new Set(['_all', 'rest_actions', 'aggregations']);

// Multi-valued params (actions, node lists) take a comma string or a list;
// the endpoint joins a list with commas on send.
const StringList = z.union([NonBlankString, z.array(NonBlankString).min(1)]);

// CAT rows arrive with every value as a string, or null where a size is not
// present (spec cat.*Records type all columns as string-ish); columns are
// op-specific and version-dependent, so only key columns are typed and rows
// stay loose.
const CatColumn = z.string().nullable().optional();
const CatRow = <T extends Record<string, typeof CatColumn>>(fields: T) =>
	z.looseObject(fields);
const CatRows = <T extends z.ZodType>(row: T) => z.array(row);

// 200 with an empty body: the server answers text/plain with zero bytes, so
// the JSON client surfaces undefined or an empty string; both normalize to {}.
const EmptyBodyResponse = z
	.union([z.looseObject({}), z.string().max(0)])
	.optional()
	.transform((value) => (typeof value === 'string' ? {} : (value ?? {})));

// ── cluster.ping: HEAD / ─────────────────────────────────────────────────────

export const ClusterPingInputSchema = z.object({});
export type ClusterPingInput = z.infer<typeof ClusterPingInputSchema>;
export type ClusterPingOutput = ExistsResult;

// ── cluster.getInfo: GET / ───────────────────────────────────────────────────

export const ClusterGetInfoInputSchema = z.object({});
export type ClusterGetInfoInput = z.infer<typeof ClusterGetInfoInputSchema>;

export const ClusterGetInfoResponseSchema = z.looseObject({
	cluster_name: z.string(),
	cluster_uuid: z.string(),
	name: z.string(),
	tagline: z.string(),
	version: z.looseObject({
		number: z.string(),
		build_flavor: z.string().optional(),
		build_type: z.string().optional(),
		build_hash: z.string().optional(),
		build_date: z.string().optional(),
		build_snapshot: z.boolean().optional(),
		lucene_version: z.string().optional(),
		minimum_index_compatibility_version: z.string().optional(),
		minimum_wire_compatibility_version: z.string().optional(),
	}),
});
export type ClusterGetInfoResponse = z.infer<
	typeof ClusterGetInfoResponseSchema
>;

// ── cluster.subsystemInfo: GET /_info/{target} ───────────────────────────────

export const ClusterSubsystemInfoInputSchema = z.strictObject({
	target: CommaMetric(CLUSTER_INFO_TARGETS),
});
export type ClusterSubsystemInfoInput = z.infer<
	typeof ClusterSubsystemInfoInputSchema
>;

// The subsystem payloads (http routes, ingest processors, thread pools,
// script contexts) are large and version-dependent; the spec types the
// response as a bare object.
export type ClusterSubsystemInfoOutput = z.infer<typeof EmptyObjectSchema>;
export const ClusterSubsystemInfoOutputSchema = EmptyObjectSchema;

// ── cluster.pendingTasks: GET /_cluster/pending_tasks ────────────────────────

export const ClusterPendingTasksInputSchema = z.strictObject({
	local: z.boolean().optional(),
	master_timeout: NonBlankString.optional(),
});
export type ClusterPendingTasksInput = z.input<
	typeof ClusterPendingTasksInputSchema
>;

export const ClusterPendingTasksOutputSchema = z.looseObject({
	// An idle master has zero pending tasks: an empty array is valid.
	tasks: z.array(
		z.looseObject({
			insert_order: z.number(),
			priority: z.string(),
			source: z.string(),
			executing: z.boolean(),
			time_in_queue_millis: z.number().optional(),
			time_in_queue: z.string().optional(),
		}),
	),
});
export type ClusterPendingTasksOutput = z.infer<
	typeof ClusterPendingTasksOutputSchema
>;

// ── cluster.getSettings / putSettings: GET|PUT /_cluster/settings ────────────

const ClusterSettingsFields = {
	flat_settings: z.boolean().optional(),
	timeout: NonBlankString.optional(),
	master_timeout: NonBlankString.optional(),
};

export const ClusterGetSettingsInputSchema = z.strictObject({
	...ClusterSettingsFields,
	include_defaults: z.boolean().optional(),
});
export type ClusterGetSettingsInput = z.input<
	typeof ClusterGetSettingsInputSchema
>;

export const ClusterGetSettingsOutputSchema = z.looseObject({
	persistent: SettingsRecord.optional(),
	transient: SettingsRecord.optional(),
	defaults: SettingsRecord.optional(),
});
export type ClusterGetSettingsOutput = z.infer<
	typeof ClusterGetSettingsOutputSchema
>;

export const ClusterPutSettingsInputSchema = z.strictObject({
	...ClusterSettingsFields,
	persistent: SettingsRecord.optional(),
	transient: SettingsRecord.optional(),
});
export type ClusterPutSettingsInput = z.input<
	typeof ClusterPutSettingsInputSchema
>;

export const ClusterPutSettingsOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	persistent: SettingsRecord,
	transient: SettingsRecord,
});
export type ClusterPutSettingsOutput = z.infer<
	typeof ClusterPutSettingsOutputSchema
>;

// ── cluster.reroute: POST /_cluster/reroute ──────────────────────────────────

// Every reroute command carries exactly one action key whose own fields are
// all required (spec cluster.reroute.Command*). accept_data_loss is a literal
// true so the data-loss variants are always explicit opt-ins.
const RerouteShardCommandBase = {
	index: NonBlankString,
	shard: z.number().int().min(0),
};

const RerouteCommandSchema = z.union([
	z.strictObject({
		move: z.strictObject({
			...RerouteShardCommandBase,
			from_node: NonBlankString,
			to_node: NonBlankString,
		}),
	}),
	z.strictObject({
		cancel: z.strictObject({
			...RerouteShardCommandBase,
			node: NonBlankString,
			allow_primary: z.boolean().optional(),
		}),
	}),
	z.strictObject({
		allocate_replica: z.strictObject({
			...RerouteShardCommandBase,
			node: NonBlankString,
		}),
	}),
	z.strictObject({
		allocate_stale_primary: z.strictObject({
			...RerouteShardCommandBase,
			node: NonBlankString,
			accept_data_loss: z.literal(true),
		}),
	}),
	z.strictObject({
		allocate_empty_primary: z.strictObject({
			...RerouteShardCommandBase,
			node: NonBlankString,
			accept_data_loss: z.literal(true),
		}),
	}),
]);

export const ClusterRerouteInputSchema = z.strictObject({
	dry_run: z.boolean().optional(),
	explain: z.boolean().optional(),
	retry_failed: z.boolean().optional(),
	master_timeout: NonBlankString.optional(),
	timeout: NonBlankString.optional(),
	commands: z.array(RerouteCommandSchema).optional(),
});
export type ClusterRerouteInput = z.input<typeof ClusterRerouteInputSchema>;

export const ClusterRerouteOutputSchema = z.looseObject({
	acknowledged: z.boolean(),
	state: z.looseObject({}).optional(),
	explanations: z.array(z.looseObject({})).optional(),
});
export type ClusterRerouteOutput = z.infer<typeof ClusterRerouteOutputSchema>;

// ── cluster.allocationExplain: POST /_cluster/allocation/explain ─────────────

// All body fields are optional: with none, the API explains the first
// unallocated shard it finds.
export const ClusterAllocationExplainInputSchema = z.strictObject({
	index: NonBlankString.optional(),
	shard: z.number().int().min(0).optional(),
	primary: z.boolean().optional(),
	current_node: NonBlankString.optional(),
	include_disk_info: z.boolean().optional(),
	include_yes_decisions: z.boolean().optional(),
	master_timeout: NonBlankString.optional(),
});
export type ClusterAllocationExplainInput = z.input<
	typeof ClusterAllocationExplainInputSchema
>;

export const ClusterAllocationExplainOutputSchema = z.looseObject({
	index: z.string(),
	shard: z.number(),
	primary: z.boolean(),
	current_state: z.string(),
	can_allocate: z.string().optional(),
	can_remain_on_current_node: z.string().optional(),
	can_move_to_other_node: z.string().optional(),
	allocate_explanation: z.string().optional(),
	decision: z.string().optional(),
	explanation: z.string().optional(),
});
export type ClusterAllocationExplainOutput = z.infer<
	typeof ClusterAllocationExplainOutputSchema
>;

// ── cluster.getState: GET /_cluster/state/{metric}/{index} ───────────────────

export const ClusterGetStateInputSchema = z.strictObject({
	metric: CommaMetric(CLUSTER_STATE_METRICS).optional(),
	index: NonBlankString.optional(),
	flat_settings: z.boolean().optional(),
	local: z.boolean().optional(),
	master_timeout: NonBlankString.optional(),
});
export type ClusterGetStateInput = z.input<typeof ClusterGetStateInputSchema>;

// The cluster state document (metadata, routing table, nodes) is deeply
// nested and version-dependent; the spec types the response as a bare object.
export type ClusterGetStateOutput = z.infer<typeof EmptyObjectSchema>;
export const ClusterGetStateOutputSchema = EmptyObjectSchema;

// ── cluster.getStats: GET /_cluster/stats/nodes/{node_id} ────────────────────

export const ClusterGetStatsInputSchema = z.strictObject({
	node_id: NonBlankString.optional(),
	include_remotes: z.boolean().optional(),
	timeout: NonBlankString.optional(),
});
export type ClusterGetStatsInput = z.input<typeof ClusterGetStatsInputSchema>;

export const ClusterGetStatsOutputSchema = z.looseObject({
	cluster_name: z.string().optional(),
	cluster_uuid: z.string().optional(),
	status: z.string().optional(),
	timestamp: z.number().optional(),
	indices: z.looseObject({}).optional(),
	nodes: z.looseObject({}).optional(),
});
export type ClusterGetStatsOutput = z.infer<typeof ClusterGetStatsOutputSchema>;

// ── cluster voting config exclusions: POST|DELETE /_cluster/voting_config_exclusions

export const ClusterAddVotingConfigExclusionsInputSchema = z
	.strictObject({
		node_names: z.array(NonBlankString).min(1).optional(),
		node_ids: z.array(NonBlankString).min(1).optional(),
		master_timeout: NonBlankString.optional(),
		timeout: NonBlankString.optional(),
	})
	.refine(
		(input) =>
			(input.node_names !== undefined) !== (input.node_ids !== undefined),
		{
			message: 'provide exactly one of node_names or node_ids',
		},
	);
export type ClusterAddVotingConfigExclusionsInput = z.input<
	typeof ClusterAddVotingConfigExclusionsInputSchema
>;

// Both answers are 200 with an empty JSON body.
export type ClusterVotingConfigExclusionsOutput = z.infer<
	typeof EmptyBodyResponse
>;

export const ClusterClearVotingConfigExclusionsInputSchema = z.strictObject({
	wait_for_removal: z.boolean().optional(),
	master_timeout: NonBlankString.optional(),
});
export type ClusterClearVotingConfigExclusionsInput = z.input<
	typeof ClusterClearVotingConfigExclusionsInputSchema
>;

// ── cluster.remoteInfo: GET /_remote/info ────────────────────────────────────

export const ClusterRemoteInfoInputSchema = z.object({});
export type ClusterRemoteInfoInput = z.infer<
	typeof ClusterRemoteInfoInputSchema
>;

// Keyed by remote cluster alias; sniff and proxy clusters carry different
// fields, so only the shared ones are typed.
export const ClusterRemoteInfoOutputSchema = z.record(
	z.string(),
	z.looseObject({
		mode: z.string().optional(),
		connected: z.boolean().optional(),
		num_nodes_connected: z.number().optional(),
		max_connections_per_cluster: z.number().optional(),
		initial_connect_timeout: z.string().optional(),
		skip_unavailable: z.boolean().optional(),
		seeds: z.array(z.string()).optional(),
		proxy_address: z.string().optional(),
	}),
);
export type ClusterRemoteInfoOutput = z.infer<
	typeof ClusterRemoteInfoOutputSchema
>;

// ── cluster.healthReport: GET /_health_report/{feature} ──────────────────────

export const ClusterHealthReportInputSchema = z.strictObject({
	// Indicator names are an open, growing set (master_is_stable,
	// shards_availability, disk, ...); a comma list selects several.
	feature: NonBlankString.optional(),
	size: z.number().int().min(0).optional(),
	verbose: z.boolean().optional(),
	timeout: NonBlankString.optional(),
});
export type ClusterHealthReportInput = z.input<
	typeof ClusterHealthReportInputSchema
>;

export const ClusterHealthReportOutputSchema = z.looseObject({
	cluster_name: z.string(),
	// Indicator name -> status, symptom and detail; the indicator set is open.
	indicators: z.record(
		z.string(),
		z.looseObject({
			status: z.string(),
			symptom: z.string().optional(),
			impacted_resources: z.array(z.looseObject({})).optional(),
			details: z.looseObject({}).optional(),
		}),
	),
});
export type ClusterHealthReportOutput = z.infer<
	typeof ClusterHealthReportOutputSchema
>;

// ── cluster.sslCertificates: GET /_ssl/certificates ──────────────────────────

export const ClusterSslCertificatesInputSchema = z.object({});
export type ClusterSslCertificatesInput = z.infer<
	typeof ClusterSslCertificatesInputSchema
>;

export const ClusterSslCertificatesOutputSchema = z.array(
	z.looseObject({
		alias: z.string(),
		expiry: z.string(),
		format: z.string(),
		has_private_key: z.boolean(),
		path: z.string(),
		serial_number: z.string(),
		subject_dn: z.string(),
		issuer: z.string().optional(),
	}),
);
export type ClusterSslCertificatesOutput = z.infer<
	typeof ClusterSslCertificatesOutputSchema
>;

// ── cluster.scriptContexts / scriptLanguages ────────────────────────────────

export const ClusterScriptContextsInputSchema = z.object({});
export type ClusterScriptContextsInput = z.infer<
	typeof ClusterScriptContextsInputSchema
>;

export const ClusterScriptContextsOutputSchema = z.looseObject({
	contexts: z.array(
		z.looseObject({
			name: z.string(),
			methods: z.array(
				z.looseObject({
					name: z.string(),
					return_type: z.string(),
					params: z.array(z.string()),
				}),
			),
		}),
	),
});
export type ClusterScriptContextsOutput = z.infer<
	typeof ClusterScriptContextsOutputSchema
>;

export const ClusterScriptLanguagesInputSchema = z.object({});
export type ClusterScriptLanguagesInput = z.infer<
	typeof ClusterScriptLanguagesInputSchema
>;

export const ClusterScriptLanguagesOutputSchema = z.looseObject({
	types_allowed: z.array(z.string()),
	language_contexts: z.array(
		z.looseObject({
			language: z.string(),
			contexts: z.array(z.string()),
		}),
	),
});
export type ClusterScriptLanguagesOutput = z.infer<
	typeof ClusterScriptLanguagesOutputSchema
>;

// ── cat family (compact aligned text as JSON rows) ───────────────────────────

// cat.help: GET /_cat always answers plain text (the "=^.^=" command list),
// whatever the requested format.
export const CatHelpInputSchema = z.object({});
export type CatHelpInput = z.infer<typeof CatHelpInputSchema>;
export const CatHelpResponseSchema = z.string();
export type CatHelpResponse = z.infer<typeof CatHelpResponseSchema>;

const ExpandWildcardsQuery = z
	.string()
	.min(1)
	.refine(
		(value) =>
			value
				.split(',')
				.every((token) =>
					['all', 'open', 'closed', 'hidden', 'none'].includes(token.trim()),
				),
		{
			message:
				'expand_wildcards must be a comma-separated list of all, open, closed, hidden, none',
		},
	)
	.optional();

export const CatAliasesInputSchema = z.strictObject({
	name: NonBlankString.optional(),
	expand_wildcards: ExpandWildcardsQuery,
});
export type CatAliasesInput = z.input<typeof CatAliasesInputSchema>;
export type CatAliasesOutput = z.infer<typeof CatAliasesResponseSchema>;
export const CatAliasesResponseSchema = CatRows(
	CatRow({
		alias: CatColumn,
		index: CatColumn,
		filter: CatColumn,
		'routing.index': CatColumn,
		'routing.search': CatColumn,
		is_write_index: CatColumn,
	}),
);

export const CatAllocationInputSchema = z.strictObject({
	node_id: NonBlankString.optional(),
});
export type CatAllocationInput = z.input<typeof CatAllocationInputSchema>;
export type CatAllocationOutput = z.infer<typeof CatAllocationResponseSchema>;
export const CatAllocationResponseSchema = CatRows(
	CatRow({
		shards: CatColumn,
		'disk.indices': CatColumn,
		'disk.used': CatColumn,
		'disk.avail': CatColumn,
		'disk.total': CatColumn,
		'disk.percent': CatColumn,
		host: CatColumn,
		ip: CatColumn,
		node: CatColumn,
		'node.role': CatColumn,
	}),
);

export const CatCircuitBreakersInputSchema = z.strictObject({
	patterns: NonBlankString.optional(),
});
export type CatCircuitBreakersInput = z.input<
	typeof CatCircuitBreakersInputSchema
>;
export type CatCircuitBreakersOutput = z.infer<
	typeof CatCircuitBreakersResponseSchema
>;
export const CatCircuitBreakersResponseSchema = CatRows(
	CatRow({
		node_id: CatColumn,
		node_name: CatColumn,
		breaker: CatColumn,
		limit: CatColumn,
		limit_bytes: CatColumn,
		estimated: CatColumn,
		estimated_bytes: CatColumn,
		overhead: CatColumn,
		tripped: CatColumn,
	}),
);

export const CatComponentTemplatesInputSchema = z.strictObject({
	name: NonBlankString.optional(),
});
export type CatComponentTemplatesInput = z.input<
	typeof CatComponentTemplatesInputSchema
>;
export type CatComponentTemplatesOutput = z.infer<
	typeof CatComponentTemplatesResponseSchema
>;
export const CatComponentTemplatesResponseSchema = CatRows(
	CatRow({
		name: CatColumn,
		version: CatColumn,
		alias_count: CatColumn,
		mapping_count: CatColumn,
		settings_count: CatColumn,
		metadata_count: CatColumn,
		included_in: CatColumn,
	}),
);

export const CatCountInputSchema = z.strictObject({
	index: NonBlankString.optional(),
});
export type CatCountInput = z.input<typeof CatCountInputSchema>;
export type CatCountOutput = z.infer<typeof CatCountResponseSchema>;
export const CatCountResponseSchema = CatRows(
	CatRow({ epoch: CatColumn, timestamp: CatColumn, count: CatColumn }),
);

export const CatFielddataInputSchema = z.strictObject({
	fields: NonBlankString.optional(),
});
export type CatFielddataInput = z.input<typeof CatFielddataInputSchema>;
export type CatFielddataOutput = z.infer<typeof CatFielddataResponseSchema>;
export const CatFielddataResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		host: CatColumn,
		ip: CatColumn,
		node: CatColumn,
		field: CatColumn,
		size: CatColumn,
	}),
);

export const CatHealthInputSchema = z.strictObject({
	ts: z.boolean().optional(),
});
export type CatHealthInput = z.input<typeof CatHealthInputSchema>;
export type CatHealthOutput = z.infer<typeof CatHealthResponseSchema>;
export const CatHealthResponseSchema = CatRows(
	CatRow({
		epoch: CatColumn,
		timestamp: CatColumn,
		cluster: CatColumn,
		status: CatColumn,
		'node.total': CatColumn,
		'node.data': CatColumn,
		shards: CatColumn,
		pri: CatColumn,
		relo: CatColumn,
		init: CatColumn,
		unassign: CatColumn,
	}),
);

const CatNoArgInputSchema = z.object({});

export type CatMasterOutput = z.infer<typeof CatMasterResponseSchema>;
export const CatMasterResponseSchema = CatRows(
	CatRow({ id: CatColumn, host: CatColumn, ip: CatColumn, node: CatColumn }),
);
export type CatMasterInput = z.infer<typeof CatMasterInputSchema>;
export const CatMasterInputSchema = CatNoArgInputSchema;

export type CatNodeattrsOutput = z.infer<typeof CatNodeattrsResponseSchema>;
export const CatNodeattrsResponseSchema = CatRows(
	CatRow({
		node: CatColumn,
		host: CatColumn,
		ip: CatColumn,
		attr: CatColumn,
		value: CatColumn,
	}),
);
export type CatNodeattrsInput = z.infer<typeof CatNodeattrsInputSchema>;
export const CatNodeattrsInputSchema = CatNoArgInputSchema;

export type CatRepositoriesOutput = z.infer<
	typeof CatRepositoriesResponseSchema
>;
export const CatRepositoriesResponseSchema = CatRows(
	CatRow({ id: CatColumn, type: CatColumn }),
);
export type CatRepositoriesInput = z.infer<typeof CatRepositoriesInputSchema>;
export const CatRepositoriesInputSchema = CatNoArgInputSchema;

export type CatPendingTasksOutput = z.infer<
	typeof CatPendingTasksResponseSchema
>;
export const CatPendingTasksResponseSchema = CatRows(
	CatRow({
		insertOrder: CatColumn,
		timeInQueue: CatColumn,
		priority: CatColumn,
		source: CatColumn,
	}),
);
export type CatPendingTasksInput = z.infer<typeof CatPendingTasksInputSchema>;
export const CatPendingTasksInputSchema = CatNoArgInputSchema;

const AllowNoMatch = z.boolean().optional();

export const CatMlJobsInputSchema = z.strictObject({
	job_id: NonBlankString.optional(),
	allow_no_match: AllowNoMatch,
});
export type CatMlJobsInput = z.input<typeof CatMlJobsInputSchema>;
export type CatMlJobsOutput = z.infer<typeof CatMlJobsResponseSchema>;
export const CatMlJobsResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		state: CatColumn,
		'data.processed_records': CatColumn,
		'model.bytes': CatColumn,
		'model.memory_status': CatColumn,
		'forecasts.total': CatColumn,
		'buckets.count': CatColumn,
	}),
);

export const CatMlDataFrameAnalyticsInputSchema = z.strictObject({
	id: NonBlankString.optional(),
	allow_no_match: AllowNoMatch,
});
export type CatMlDataFrameAnalyticsInput = z.input<
	typeof CatMlDataFrameAnalyticsInputSchema
>;
export type CatMlDataFrameAnalyticsOutput = z.infer<
	typeof CatMlDataFrameAnalyticsResponseSchema
>;
export const CatMlDataFrameAnalyticsResponseSchema = CatRows(
	CatRow({ id: CatColumn, type: CatColumn, state: CatColumn }),
);

export const CatMlDatafeedsInputSchema = z.strictObject({
	datafeed_id: NonBlankString.optional(),
	allow_no_match: AllowNoMatch,
});
export type CatMlDatafeedsInput = z.input<typeof CatMlDatafeedsInputSchema>;
export type CatMlDatafeedsOutput = z.infer<typeof CatMlDatafeedsResponseSchema>;
export const CatMlDatafeedsResponseSchema = CatRows(
	CatRow({ id: CatColumn, state: CatColumn, 'buckets.count': CatColumn }),
);

const FromSizeParams = {
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(1).optional(),
};

export const CatMlTrainedModelsInputSchema = z.strictObject({
	model_id: NonBlankString.optional(),
	allow_no_match: AllowNoMatch,
	...FromSizeParams,
});
export type CatMlTrainedModelsInput = z.input<
	typeof CatMlTrainedModelsInputSchema
>;
export type CatMlTrainedModelsOutput = z.infer<
	typeof CatMlTrainedModelsResponseSchema
>;
export const CatMlTrainedModelsResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		created_by: CatColumn,
		create_time: CatColumn,
		version: CatColumn,
		description: CatColumn,
		heap_size: CatColumn,
		operations: CatColumn,
	}),
);

export const CatNodesInputSchema = z.strictObject({
	full_id: z.boolean().optional(),
});
export type CatNodesInput = z.input<typeof CatNodesInputSchema>;
export type CatNodesOutput = z.infer<typeof CatNodesResponseSchema>;
export const CatNodesResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		name: CatColumn,
		ip: CatColumn,
		'heap.percent': CatColumn,
		'ram.percent': CatColumn,
		cpu: CatColumn,
		master: CatColumn,
		role: CatColumn,
		version: CatColumn,
	}),
);

export const CatPluginsInputSchema = z.strictObject({
	include_bootstrap: z.boolean().optional(),
});
export type CatPluginsInput = z.input<typeof CatPluginsInputSchema>;
export type CatPluginsOutput = z.infer<typeof CatPluginsResponseSchema>;
export const CatPluginsResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		name: CatColumn,
		component: CatColumn,
		version: CatColumn,
		description: CatColumn,
		type: CatColumn,
	}),
);

export const CatRecoveryInputSchema = z.strictObject({
	index: NonBlankString.optional(),
	active_only: z.boolean().optional(),
	detailed: z.boolean().optional(),
});
export type CatRecoveryInput = z.input<typeof CatRecoveryInputSchema>;
export type CatRecoveryOutput = z.infer<typeof CatRecoveryResponseSchema>;
export const CatRecoveryResponseSchema = CatRows(
	CatRow({
		index: CatColumn,
		shard: CatColumn,
		start_time: CatColumn,
		type: CatColumn,
		stage: CatColumn,
		source_host: CatColumn,
		target_host: CatColumn,
		repository: CatColumn,
		snapshot: CatColumn,
		files: CatColumn,
		bytes_recovered: CatColumn,
		bytes_percent: CatColumn,
	}),
);

export const CatSegmentsInputSchema = z.strictObject({
	index: NonBlankString.optional(),
	expand_wildcards: ExpandWildcardsQuery,
});
export type CatSegmentsInput = z.input<typeof CatSegmentsInputSchema>;
export type CatSegmentsOutput = z.infer<typeof CatSegmentsResponseSchema>;
export const CatSegmentsResponseSchema = CatRows(
	CatRow({
		index: CatColumn,
		shard: CatColumn,
		prirep: CatColumn,
		ip: CatColumn,
		segment: CatColumn,
		generation: CatColumn,
		'docs.count': CatColumn,
		'docs.deleted': CatColumn,
		size: CatColumn,
		'size.memory': CatColumn,
		committed: CatColumn,
		version: CatColumn,
	}),
);

export const CatShardsInputSchema = z.strictObject({
	index: NonBlankString.optional(),
});
export type CatShardsInput = z.input<typeof CatShardsInputSchema>;
export type CatShardsOutput = z.infer<typeof CatShardsResponseSchema>;
export const CatShardsResponseSchema = CatRows(
	CatRow({
		index: CatColumn,
		shard: CatColumn,
		prirep: CatColumn,
		state: CatColumn,
		docs: CatColumn,
		store: CatColumn,
		ip: CatColumn,
		node: CatColumn,
		'unassigned.reason': CatColumn,
	}),
);

export const CatSnapshotsInputSchema = z.strictObject({
	repository: NonBlankString.optional(),
	ignore_unavailable: z.boolean().optional(),
});
export type CatSnapshotsInput = z.input<typeof CatSnapshotsInputSchema>;
export type CatSnapshotsOutput = z.infer<typeof CatSnapshotsResponseSchema>;
export const CatSnapshotsResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		repository: CatColumn,
		status: CatColumn,
		start_epoch: CatColumn,
		end_epoch: CatColumn,
		start_time: CatColumn,
		end_time: CatColumn,
		duration: CatColumn,
		indices: CatColumn,
	}),
);

export const CatTasksInputSchema = z.strictObject({
	actions: StringList.optional(),
	nodes: StringList.optional(),
	parent_task_id: NonBlankString.optional(),
	detailed: z.boolean().optional(),
	wait_for_completion: z.boolean().optional(),
});
export type CatTasksInput = z.input<typeof CatTasksInputSchema>;
export type CatTasksOutput = z.infer<typeof CatTasksResponseSchema>;
export const CatTasksResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		action: CatColumn,
		task_id: CatColumn,
		parent_task_id: CatColumn,
		type: CatColumn,
		start_time: CatColumn,
		timestamp: CatColumn,
		running_time_ns: CatColumn,
		node_id: CatColumn,
		node: CatColumn,
	}),
);

export const CatTemplatesInputSchema = z.strictObject({
	name: NonBlankString.optional(),
});
export type CatTemplatesInput = z.input<typeof CatTemplatesInputSchema>;
export type CatTemplatesOutput = z.infer<typeof CatTemplatesResponseSchema>;
export const CatTemplatesResponseSchema = CatRows(
	CatRow({
		name: CatColumn,
		index_patterns: CatColumn,
		order: CatColumn,
		version: CatColumn,
		composed_of: CatColumn,
	}),
);

export const CatThreadPoolInputSchema = z.strictObject({
	thread_pool_patterns: NonBlankString.optional(),
});
export type CatThreadPoolInput = z.input<typeof CatThreadPoolInputSchema>;
export type CatThreadPoolOutput = z.infer<typeof CatThreadPoolResponseSchema>;
export const CatThreadPoolResponseSchema = CatRows(
	CatRow({
		node_name: CatColumn,
		name: CatColumn,
		type: CatColumn,
		active: CatColumn,
		pool_size: CatColumn,
		queue: CatColumn,
		rejected: CatColumn,
	}),
);

export const CatTransformsInputSchema = z.strictObject({
	transform_id: NonBlankString.optional(),
	allow_no_match: AllowNoMatch,
	...FromSizeParams,
});
export type CatTransformsInput = z.input<typeof CatTransformsInputSchema>;
export type CatTransformsOutput = z.infer<typeof CatTransformsResponseSchema>;
export const CatTransformsResponseSchema = CatRows(
	CatRow({
		id: CatColumn,
		state: CatColumn,
		checkpoint: CatColumn,
		documents_processed: CatColumn,
		checkpoint_progress: CatColumn,
		last_search_time: CatColumn,
		changes_last_detection_time: CatColumn,
	}),
);

// ── nodes family ─────────────────────────────────────────────────────────────

export const NodesInfoInputSchema = z.strictObject({
	node_id: NonBlankString.optional(),
	metric: CommaMetric(NODES_INFO_METRICS).optional(),
	flat_settings: z.boolean().optional(),
	timeout: NonBlankString.optional(),
});
export type NodesInfoInput = z.input<typeof NodesInfoInputSchema>;

// Per-node info payloads (os, jvm, thread pools, plugins, ingest...) are
// deeply nested and version-dependent, so only the envelope is typed.
export const NodesInfoOutputSchema = z.looseObject({
	cluster_name: z.string().optional(),
	_nodes: z.looseObject({}).optional(),
	nodes: z.record(z.string(), z.looseObject({})),
});
export type NodesInfoOutput = z.infer<typeof NodesInfoOutputSchema>;

export const NodesStatsInputSchema = z
	.strictObject({
		node_id: NonBlankString.optional(),
		metric: CommaMetric(NODES_STATS_METRICS).optional(),
		// index_metric is only valid when the indices metric is requested.
		index_metric: CommaMetric(STATS_METRICS).optional(),
		level: z.enum(['node', 'indices', 'shards']).optional(),
		timeout: NonBlankString.optional(),
		include_segment_file_sizes: z.boolean().optional(),
		include_unloaded_segments: z.boolean().optional(),
		fields: NonBlankString.optional(),
	})
	.refine(
		(parsed) =>
			parsed.index_metric === undefined ||
			(parsed.metric !== undefined &&
				parsed.metric
					.split(',')
					.some(
						(metric) => metric.trim() === 'indices' || metric.trim() === '_all',
					)),
		{
			message:
				'index_metric requires metric to include indices (or _all), per the spec',
		},
	);
export type NodesStatsInput = z.input<typeof NodesStatsInputSchema>;

export const NodesStatsOutputSchema = z.looseObject({
	cluster_name: z.string().optional(),
	_nodes: z.looseObject({}).optional(),
	nodes: z.record(z.string(), z.looseObject({})),
});
export type NodesStatsOutput = z.infer<typeof NodesStatsOutputSchema>;

export const NodesUsageInputSchema = z.strictObject({
	node_id: NonBlankString.optional(),
	metric: CommaMetric(NODES_USAGE_METRICS).optional(),
	timeout: NonBlankString.optional(),
});
export type NodesUsageInput = z.input<typeof NodesUsageInputSchema>;

export const NodesUsageOutputSchema = z.looseObject({
	cluster_name: z.string().optional(),
	_nodes: z.looseObject({}).optional(),
	nodes: z.record(z.string(), z.looseObject({})),
});
export type NodesUsageOutput = z.infer<typeof NodesUsageOutputSchema>;

export const NodesHotThreadsInputSchema = z.strictObject({
	node_id: NonBlankString.optional(),
	threads: z.number().int().min(1).optional(),
	// The spec reuses the ThreadType enum for sort but defaults it to "total",
	// which that enum does not contain; the server accepts total and cpu
	// (HotThreads.SortOrder), so those are the pinned values.
	sort: z.enum(['total', 'cpu']).optional(),
	type: z.enum(['cpu', 'wait', 'block', 'gpu', 'mem']).optional(),
	interval: NonBlankString.optional(),
	snapshots: z.number().int().min(1).optional(),
	ignore_idle_threads: z.boolean().optional(),
	timeout: NonBlankString.optional(),
});
export type NodesHotThreadsInput = z.input<typeof NodesHotThreadsInputSchema>;

// Hot threads always answer text/plain (RestNodesHotThreadsAction), so the
// shared JSON client surfaces the raw thread dump as a string.
export const NodesHotThreadsOutputSchema = z.string();
export type NodesHotThreadsOutput = z.infer<typeof NodesHotThreadsOutputSchema>;

export const NodesReloadSecureSettingsInputSchema = z.strictObject({
	node_id: NonBlankString.optional(),
	timeout: NonBlankString.optional(),
});
export type NodesReloadSecureSettingsInput = z.input<
	typeof NodesReloadSecureSettingsInputSchema
>;

export const NodesReloadSecureSettingsOutputSchema = z.looseObject({
	cluster_name: z.string().optional(),
	_nodes: z.looseObject({}).optional(),
	nodes: z.record(
		z.string(),
		z.looseObject({ stats: z.looseObject({}).optional() }),
	),
});
export type NodesReloadSecureSettingsOutput = z.infer<
	typeof NodesReloadSecureSettingsOutputSchema
>;

export const NodesRepositoriesMeteringInputSchema = z.strictObject({
	node_id: NonBlankString.optional(),
});
export type NodesRepositoriesMeteringInput = z.input<
	typeof NodesRepositoriesMeteringInputSchema
>;

export const NodesRepositoriesMeteringOutputSchema = z.looseObject({
	cluster_name: z.string().optional(),
	_nodes: z.looseObject({}).optional(),
	nodes: z.record(z.string(), z.looseObject({})),
});
export type NodesRepositoriesMeteringOutput = z.infer<
	typeof NodesRepositoriesMeteringOutputSchema
>;

export const NodesClearRepositoriesMeteringInputSchema = z.strictObject({
	node_id: NonBlankString,
	max_archive_version: z.number().int().min(0),
});
export type NodesClearRepositoriesMeteringInput = z.input<
	typeof NodesClearRepositoriesMeteringInputSchema
>;

export const NodesClearRepositoriesMeteringOutputSchema = z.looseObject({
	cluster_name: z.string().optional(),
	_nodes: z.looseObject({}).optional(),
	nodes: z.record(z.string(), z.looseObject({})),
});
export type NodesClearRepositoriesMeteringOutput = z.infer<
	typeof NodesClearRepositoriesMeteringOutputSchema
>;

// ── tasks family ─────────────────────────────────────────────────────────────

export const TaskListResponseSchema = z.looseObject({
	node_failures: z.array(z.looseObject({})).optional(),
	task_failures: z.array(z.looseObject({})).optional(),
	// Present with group_by=nodes (the spec default) / parents / none; parents
	// keys the tasks by task id instead of listing them.
	nodes: z.record(z.string(), z.looseObject({})).optional(),
	tasks: z
		.union([
			z.array(z.looseObject({})),
			z.record(z.string(), z.looseObject({})),
		])
		.optional(),
});
export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;

export const TasksListInputSchema = z.strictObject({
	actions: StringList.optional(),
	nodes: StringList.optional(),
	parent_task_id: NonBlankString.optional(),
	detailed: z.boolean().optional(),
	group_by: z.enum(['nodes', 'parents', 'none']).optional(),
	wait_for_completion: z.boolean().optional(),
	timeout: NonBlankString.optional(),
});
export type TasksListInput = z.input<typeof TasksListInputSchema>;
export type TasksListOutput = TaskListResponse;

// A task id is "<node_id>:<number>" (spec _types.TaskId).
const TaskId = NonBlankString;

export const TasksGetInputSchema = z.strictObject({
	task_id: TaskId,
	wait_for_completion: z.boolean().optional(),
	timeout: NonBlankString.optional(),
});
export type TasksGetInput = z.input<typeof TasksGetInputSchema>;

export const TasksGetOutputSchema = z.looseObject({
	completed: z.boolean(),
	task: z.looseObject({
		node: z.string(),
		id: z.number(),
		type: z.string(),
		action: z.string(),
		start_time_in_millis: z.number(),
		running_time_in_nanos: z.number(),
		cancellable: z.boolean(),
		headers: z.record(z.string(), z.string()),
		cancelled: z.boolean().optional(),
		description: z.string().optional(),
	}),
	// The wrapped operation's own response, present once the task completed.
	response: z.looseObject({}).optional(),
});
export type TasksGetOutput = z.infer<typeof TasksGetOutputSchema>;

export const TasksCancelInputSchema = z.strictObject({
	task_id: TaskId,
	actions: StringList.optional(),
	nodes: StringList.optional(),
	parent_task_id: NonBlankString.optional(),
	wait_for_completion: z.boolean().optional(),
});
export type TasksCancelInput = z.input<typeof TasksCancelInputSchema>;
export type TasksCancelOutput = TaskListResponse;

// ── security family: shared fragments ────────────────────────────────────────

// z.unknown() values: security metadata is arbitrary caller-defined JSON;
// no stricter value type can hold it (same precedent as SettingsRecord).
const SecurityMetadata = z.record(z.string(), z.unknown());

// Index privilege entries inside role descriptors: `names` takes a single
// target or a list; field_security and query are the privilege DSL (any query
// shape), validated server-side, so they pass through loose.
const SecurityIndexPrivilegeSchema = z.looseObject({
	names: z.union([NonBlankString, z.array(NonBlankString).min(1)]),
	privileges: z.array(NonBlankString).min(1),
	allow_restricted_indices: z.boolean().optional(),
});

// Application privilege entries inside role descriptors.
const SecurityApplicationPrivilegeSchema = z.looseObject({
	application: NonBlankString,
	privileges: z.array(NonBlankString).min(1),
	resources: z.array(NonBlankString).optional(),
});

// security._types.RoleDescriptor: the privilege tree roles and API keys
// accept. The full descriptor (global, remote_indices, transpose, ...) is
// open-ended and cluster-validated; the common fields are typed.
const SecurityRoleDescriptorSchema = z.looseObject({
	cluster: z.array(NonBlankString).optional(),
	indices: z.array(SecurityIndexPrivilegeSchema).optional(),
	applications: z.array(SecurityApplicationPrivilegeSchema).optional(),
	run_as: z.array(NonBlankString).optional(),
	metadata: SecurityMetadata.optional(),
	global: z.array(z.looseObject({})).optional(),
	remote_indices: z.array(z.looseObject({})).optional(),
	remote_cluster: z.array(NonBlankString).optional(),
});
export type SecurityRoleDescriptor = z.input<
	typeof SecurityRoleDescriptorSchema
>;

// One API key row, shared by apiKeys.get and apiKeys.query.
const SecurityApiKeyItemSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	creation: z.number(),
	expiration: z.number().optional(),
	invalidated: z.boolean(),
	invalidation: z.number().optional(),
	username: z.string(),
	realm: z.string(),
	realm_type: z.string().optional(),
	metadata: SecurityMetadata,
	role_descriptors: z.record(z.string(), z.looseObject({})).optional(),
	limited_by: z.array(z.looseObject({})).optional(),
	access: z.looseObject({}).optional(),
	profile_uid: z.string().optional(),
});
export type SecurityApiKeyItem = z.infer<typeof SecurityApiKeyItemSchema>;

// The _clear_cache APIs (API keys, realms, roles, privileges, service tokens)
// answer the per-node statistics envelope keyed by node id.
const SecurityCacheClearResponseSchema = z.looseObject({
	_nodes: z.looseObject({
		total: z.number(),
		successful: z.number(),
		failed: z.number(),
	}),
	cluster_name: z.string(),
	nodes: z.record(z.string(), z.looseObject({})),
});
export type SecurityCacheClearResponse = z.infer<
	typeof SecurityCacheClearResponseSchema
>;

// The created-or-cloned API key reply (create, clone, grant, cross-cluster).
export const SecurityCreatedApiKeySchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	api_key: z.string(),
	encoded: z.string(),
	expiration: z.number().optional(),
});
export type SecurityCreatedApiKey = z.infer<typeof SecurityCreatedApiKeySchema>;

// ── security.apiKeys: GET|POST|DELETE /_security/api_key and friends ─────────

export const SecurityApiKeysGetInputSchema = z.strictObject({
	id: NonBlankString.optional(),
	name: NonBlankString.optional(),
	owner: z.boolean().optional(),
	realm_name: NonBlankString.optional(),
	username: NonBlankString.optional(),
	with_limited_by: z.boolean().optional(),
	active_only: z.boolean().optional(),
	with_profile_uid: z.boolean().optional(),
});
export type SecurityApiKeysGetInput = z.input<
	typeof SecurityApiKeysGetInputSchema
>;

export const SecurityApiKeysGetOutputSchema = z.looseObject({
	api_keys: z.array(SecurityApiKeyItemSchema),
});
export type SecurityApiKeysGetOutput = z.infer<
	typeof SecurityApiKeysGetOutputSchema
>;

const SecurityApiKeyBodyFields = {
	expiration: NonBlankString.optional(),
	role_descriptors: z
		.record(z.string().min(1), SecurityRoleDescriptorSchema)
		.optional(),
	metadata: SecurityMetadata.optional(),
};

export const SecurityApiKeysCreateInputSchema = z.strictObject({
	name: NonBlankString,
	...SecurityApiKeyBodyFields,
	refresh: RefreshParam.optional(),
});
export type SecurityApiKeysCreateInput = z.input<
	typeof SecurityApiKeysCreateInputSchema
>;
export type SecurityApiKeysCreateOutput = SecurityCreatedApiKey;

export const SecurityApiKeysCloneInputSchema = z.strictObject({
	name: NonBlankString,
	...SecurityApiKeyBodyFields,
	refresh: RefreshParam.optional(),
});
export type SecurityApiKeysCloneInput = z.input<
	typeof SecurityApiKeysCloneInputSchema
>;
export type SecurityApiKeysCloneOutput = SecurityCreatedApiKey;

export const SecurityApiKeysGrantInputSchema = z
	.strictObject({
		api_key: z.strictObject({
			name: NonBlankString,
			...SecurityApiKeyBodyFields,
		}),
		grant_type: z.enum([
			'access_token',
			'password',
			'_user_managed_service_account',
		]),
		access_token: NonBlankString.optional(),
		client_authentication: z
			.strictObject({
				scheme: z.literal('SharedSecret'),
				value: NonBlankString,
			})
			.optional(),
		service_account_token: NonBlankString.optional(),
		username: NonBlankString.optional(),
		password: NonBlankString.optional(),
		run_as: NonBlankString.optional(),
		refresh: RefreshParam.optional(),
	})
	.refine(
		(input) => {
			if (input.grant_type === 'access_token')
				return input.access_token !== undefined;
			if (input.grant_type === 'password')
				return input.username !== undefined && input.password !== undefined;
			return input.service_account_token !== undefined;
		},
		{
			message:
				'grant_type requires its paired credential (access_token, username+password, or service_account_token)',
		},
	);
export type SecurityApiKeysGrantInput = z.input<
	typeof SecurityApiKeysGrantInputSchema
>;
export type SecurityApiKeysGrantOutput = SecurityCreatedApiKey;

export const SecurityApiKeysInvalidateInputSchema = z
	.strictObject({
		id: NonBlankString.optional(),
		ids: z.array(NonBlankString).min(1).optional(),
		name: NonBlankString.optional(),
		owner: z.boolean().optional(),
		realm_name: NonBlankString.optional(),
		username: NonBlankString.optional(),
	})
	.refine(
		(input) =>
			input.owner === true ||
			input.id !== undefined ||
			input.ids !== undefined ||
			input.name !== undefined ||
			input.realm_name !== undefined ||
			input.username !== undefined,
		{
			message:
				'provide a selector (id, ids, name, realm_name or username) or owner: true, per the spec',
		},
	);
export type SecurityApiKeysInvalidateInput = z.input<
	typeof SecurityApiKeysInvalidateInputSchema
>;

export const SecurityApiKeysInvalidateOutputSchema = z.looseObject({
	error_count: z.number(),
	error_details: z
		.array(
			z.looseObject({
				type: z.string().optional(),
				reason: z.string().optional(),
				id: z.string().optional(),
				caused_by: ErrorCauseSchema.optional(),
			}),
		)
		.optional(),
	invalidated_api_keys: z.array(z.string()),
	previously_invalidated_api_keys: z.array(z.string()),
});
export type SecurityApiKeysInvalidateOutput = z.infer<
	typeof SecurityApiKeysInvalidateOutputSchema
>;

export const SecurityApiKeysBulkUpdateInputSchema = z.strictObject({
	ids: z.union([NonBlankString, z.array(NonBlankString).min(1)]),
	...SecurityApiKeyBodyFields,
});
export type SecurityApiKeysBulkUpdateInput = z.input<
	typeof SecurityApiKeysBulkUpdateInputSchema
>;

export const SecurityApiKeysBulkUpdateOutputSchema = z.looseObject({
	errors: z
		.looseObject({
			count: z.number(),
			details: z.record(z.string(), z.looseObject({})),
		})
		.optional(),
	noops: z.array(z.string()),
	updated: z.array(z.string()),
});
export type SecurityApiKeysBulkUpdateOutput = z.infer<
	typeof SecurityApiKeysBulkUpdateOutputSchema
>;

export const SecurityApiKeysUpdateInputSchema = z.strictObject({
	id: NonBlankString,
	...SecurityApiKeyBodyFields,
});
export type SecurityApiKeysUpdateInput = z.input<
	typeof SecurityApiKeysUpdateInputSchema
>;

export const SecurityApiKeysUpdateOutputSchema = z.looseObject({
	updated: z.boolean(),
});
export type SecurityApiKeysUpdateOutput = z.infer<
	typeof SecurityApiKeysUpdateOutputSchema
>;

export const SecurityApiKeysClearCacheInputSchema = z.strictObject({
	// Comma-separated key ids, or `*` for all keys.
	ids: NonBlankString,
});
export type SecurityApiKeysClearCacheInput = z.input<
	typeof SecurityApiKeysClearCacheInputSchema
>;
export type SecurityApiKeysClearCacheOutput = SecurityCacheClearResponse;

export const SecurityApiKeysQueryInputSchema = z.strictObject({
	query: QuerySchema.optional(),
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(0).max(10_000).optional(),
	with_limited_by: z.boolean().optional(),
	with_profile_uid: z.boolean().optional(),
	typed_keys: z.boolean().optional(),
});
export type SecurityApiKeysQueryInput = z.input<
	typeof SecurityApiKeysQueryInputSchema
>;

// The _query APIs answer a search-style hits envelope; hit items reuse the
// typed API key row (loose itself, so vendor additions pass).
export const SecurityApiKeysQueryOutputSchema = z.looseObject({
	total: z.number().optional(),
	count: z.number().optional(),
	api_keys: z.array(SecurityApiKeyItemSchema).default([]),
	aggregations: z.looseObject({}).optional(),
});
export type SecurityApiKeysQueryOutput = z.infer<
	typeof SecurityApiKeysQueryOutputSchema
>;

// ── security.crossClusterApiKeys: /_security/cross_cluster/api_key ───────────

// Cross-cluster access entries: the same open privilege-DSL tree as role
// index privileges, so only the common fields are typed.
const SecurityCrossClusterAccessEntrySchema = z.looseObject({
	names: z.union([NonBlankString, z.array(NonBlankString).min(1)]),
	field_security: z.looseObject({}).optional(),
	query: z.looseObject({}).optional(),
	allow_restricted_indices: z.boolean().optional(),
});

const SecurityCrossClusterAccessSchema = z
	.strictObject({
		search: z.array(SecurityCrossClusterAccessEntrySchema).min(1).optional(),
		replication: z
			.array(SecurityCrossClusterAccessEntrySchema)
			.min(1)
			.optional(),
	})
	.refine(
		(access) => access.search !== undefined || access.replication !== undefined,
		{ message: 'access requires search and/or replication per the spec' },
	);

export const SecurityCrossClusterApiKeysCreateInputSchema = z.strictObject({
	name: NonBlankString,
	access: SecurityCrossClusterAccessSchema,
	expiration: NonBlankString.optional(),
	metadata: SecurityMetadata.optional(),
	refresh: RefreshParam.optional(),
});
export type SecurityCrossClusterApiKeysCreateInput = z.input<
	typeof SecurityCrossClusterApiKeysCreateInputSchema
>;
export type SecurityCrossClusterApiKeysCreateOutput = SecurityCreatedApiKey;

export const SecurityCrossClusterApiKeysUpdateInputSchema = z.strictObject({
	id: NonBlankString,
	access: SecurityCrossClusterAccessSchema,
	expiration: NonBlankString.optional(),
	metadata: SecurityMetadata.optional(),
	refresh: RefreshParam.optional(),
});
export type SecurityCrossClusterApiKeysUpdateInput = z.input<
	typeof SecurityCrossClusterApiKeysUpdateInputSchema
>;
export type SecurityCrossClusterApiKeysUpdateOutput = z.infer<
	typeof SecurityApiKeysUpdateOutputSchema
>;

// ── security.authenticate and the user/privilege checks ──────────────────────

export const SecurityAuthenticateInputSchema = z.object({});
export type SecurityAuthenticateInput = z.infer<
	typeof SecurityAuthenticateInputSchema
>;

export const SecurityAuthenticateOutputSchema = z.looseObject({
	username: z.string(),
	roles: z.array(z.string()),
	enabled: z.boolean(),
	authentication_type: z.string(),
	authentication_realm: z.looseObject({ name: z.string(), type: z.string() }),
	lookup_realm: z.looseObject({ name: z.string(), type: z.string() }),
	metadata: SecurityMetadata,
	full_name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	api_key: z
		.looseObject({
			id: z.string().optional(),
			name: z.string().optional(),
			managed_by: z.string().optional(),
			internal: z.boolean().optional(),
		})
		.optional(),
	token: z
		.looseObject({
			name: z.string().optional(),
			type: z.string().optional(),
			managed_by: z.string().optional(),
		})
		.optional(),
});
export type SecurityAuthenticateOutput = z.infer<
	typeof SecurityAuthenticateOutputSchema
>;

// One native-realm user row, shared by users.get and users.query hits.
const SecurityUserSchema = z.looseObject({
	username: z.string(),
	roles: z.array(z.string()),
	full_name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	metadata: SecurityMetadata,
	enabled: z.boolean(),
});
export type SecurityUser = z.infer<typeof SecurityUserSchema>;

// ── security.users: /_security/user ──────────────────────────────────────────

export const SecurityUsersGetInputSchema = z.strictObject({
	// Comma-separated usernames or wildcards; the spec default is all users.
	username: NonBlankString,
	with_profile_uid: z.boolean().optional(),
});
export type SecurityUsersGetInput = z.input<typeof SecurityUsersGetInputSchema>;

export const SecurityUsersGetOutputSchema = z.record(
	z.string().min(1),
	SecurityUserSchema,
);
export type SecurityUsersGetOutput = z.infer<
	typeof SecurityUsersGetOutputSchema
>;

const SecurityPutUserBodyFields = {
	password: NonBlankString.optional(),
	password_hash: NonBlankString.optional(),
	roles: z.array(NonBlankString).optional(),
	full_name: z.string().optional(),
	email: z.string().optional(),
	metadata: SecurityMetadata.optional(),
	enabled: z.boolean().optional(),
};

export const SecurityUsersPutInputSchema = z.strictObject({
	username: NonBlankString,
	...SecurityPutUserBodyFields,
	refresh: RefreshParam.optional(),
});
export type SecurityUsersPutInput = z.input<typeof SecurityUsersPutInputSchema>;

export const SecurityCreatedResponseSchema = z.looseObject({
	created: z.boolean(),
});
export type SecurityCreatedResponse = z.infer<
	typeof SecurityCreatedResponseSchema
>;

export const SecurityFoundResponseSchema = z.looseObject({
	found: z.boolean(),
});
export type SecurityFoundResponse = z.infer<typeof SecurityFoundResponseSchema>;

// The 200 replies for password change, enable and disable are empty objects.
const SecurityEmptyResponseSchema = z.looseObject({});
export type SecurityEmptyResponse = z.infer<typeof SecurityEmptyResponseSchema>;

export const SecurityUsersDeleteInputSchema = z.strictObject({
	username: NonBlankString,
	refresh: RefreshParam.optional(),
});
export type SecurityUsersDeleteInput = z.input<
	typeof SecurityUsersDeleteInputSchema
>;
export type SecurityUsersDeleteOutput = SecurityFoundResponse;

export const SecurityUsersDisableInputSchema = z.strictObject({
	username: NonBlankString,
	refresh: RefreshParam.optional(),
});
export type SecurityUsersDisableInput = z.input<
	typeof SecurityUsersDisableInputSchema
>;
export type SecurityUsersDisableOutput = SecurityEmptyResponse;

export const SecurityUsersEnableInputSchema = z.strictObject({
	username: NonBlankString,
	refresh: RefreshParam.optional(),
});
export type SecurityUsersEnableInput = z.input<
	typeof SecurityUsersEnableInputSchema
>;
export type SecurityUsersEnableOutput = SecurityEmptyResponse;

export const SecurityUsersChangePasswordInputSchema = z
	.strictObject({
		username: NonBlankString,
		password: NonBlankString.optional(),
		password_hash: NonBlankString.optional(),
		refresh: RefreshParam.optional(),
	})
	.refine(
		(input) =>
			(input.password !== undefined) !== (input.password_hash !== undefined),
		{ message: 'provide exactly one of password or password_hash' },
	);
export type SecurityUsersChangePasswordInput = z.input<
	typeof SecurityUsersChangePasswordInputSchema
>;
export type SecurityUsersChangePasswordOutput = SecurityEmptyResponse;

export const SecurityUsersQueryInputSchema = z.strictObject({
	query: QuerySchema.optional(),
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(0).max(10_000).optional(),
	with_profile_uid: z.boolean().optional(),
});
export type SecurityUsersQueryInput = z.input<
	typeof SecurityUsersQueryInputSchema
>;

export const SecurityUsersQueryOutputSchema = z.looseObject({
	total: z.number().optional(),
	count: z.number().optional(),
	users: z.array(SecurityUserSchema).default([]),
});
export type SecurityUsersQueryOutput = z.infer<
	typeof SecurityUsersQueryOutputSchema
>;

// ── security.hasPrivileges / security.getUserPrivileges ──────────────────────

// The index privilege check body: names take a target or a list; the Query
// DSL in `query` is the full DSL, so it passes through loose.
const SecurityPrivilegesCheckIndexSchema = z.looseObject({
	names: z.union([NonBlankString, z.array(NonBlankString).min(1)]),
	privileges: z.array(NonBlankString).min(1),
	field_security: z
		.strictObject({
			grant: z.array(NonBlankString).optional(),
			except: z.array(NonBlankString).optional(),
		})
		.optional(),
	query: z.looseObject({}).optional(),
});

// The privileges object has_privileges posts (cluster, index, application);
// all sections are optional because an empty body is a valid check that
// returns everything false.
const SecurityPrivilegesCheckSchema = z.strictObject({
	cluster: z.array(NonBlankString).min(1).optional(),
	index: z.array(SecurityPrivilegesCheckIndexSchema).min(1).optional(),
	application: z
		.array(
			z.strictObject({
				application: NonBlankString,
				privileges: z.array(NonBlankString).min(1),
				resources: z.array(NonBlankString).optional(),
			}),
		)
		.min(1)
		.optional(),
});

export const SecurityHasPrivilegesInputSchema = z.strictObject({
	user: NonBlankString,
	cluster: z.array(NonBlankString).min(1).optional(),
	index: z.array(SecurityPrivilegesCheckIndexSchema).min(1).optional(),
	application: z
		.array(
			z.strictObject({
				application: NonBlankString,
				privileges: z.array(NonBlankString).min(1),
				resources: z.array(NonBlankString).optional(),
			}),
		)
		.min(1)
		.optional(),
});
export type SecurityHasPrivilegesInput = z.input<
	typeof SecurityHasPrivilegesInputSchema
>;

// The reply repeats the request shape with per-privilege booleans plus the
// username and an overall verdict; privilege namespaces are dynamic.
export const SecurityHasPrivilegesOutputSchema = z.looseObject({
	username: z.string(),
	has_all_requested: z.boolean(),
	cluster: z.looseObject({}).optional(),
	index: z.looseObject({}).optional(),
	application: z.looseObject({}).optional(),
});
export type SecurityHasPrivilegesOutput = z.infer<
	typeof SecurityHasPrivilegesOutputSchema
>;

export const SecurityGetUserPrivilegesInputSchema = z.object({});
export type SecurityGetUserPrivilegesInput = z.infer<
	typeof SecurityGetUserPrivilegesInputSchema
>;

export const SecurityGetUserPrivilegesOutputSchema = z.looseObject({
	applications: z.array(
		z.looseObject({
			application: z.string(),
			privileges: z.array(z.string()),
			resources: z.array(z.string()),
		}),
	),
	cluster: z.array(z.string()),
	global: z.array(z.looseObject({})),
	indices: z.array(z.looseObject({})),
	run_as: z.array(z.string()),
	remote_cluster: z.array(z.looseObject({})).optional(),
	remote_indices: z.array(z.looseObject({})).optional(),
});
export type SecurityGetUserPrivilegesOutput = z.infer<
	typeof SecurityGetUserPrivilegesOutputSchema
>;

// ── security.roles: /_security/role ──────────────────────────────────────────

export const SecurityRolesGetInputSchema = z.strictObject({
	// Comma-separated role names or wildcards; the spec default is all roles.
	name: NonBlankString,
	include_implicit: z.boolean().optional(),
});
export type SecurityRolesGetInput = z.input<typeof SecurityRolesGetInputSchema>;

// Get and query return role names mapped to their descriptor trees, which
// are the same open privilege DSL the inputs accept.
export const SecurityRolesGetOutputSchema = z.record(
	z.string().min(1),
	SecurityRoleDescriptorSchema,
);
export type SecurityRolesGetOutput = z.infer<
	typeof SecurityRolesGetOutputSchema
>;

export const SecurityRolesPutInputSchema = z.strictObject({
	name: NonBlankString,
	role: SecurityRoleDescriptorSchema,
	refresh: RefreshParam.optional(),
});
export type SecurityRolesPutInput = z.input<typeof SecurityRolesPutInputSchema>;

export const SecurityRolesPutOutputSchema = z.looseObject({
	role: z.looseObject({ created: z.boolean() }),
});
export type SecurityRolesPutOutput = z.infer<
	typeof SecurityRolesPutOutputSchema
>;

export const SecurityRolesDeleteInputSchema = z.strictObject({
	name: NonBlankString,
	refresh: RefreshParam.optional(),
});
export type SecurityRolesDeleteInput = z.input<
	typeof SecurityRolesDeleteInputSchema
>;
export type SecurityRolesDeleteOutput = SecurityFoundResponse;

const SecurityRoleErrorsSchema = z.looseObject({
	count: z.number(),
	details: z.record(z.string(), z.looseObject({})),
});

export const SecurityRolesBulkPutInputSchema = z.strictObject({
	roles: z.record(z.string().min(1), SecurityRoleDescriptorSchema),
	refresh: RefreshParam.optional(),
});
export type SecurityRolesBulkPutInput = z.input<
	typeof SecurityRolesBulkPutInputSchema
>;

export const SecurityRolesBulkPutOutputSchema = z.looseObject({
	created: z.array(z.string()).optional(),
	updated: z.array(z.string()).optional(),
	noop: z.array(z.string()).optional(),
	errors: SecurityRoleErrorsSchema.optional(),
});
export type SecurityRolesBulkPutOutput = z.infer<
	typeof SecurityRolesBulkPutOutputSchema
>;

export const SecurityRolesBulkDeleteInputSchema = z.strictObject({
	names: z.array(NonBlankString).min(1),
	refresh: RefreshParam.optional(),
});
export type SecurityRolesBulkDeleteInput = z.input<
	typeof SecurityRolesBulkDeleteInputSchema
>;

export const SecurityRolesBulkDeleteOutputSchema = z.looseObject({
	deleted: z.array(z.string()).optional(),
	not_found: z.array(z.string()).optional(),
	errors: SecurityRoleErrorsSchema.optional(),
});
export type SecurityRolesBulkDeleteOutput = z.infer<
	typeof SecurityRolesBulkDeleteOutputSchema
>;

export const SecurityRolesClearCacheInputSchema = z.strictObject({
	// Comma-separated role names, or `*` for all roles.
	name: NonBlankString,
});
export type SecurityRolesClearCacheInput = z.input<
	typeof SecurityRolesClearCacheInputSchema
>;
export type SecurityRolesClearCacheOutput = SecurityCacheClearResponse;

export const SecurityRolesQueryInputSchema = z.strictObject({
	query: QuerySchema.optional(),
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(0).max(10_000).optional(),
});
export type SecurityRolesQueryInput = z.input<
	typeof SecurityRolesQueryInputSchema
>;

// Role hit items are the full descriptor tree, so they stay loose.
export const SecurityRolesQueryOutputSchema = z.looseObject({
	total: z.number().optional(),
	count: z.number().optional(),
	roles: z.array(z.looseObject({})).default([]),
});
export type SecurityRolesQueryOutput = z.infer<
	typeof SecurityRolesQueryOutputSchema
>;

// ── security.roleMappings: /_security/role_mapping ───────────────────────────

// Mapping rules are a recursive any/all/field decision tree, so only the
// envelope is typed.
const SecurityRoleMappingSchema = z.looseObject({
	enabled: z.boolean(),
	roles: z.array(z.string()).optional(),
	role_templates: z.array(z.looseObject({})).optional(),
	rules: z.looseObject({}),
	metadata: SecurityMetadata.optional(),
});
export type SecurityRoleMapping = z.infer<typeof SecurityRoleMappingSchema>;

export const SecurityRoleMappingsGetInputSchema = z.strictObject({
	name: NonBlankString,
});
export type SecurityRoleMappingsGetInput = z.input<
	typeof SecurityRoleMappingsGetInputSchema
>;

export const SecurityRoleMappingsGetOutputSchema = z.record(
	z.string().min(1),
	SecurityRoleMappingSchema,
);
export type SecurityRoleMappingsGetOutput = z.infer<
	typeof SecurityRoleMappingsGetOutputSchema
>;

// A mapping grants either static roles or mustache role_templates (exactly
// one); role_templates stay loose because each entry is a template object.
const SecurityRoleMappingBodySchema = z
	.strictObject({
		enabled: z.boolean().optional(),
		roles: z.array(NonBlankString).min(1).optional(),
		role_templates: z.array(z.looseObject({})).min(1).optional(),
		rules: z.looseObject({}),
		metadata: SecurityMetadata.optional(),
	})
	.refine(
		(mapping) =>
			(mapping.roles !== undefined) !== (mapping.role_templates !== undefined),
		{ message: 'provide exactly one of roles or role_templates' },
	);

export const SecurityRoleMappingsPutInputSchema = z.strictObject({
	name: NonBlankString,
	mapping: SecurityRoleMappingBodySchema,
	refresh: RefreshParam.optional(),
});
export type SecurityRoleMappingsPutInput = z.input<
	typeof SecurityRoleMappingsPutInputSchema
>;
export type SecurityRoleMappingsPutOutput = SecurityCreatedResponse;

export const SecurityRoleMappingsDeleteInputSchema = z.strictObject({
	name: NonBlankString,
	refresh: RefreshParam.optional(),
});
export type SecurityRoleMappingsDeleteInput = z.input<
	typeof SecurityRoleMappingsDeleteInputSchema
>;
export type SecurityRoleMappingsDeleteOutput = SecurityFoundResponse;

// ── security.privileges: /_security/privilege ────────────────────────────────

// Application privileges are a two-level map (application -> privilege name
// -> definition); each definition carries non-empty actions and metadata.
const SecurityApplicationPrivilegeDefinitionSchema = z.strictObject({
	actions: z.array(NonBlankString).min(1),
	metadata: SecurityMetadata.optional(),
});

export const SecurityPrivilegesPutInputSchema = z.strictObject({
	privileges: z.record(
		z.string().min(1),
		z.record(z.string().min(1), SecurityApplicationPrivilegeDefinitionSchema),
	),
	refresh: RefreshParam.optional(),
});
export type SecurityPrivilegesPutInput = z.input<
	typeof SecurityPrivilegesPutInputSchema
>;

export const SecurityPrivilegesPutOutputSchema = z.record(
	z.string().min(1),
	z.record(
		z.string().min(1),
		z.looseObject({
			created: z.boolean(),
		}),
	),
);
export type SecurityPrivilegesPutOutput = z.infer<
	typeof SecurityPrivilegesPutOutputSchema
>;

export const SecurityPrivilegesGetBuiltinInputSchema = z.object({});
export type SecurityPrivilegesGetBuiltinInput = z.infer<
	typeof SecurityPrivilegesGetBuiltinInputSchema
>;

export const SecurityPrivilegesGetBuiltinOutputSchema = z.looseObject({
	cluster: z.array(z.string()),
	index: z.array(z.string()),
	remote_cluster: z.array(z.string()),
});
export type SecurityPrivilegesGetBuiltinOutput = z.infer<
	typeof SecurityPrivilegesGetBuiltinOutputSchema
>;

export const SecurityPrivilegesGetInputSchema = z.strictObject({
	application: NonBlankString,
	name: NonBlankString,
});
export type SecurityPrivilegesGetInput = z.input<
	typeof SecurityPrivilegesGetInputSchema
>;
export type SecurityPrivilegesGetOutput = SecurityPrivilegesPutOutput;

// ── registry ─────────────────────────────────────────────────────────────────

export type ElasticsearchEndpointInputs = {
	clusterGetHealth: ClusterGetHealthInput;
	indicesList: IndicesListInput;
	indicesGet: IndicesGetInput;
	searchRun: SearchRunInput;
	documentsGet: DocumentsGetInput;
	documentsExists: DocumentsExistsInput;
	documentsIndex: DocumentsIndexInput;
	documentsCreate: DocumentsCreateInput;
	documentsUpdate: DocumentsUpdateInput;
	documentsDelete: DocumentsDeleteInput;
	documentsUpdateByQuery: DocumentsUpdateByQueryInput;
	documentsDeleteByQuery: DocumentsDeleteByQueryInput;
	documentsMget: DocumentsMgetInput;
	documentsGetSource: DocumentsGetSourceInput;
	documentsExistsSource: DocumentsExistsSourceInput;
	documentsExplain: DocumentsExplainInput;
	documentsTermvectors: DocumentsTermvectorsInput;
	documentsMtermvectors: DocumentsMtermvectorsInput;
	documentsBulk: DocumentsBulkInput;
	indicesCreate: IndicesCreateInput;
	indicesExists: IndicesExistsInput;
	indicesDelete: IndicesDeleteInput;
	indicesOpen: IndicesOpenInput;
	indicesClose: IndicesCloseInput;
	indicesAddBlock: IndicesAddBlockInput;
	indicesRemoveBlock: IndicesRemoveBlockInput;
	indicesGetMapping: IndicesGetMappingInput;
	indicesPutMapping: IndicesPutMappingInput;
	indicesGetFieldMapping: IndicesGetFieldMappingInput;
	indicesGetSettings: IndicesGetSettingsInput;
	indicesPutSettings: IndicesPutSettingsInput;
	indicesGetAlias: IndicesGetAliasInput;
	indicesExistsAlias: IndicesExistsAliasInput;
	indicesPutAlias: IndicesPutAliasInput;
	indicesDeleteAlias: IndicesDeleteAliasInput;
	indicesRollover: IndicesRolloverInput;
	indicesClone: IndicesCloneInput;
	indicesSplit: IndicesSplitInput;
	indicesShrink: IndicesShrinkInput;
	indicesDownsample: IndicesDownsampleInput;
	indicesAnalyze: IndicesAnalyzeInput;
	indicesStats: IndicesStatsInput;
	indicesSegments: IndicesSegmentsInput;
	indicesRecovery: IndicesRecoveryInput;
	indicesShardStores: IndicesShardStoresInput;
	indicesRefresh: IndicesRefreshInput;
	indicesFlush: IndicesFlushInput;
	indicesForceMerge: IndicesForceMergeInput;
	indicesCacheClear: IndicesCacheClearInput;
	indicesReloadSearchAnalyzers: IndicesReloadSearchAnalyzersInput;
	indicesDiskUsage: IndicesDiskUsageInput;
	indicesFieldUsageStats: IndicesFieldUsageStatsInput;
	indicesDeprecations: IndicesDeprecationsInput;
	indicesExplainDataLifecycle: IndicesExplainDataLifecycleInput;
	indicesIlmExplain: IndicesIlmExplainInput;
	indicesIlmRemove: IndicesIlmRemoveInput;
	indicesIlmRetry: IndicesIlmRetryInput;
	indicesClearSearchableSnapshotCache: IndicesClearSearchableSnapshotCacheInput;
	indicesSearchableSnapshotStats: IndicesSearchableSnapshotStatsInput;
	searchCount: SearchCountInput;
	searchMsearch: SearchMsearchInput;
	searchMsearchTemplate: SearchMsearchTemplateInput;
	searchTemplate: SearchTemplateInput;
	searchTermsEnum: SearchTermsEnumInput;
	searchFieldCaps: SearchFieldCapsInput;
	searchShards: SearchShardsInput;
	searchOpenPointInTime: SearchOpenPointInTimeInput;
	searchRankEval: SearchRankEvalInput;
	searchVectorTile: SearchVectorTileInput;
	searchEql: SearchEqlInput;
	searchAsyncSubmit: SearchAsyncSubmitInput;
	searchAsyncGet: SearchAsyncGetInput;
	searchAsyncStatus: SearchAsyncStatusInput;
	searchAsyncDelete: SearchAsyncDeleteInput;
	searchClosePointInTime: SearchClosePointInTimeInput;
	indicesResolveIndex: IndicesResolveIndexInput;
	clusterResolveCluster: ClusterResolveClusterInput;
	searchGraphExplore: SearchGraphExploreInput;
	searchValidateQuery: SearchValidateQueryInput;
	fleetSearch: FleetSearchInput;
	fleetMsearch: FleetMsearchInput;
	fleetGlobalCheckpoints: FleetGlobalCheckpointsInput;
	ccrFollow: CcrFollowInput;
	ccrFollowInfo: CcrFollowInfoInput;
	ccrFollowStats: CcrFollowStatsInput;
	ccrForgetFollower: CcrForgetFollowerInput;
	ccrPauseFollow: CcrIndexInput;
	ccrResumeFollow: CcrIndexInput;
	ccrUnfollow: CcrIndexInput;
	clusterPing: ClusterPingInput;
	clusterGetInfo: ClusterGetInfoInput;
	clusterSubsystemInfo: ClusterSubsystemInfoInput;
	clusterPendingTasks: ClusterPendingTasksInput;
	clusterGetSettings: ClusterGetSettingsInput;
	clusterPutSettings: ClusterPutSettingsInput;
	clusterReroute: ClusterRerouteInput;
	clusterAllocationExplain: ClusterAllocationExplainInput;
	clusterGetState: ClusterGetStateInput;
	clusterGetStats: ClusterGetStatsInput;
	clusterAddVotingConfigExclusions: ClusterAddVotingConfigExclusionsInput;
	clusterClearVotingConfigExclusions: ClusterClearVotingConfigExclusionsInput;
	clusterRemoteInfo: ClusterRemoteInfoInput;
	clusterHealthReport: ClusterHealthReportInput;
	clusterSslCertificates: ClusterSslCertificatesInput;
	clusterScriptContexts: ClusterScriptContextsInput;
	clusterScriptLanguages: ClusterScriptLanguagesInput;
	catHelp: CatHelpInput;
	catAliases: CatAliasesInput;
	catAllocation: CatAllocationInput;
	catCircuitBreakers: CatCircuitBreakersInput;
	catComponentTemplates: CatComponentTemplatesInput;
	catCount: CatCountInput;
	catFielddata: CatFielddataInput;
	catHealth: CatHealthInput;
	catMaster: CatMasterInput;
	catMlJobs: CatMlJobsInput;
	catMlDataFrameAnalytics: CatMlDataFrameAnalyticsInput;
	catMlDatafeeds: CatMlDatafeedsInput;
	catMlTrainedModels: CatMlTrainedModelsInput;
	catNodeattrs: CatNodeattrsInput;
	catNodes: CatNodesInput;
	catPendingTasks: CatPendingTasksInput;
	catPlugins: CatPluginsInput;
	catRecovery: CatRecoveryInput;
	catRepositories: CatRepositoriesInput;
	catSegments: CatSegmentsInput;
	catShards: CatShardsInput;
	catSnapshots: CatSnapshotsInput;
	catTasks: CatTasksInput;
	catTemplates: CatTemplatesInput;
	catThreadPool: CatThreadPoolInput;
	catTransforms: CatTransformsInput;
	nodesInfo: NodesInfoInput;
	nodesStats: NodesStatsInput;
	nodesUsage: NodesUsageInput;
	nodesHotThreads: NodesHotThreadsInput;
	nodesReloadSecureSettings: NodesReloadSecureSettingsInput;
	nodesRepositoriesMetering: NodesRepositoriesMeteringInput;
	nodesClearRepositoriesMetering: NodesClearRepositoriesMeteringInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCancel: TasksCancelInput;
	securityApiKeysGet: SecurityApiKeysGetInput;
	securityApiKeysCreate: SecurityApiKeysCreateInput;
	securityApiKeysInvalidate: SecurityApiKeysInvalidateInput;
	securityApiKeysBulkUpdate: SecurityApiKeysBulkUpdateInput;
	securityApiKeysClone: SecurityApiKeysCloneInput;
	securityApiKeysGrant: SecurityApiKeysGrantInput;
	securityApiKeysClearCache: SecurityApiKeysClearCacheInput;
	securityApiKeysUpdate: SecurityApiKeysUpdateInput;
	securityApiKeysQuery: SecurityApiKeysQueryInput;
	securityCrossClusterApiKeysCreate: SecurityCrossClusterApiKeysCreateInput;
	securityCrossClusterApiKeysUpdate: SecurityCrossClusterApiKeysUpdateInput;
	securityAuthenticate: SecurityAuthenticateInput;
	securityUsersGet: SecurityUsersGetInput;
	securityUsersPut: SecurityUsersPutInput;
	securityUsersDelete: SecurityUsersDeleteInput;
	securityUsersDisable: SecurityUsersDisableInput;
	securityUsersEnable: SecurityUsersEnableInput;
	securityUsersChangePassword: SecurityUsersChangePasswordInput;
	securityUsersQuery: SecurityUsersQueryInput;
	securityHasPrivileges: SecurityHasPrivilegesInput;
	securityGetUserPrivileges: SecurityGetUserPrivilegesInput;
	securityRolesGet: SecurityRolesGetInput;
	securityRolesPut: SecurityRolesPutInput;
	securityRolesDelete: SecurityRolesDeleteInput;
	securityRolesBulkPut: SecurityRolesBulkPutInput;
	securityRolesBulkDelete: SecurityRolesBulkDeleteInput;
	securityRolesClearCache: SecurityRolesClearCacheInput;
	securityRolesQuery: SecurityRolesQueryInput;
	securityRoleMappingsGet: SecurityRoleMappingsGetInput;
	securityRoleMappingsPut: SecurityRoleMappingsPutInput;
	securityRoleMappingsDelete: SecurityRoleMappingsDeleteInput;
	securityPrivilegesPut: SecurityPrivilegesPutInput;
	securityPrivilegesGetBuiltin: SecurityPrivilegesGetBuiltinInput;
	securityPrivilegesGet: SecurityPrivilegesGetInput;
};

export type ElasticsearchEndpointOutputs = {
	clusterGetHealth: ClusterGetHealthResponse;
	indicesList: IndicesListResponse;
	indicesGet: IndicesGetResponse;
	searchRun: SearchRunResponse;
	documentsGet: DocumentsGetResponse;
	documentsExists: DocumentsExistsOutput;
	documentsIndex: DocumentsIndexOutput;
	documentsCreate: DocumentsCreateOutput;
	documentsUpdate: DocumentsUpdateOutput;
	documentsDelete: DocumentsDeleteOutput;
	documentsUpdateByQuery: DocumentsUpdateByQueryOutput;
	documentsDeleteByQuery: DocumentsDeleteByQueryOutput;
	documentsMget: DocumentsMgetOutput;
	documentsGetSource: DocumentsGetSourceOutput;
	documentsExistsSource: DocumentsExistsSourceOutput;
	documentsExplain: DocumentsExplainOutput;
	documentsTermvectors: TermVectorsResult;
	documentsMtermvectors: DocumentsMtermvectorsOutput;
	documentsBulk: DocumentsBulkOutput;
	indicesCreate: IndicesCreateOutput;
	indicesExists: IndicesExistsOutput;
	indicesDelete: IndicesDeleteOutput;
	indicesOpen: IndicesOpenOutput;
	indicesClose: IndicesCloseOutput;
	indicesAddBlock: IndicesAddBlockOutput;
	indicesRemoveBlock: IndicesRemoveBlockOutput;
	indicesGetMapping: IndicesGetMappingOutput;
	indicesPutMapping: IndicesPutMappingOutput;
	indicesGetFieldMapping: IndicesGetFieldMappingOutput;
	indicesGetSettings: IndicesGetSettingsOutput;
	indicesPutSettings: IndicesPutSettingsOutput;
	indicesGetAlias: IndicesGetAliasOutput;
	indicesExistsAlias: IndicesExistsAliasOutput;
	indicesPutAlias: IndicesPutAliasOutput;
	indicesDeleteAlias: IndicesDeleteAliasOutput;
	indicesRollover: IndicesRolloverOutput;
	indicesClone: IndicesResizeOutput;
	indicesSplit: IndicesResizeOutput;
	indicesShrink: IndicesResizeOutput;
	indicesDownsample: IndicesDownsampleOutput;
	indicesAnalyze: IndicesAnalyzeOutput;
	indicesStats: IndicesStatsOutput;
	indicesSegments: IndicesSegmentsOutput;
	indicesRecovery: IndicesRecoveryOutput;
	indicesShardStores: IndicesShardStoresOutput;
	indicesRefresh: IndicesRefreshOutput;
	indicesFlush: IndicesFlushOutput;
	indicesForceMerge: IndicesForceMergeOutput;
	indicesCacheClear: IndicesCacheClearOutput;
	indicesReloadSearchAnalyzers: IndicesReloadSearchAnalyzersOutput;
	indicesDiskUsage: IndicesDiskUsageOutput;
	indicesFieldUsageStats: IndicesFieldUsageStatsOutput;
	indicesDeprecations: IndicesDeprecationsOutput;
	indicesExplainDataLifecycle: LifecycleIndices;
	indicesIlmExplain: LifecycleIndices;
	indicesIlmRemove: IndicesIlmRemoveOutput;
	indicesIlmRetry: IndicesIlmRetryOutput;
	indicesClearSearchableSnapshotCache: IndicesClearSearchableSnapshotCacheOutput;
	indicesSearchableSnapshotStats: IndicesSearchableSnapshotStatsOutput;
	searchCount: SearchCountOutput;
	searchMsearch: MultiSearchResult;
	searchMsearchTemplate: SearchMsearchTemplateOutput;
	searchTemplate: SearchTemplateOutput;
	searchTermsEnum: SearchTermsEnumOutput;
	searchFieldCaps: SearchFieldCapsOutput;
	searchShards: SearchShardsOutput;
	searchOpenPointInTime: SearchOpenPointInTimeOutput;
	searchRankEval: SearchRankEvalOutput;
	searchVectorTile: SearchVectorTileOutput;
	searchEql: SearchEqlOutput;
	searchAsyncSubmit: SearchAsyncSubmitOutput;
	searchAsyncGet: SearchAsyncGetOutput;
	searchAsyncStatus: SearchAsyncStatusOutput;
	searchAsyncDelete: SearchAsyncDeleteOutput;
	searchClosePointInTime: SearchClosePointInTimeOutput;
	indicesResolveIndex: IndicesResolveIndexOutput;
	clusterResolveCluster: ClusterResolveClusterOutput;
	searchGraphExplore: SearchGraphExploreOutput;
	searchValidateQuery: SearchValidateQueryOutput;
	fleetSearch: FleetSearchOutput;
	fleetMsearch: FleetMsearchOutput;
	fleetGlobalCheckpoints: FleetGlobalCheckpointsOutput;
	ccrFollow: CcrFollowOutput;
	ccrFollowInfo: CcrFollowInfoOutput;
	ccrFollowStats: CcrFollowStatsOutput;
	ccrForgetFollower: CcrForgetFollowerOutput;
	ccrPauseFollow: CcrAcknowledgedOutput;
	ccrResumeFollow: CcrAcknowledgedOutput;
	ccrUnfollow: CcrAcknowledgedOutput;
	clusterPing: ClusterPingOutput;
	clusterGetInfo: ClusterGetInfoResponse;
	clusterSubsystemInfo: ClusterSubsystemInfoOutput;
	clusterPendingTasks: ClusterPendingTasksOutput;
	clusterGetSettings: ClusterGetSettingsOutput;
	clusterPutSettings: ClusterPutSettingsOutput;
	clusterReroute: ClusterRerouteOutput;
	clusterAllocationExplain: ClusterAllocationExplainOutput;
	clusterGetState: ClusterGetStateOutput;
	clusterGetStats: ClusterGetStatsOutput;
	clusterAddVotingConfigExclusions: ClusterVotingConfigExclusionsOutput;
	clusterClearVotingConfigExclusions: ClusterVotingConfigExclusionsOutput;
	clusterRemoteInfo: ClusterRemoteInfoOutput;
	clusterHealthReport: ClusterHealthReportOutput;
	clusterSslCertificates: ClusterSslCertificatesOutput;
	clusterScriptContexts: ClusterScriptContextsOutput;
	clusterScriptLanguages: ClusterScriptLanguagesOutput;
	catHelp: CatHelpResponse;
	catAliases: CatAliasesOutput;
	catAllocation: CatAllocationOutput;
	catCircuitBreakers: CatCircuitBreakersOutput;
	catComponentTemplates: CatComponentTemplatesOutput;
	catCount: CatCountOutput;
	catFielddata: CatFielddataOutput;
	catHealth: CatHealthOutput;
	catMaster: CatMasterOutput;
	catMlJobs: CatMlJobsOutput;
	catMlDataFrameAnalytics: CatMlDataFrameAnalyticsOutput;
	catMlDatafeeds: CatMlDatafeedsOutput;
	catMlTrainedModels: CatMlTrainedModelsOutput;
	catNodeattrs: CatNodeattrsOutput;
	catNodes: CatNodesOutput;
	catPendingTasks: CatPendingTasksOutput;
	catPlugins: CatPluginsOutput;
	catRecovery: CatRecoveryOutput;
	catRepositories: CatRepositoriesOutput;
	catSegments: CatSegmentsOutput;
	catShards: CatShardsOutput;
	catSnapshots: CatSnapshotsOutput;
	catTasks: CatTasksOutput;
	catTemplates: CatTemplatesOutput;
	catThreadPool: CatThreadPoolOutput;
	catTransforms: CatTransformsOutput;
	nodesInfo: NodesInfoOutput;
	nodesStats: NodesStatsOutput;
	nodesUsage: NodesUsageOutput;
	nodesHotThreads: NodesHotThreadsOutput;
	nodesReloadSecureSettings: NodesReloadSecureSettingsOutput;
	nodesRepositoriesMetering: NodesRepositoriesMeteringOutput;
	nodesClearRepositoriesMetering: NodesClearRepositoriesMeteringOutput;
	tasksList: TasksListOutput;
	tasksGet: TasksGetOutput;
	tasksCancel: TasksCancelOutput;
	securityApiKeysGet: SecurityApiKeysGetOutput;
	securityApiKeysCreate: SecurityApiKeysCreateOutput;
	securityApiKeysInvalidate: SecurityApiKeysInvalidateOutput;
	securityApiKeysBulkUpdate: SecurityApiKeysBulkUpdateOutput;
	securityApiKeysClone: SecurityApiKeysCloneOutput;
	securityApiKeysGrant: SecurityApiKeysGrantOutput;
	securityApiKeysClearCache: SecurityApiKeysClearCacheOutput;
	securityApiKeysUpdate: SecurityApiKeysUpdateOutput;
	securityApiKeysQuery: SecurityApiKeysQueryOutput;
	securityCrossClusterApiKeysCreate: SecurityCrossClusterApiKeysCreateOutput;
	securityCrossClusterApiKeysUpdate: SecurityCrossClusterApiKeysUpdateOutput;
	securityAuthenticate: SecurityAuthenticateOutput;
	securityUsersGet: SecurityUsersGetOutput;
	securityUsersPut: SecurityCreatedResponse;
	securityUsersDelete: SecurityUsersDeleteOutput;
	securityUsersDisable: SecurityUsersDisableOutput;
	securityUsersEnable: SecurityUsersEnableOutput;
	securityUsersChangePassword: SecurityUsersChangePasswordOutput;
	securityUsersQuery: SecurityUsersQueryOutput;
	securityHasPrivileges: SecurityHasPrivilegesOutput;
	securityGetUserPrivileges: SecurityGetUserPrivilegesOutput;
	securityRolesGet: SecurityRolesGetOutput;
	securityRolesPut: SecurityRolesPutOutput;
	securityRolesDelete: SecurityRolesDeleteOutput;
	securityRolesBulkPut: SecurityRolesBulkPutOutput;
	securityRolesBulkDelete: SecurityRolesBulkDeleteOutput;
	securityRolesClearCache: SecurityRolesClearCacheOutput;
	securityRolesQuery: SecurityRolesQueryOutput;
	securityRoleMappingsGet: SecurityRoleMappingsGetOutput;
	securityRoleMappingsPut: SecurityRoleMappingsPutOutput;
	securityRoleMappingsDelete: SecurityRoleMappingsDeleteOutput;
	securityPrivilegesPut: SecurityPrivilegesPutOutput;
	securityPrivilegesGetBuiltin: SecurityPrivilegesGetBuiltinOutput;
	securityPrivilegesGet: SecurityPrivilegesGetOutput;
};

// ── search.asyncGet / asyncStatus / asyncDelete, closePointInTime ────────────

export const SearchAsyncGetInputSchema = z.strictObject({
	id: NonBlankString,
	keep_alive: NonBlankString.optional(),
	typed_keys: z.boolean().optional(),
	wait_for_completion_timeout: NonBlankString.optional(),
	return_intermediate_results: z.boolean().optional(),
});
export type SearchAsyncGetInput = z.input<typeof SearchAsyncGetInputSchema>;
export const SearchAsyncGetOutputSchema = SearchAsyncSubmitOutputSchema;
export type SearchAsyncGetOutput = SearchAsyncSubmitOutput;

export const SearchAsyncStatusInputSchema = z.strictObject({
	id: NonBlankString,
	keep_alive: NonBlankString.optional(),
});
export type SearchAsyncStatusInput = z.input<
	typeof SearchAsyncStatusInputSchema
>;
export const SearchAsyncStatusOutputSchema = z.looseObject({
	id: z.string().optional(),
	is_running: z.boolean(),
	is_partial: z.boolean(),
	start_time_in_millis: z.number(),
	expiration_time_in_millis: z.number(),
});
export type SearchAsyncStatusOutput = z.infer<
	typeof SearchAsyncStatusOutputSchema
>;

export const SearchAsyncDeleteInputSchema = z.strictObject({
	id: NonBlankString,
});
export type SearchAsyncDeleteInput = z.infer<
	typeof SearchAsyncDeleteInputSchema
>;
export const SearchAsyncDeleteOutputSchema = EmptyBodyResponse;
export type SearchAsyncDeleteOutput = z.infer<
	typeof SearchAsyncDeleteOutputSchema
>;

export const SearchClosePointInTimeInputSchema = z.strictObject({
	id: NonBlankString,
});
export type SearchClosePointInTimeInput = z.infer<
	typeof SearchClosePointInTimeInputSchema
>;
export const SearchClosePointInTimeOutputSchema = z.looseObject({
	succeeded: z.boolean(),
	num_freed: z.number().optional(),
});
export type SearchClosePointInTimeOutput = z.infer<
	typeof SearchClosePointInTimeOutputSchema
>;

// ── indices.resolveIndex / cluster.resolveCluster ────────────────────────────

export const IndicesResolveIndexInputSchema = z.strictObject({
	name: NonBlankString.describe('Index, alias, or data stream name pattern'),
});
export type IndicesResolveIndexInput = z.infer<
	typeof IndicesResolveIndexInputSchema
>;
export const IndicesResolveIndexOutputSchema = z.looseObject({
	indices: z.array(z.looseObject({})).default([]),
	aliases: z.array(z.looseObject({})).default([]),
	data_streams: z.array(z.looseObject({})).default([]),
});
export type IndicesResolveIndexOutput = z.infer<
	typeof IndicesResolveIndexOutputSchema
>;

export const ClusterResolveClusterInputSchema = z.strictObject({
	name: NonBlankString,
});
export type ClusterResolveClusterInput = z.infer<
	typeof ClusterResolveClusterInputSchema
>;
export const ClusterResolveClusterOutputSchema = z.looseObject({
	name: z.string().optional(),
	connected: z.boolean().optional(),
});
export type ClusterResolveClusterOutput = z.infer<
	typeof ClusterResolveClusterOutputSchema
>;

export type ElasticsearchOperation = keyof ElasticsearchEndpointInputs;

export const ElasticsearchEndpointInputSchemas = {
	clusterGetHealth: ClusterGetHealthInputSchema,
	indicesList: IndicesListInputSchema,
	indicesGet: IndicesGetInputSchema,
	searchRun: SearchRunInputSchema,
	documentsGet: DocumentsGetInputSchema,
	documentsExists: DocumentsExistsInputSchema,
	documentsIndex: DocumentsIndexInputSchema,
	documentsCreate: DocumentsCreateInputSchema,
	documentsUpdate: DocumentsUpdateInputSchema,
	documentsDelete: DocumentsDeleteInputSchema,
	documentsUpdateByQuery: DocumentsUpdateByQueryInputSchema,
	documentsDeleteByQuery: DocumentsDeleteByQueryInputSchema,
	documentsMget: DocumentsMgetInputSchema,
	documentsGetSource: DocumentsGetSourceInputSchema,
	documentsExistsSource: DocumentsExistsSourceInputSchema,
	documentsExplain: DocumentsExplainInputSchema,
	documentsTermvectors: DocumentsTermvectorsInputSchema,
	documentsMtermvectors: DocumentsMtermvectorsInputSchema,
	documentsBulk: DocumentsBulkInputSchema,
	indicesCreate: IndicesCreateInputSchema,
	indicesExists: IndicesExistsInputSchema,
	indicesDelete: IndicesDeleteInputSchema,
	indicesOpen: IndicesOpenInputSchema,
	indicesClose: IndicesCloseInputSchema,
	indicesAddBlock: IndicesAddBlockInputSchema,
	indicesRemoveBlock: IndicesRemoveBlockInputSchema,
	indicesGetMapping: IndicesGetMappingInputSchema,
	indicesPutMapping: IndicesPutMappingInputSchema,
	indicesGetFieldMapping: IndicesGetFieldMappingInputSchema,
	indicesGetSettings: IndicesGetSettingsInputSchema,
	indicesPutSettings: IndicesPutSettingsInputSchema,
	indicesGetAlias: IndicesGetAliasInputSchema,
	indicesExistsAlias: IndicesExistsAliasInputSchema,
	indicesPutAlias: IndicesPutAliasInputSchema,
	indicesDeleteAlias: IndicesDeleteAliasInputSchema,
	indicesRollover: IndicesRolloverInputSchema,
	indicesClone: IndicesCloneInputSchema,
	indicesSplit: IndicesSplitInputSchema,
	indicesShrink: IndicesShrinkInputSchema,
	indicesDownsample: IndicesDownsampleInputSchema,
	indicesAnalyze: IndicesAnalyzeInputSchema,
	indicesStats: IndicesStatsInputSchema,
	indicesSegments: IndicesSegmentsInputSchema,
	indicesRecovery: IndicesRecoveryInputSchema,
	indicesShardStores: IndicesShardStoresInputSchema,
	indicesRefresh: IndicesRefreshInputSchema,
	indicesFlush: IndicesFlushInputSchema,
	indicesForceMerge: IndicesForceMergeInputSchema,
	indicesCacheClear: IndicesCacheClearInputSchema,
	indicesReloadSearchAnalyzers: IndicesReloadSearchAnalyzersInputSchema,
	indicesDiskUsage: IndicesDiskUsageInputSchema,
	indicesFieldUsageStats: IndicesFieldUsageStatsInputSchema,
	indicesDeprecations: IndicesDeprecationsInputSchema,
	indicesExplainDataLifecycle: IndicesExplainDataLifecycleInputSchema,
	indicesIlmExplain: IndicesIlmExplainInputSchema,
	indicesIlmRemove: IndicesIlmRemoveInputSchema,
	indicesIlmRetry: IndicesIlmRetryInputSchema,
	indicesClearSearchableSnapshotCache:
		IndicesClearSearchableSnapshotCacheInputSchema,
	indicesSearchableSnapshotStats: IndicesSearchableSnapshotStatsInputSchema,
	searchCount: SearchCountInputSchema,
	searchMsearch: SearchMsearchInputSchema,
	searchMsearchTemplate: SearchMsearchTemplateInputSchema,
	searchTemplate: SearchTemplateInputSchema,
	searchTermsEnum: SearchTermsEnumInputSchema,
	searchFieldCaps: SearchFieldCapsInputSchema,
	searchShards: SearchShardsInputSchema,
	searchOpenPointInTime: SearchOpenPointInTimeInputSchema,
	searchRankEval: SearchRankEvalInputSchema,
	searchVectorTile: SearchVectorTileInputSchema,
	searchEql: SearchEqlInputSchema,
	searchAsyncSubmit: SearchAsyncSubmitInputSchema,
	searchGraphExplore: SearchGraphExploreInputSchema,
	searchValidateQuery: SearchValidateQueryInputSchema,
	fleetSearch: FleetSearchInputSchema,
	fleetMsearch: FleetMsearchInputSchema,
	fleetGlobalCheckpoints: FleetGlobalCheckpointsInputSchema,
	ccrFollow: CcrFollowInputSchema,
	ccrFollowInfo: CcrFollowInfoInputSchema,
	ccrFollowStats: CcrFollowStatsInputSchema,
	ccrForgetFollower: CcrForgetFollowerInputSchema,
	ccrPauseFollow: CcrIndexInputSchema,
	ccrResumeFollow: CcrIndexInputSchema,
	ccrUnfollow: CcrIndexInputSchema,
	clusterPing: ClusterPingInputSchema,
	clusterGetInfo: ClusterGetInfoInputSchema,
	clusterSubsystemInfo: ClusterSubsystemInfoInputSchema,
	clusterPendingTasks: ClusterPendingTasksInputSchema,
	clusterGetSettings: ClusterGetSettingsInputSchema,
	clusterPutSettings: ClusterPutSettingsInputSchema,
	clusterReroute: ClusterRerouteInputSchema,
	clusterAllocationExplain: ClusterAllocationExplainInputSchema,
	clusterGetState: ClusterGetStateInputSchema,
	clusterGetStats: ClusterGetStatsInputSchema,
	clusterAddVotingConfigExclusions: ClusterAddVotingConfigExclusionsInputSchema,
	clusterClearVotingConfigExclusions:
		ClusterClearVotingConfigExclusionsInputSchema,
	clusterRemoteInfo: ClusterRemoteInfoInputSchema,
	clusterHealthReport: ClusterHealthReportInputSchema,
	clusterSslCertificates: ClusterSslCertificatesInputSchema,
	clusterScriptContexts: ClusterScriptContextsInputSchema,
	clusterScriptLanguages: ClusterScriptLanguagesInputSchema,
	catHelp: CatHelpInputSchema,
	catAliases: CatAliasesInputSchema,
	catAllocation: CatAllocationInputSchema,
	catCircuitBreakers: CatCircuitBreakersInputSchema,
	catComponentTemplates: CatComponentTemplatesInputSchema,
	catCount: CatCountInputSchema,
	catFielddata: CatFielddataInputSchema,
	catHealth: CatHealthInputSchema,
	catMaster: CatMasterInputSchema,
	catMlJobs: CatMlJobsInputSchema,
	catMlDataFrameAnalytics: CatMlDataFrameAnalyticsInputSchema,
	catMlDatafeeds: CatMlDatafeedsInputSchema,
	catMlTrainedModels: CatMlTrainedModelsInputSchema,
	catNodeattrs: CatNodeattrsInputSchema,
	catNodes: CatNodesInputSchema,
	catPendingTasks: CatPendingTasksInputSchema,
	catPlugins: CatPluginsInputSchema,
	catRecovery: CatRecoveryInputSchema,
	catRepositories: CatRepositoriesInputSchema,
	catSegments: CatSegmentsInputSchema,
	catShards: CatShardsInputSchema,
	catSnapshots: CatSnapshotsInputSchema,
	catTasks: CatTasksInputSchema,
	catTemplates: CatTemplatesInputSchema,
	catThreadPool: CatThreadPoolInputSchema,
	catTransforms: CatTransformsInputSchema,
	nodesInfo: NodesInfoInputSchema,
	nodesStats: NodesStatsInputSchema,
	nodesUsage: NodesUsageInputSchema,
	nodesHotThreads: NodesHotThreadsInputSchema,
	nodesReloadSecureSettings: NodesReloadSecureSettingsInputSchema,
	nodesRepositoriesMetering: NodesRepositoriesMeteringInputSchema,
	nodesClearRepositoriesMetering: NodesClearRepositoriesMeteringInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCancel: TasksCancelInputSchema,
	securityApiKeysGet: SecurityApiKeysGetInputSchema,
	securityApiKeysCreate: SecurityApiKeysCreateInputSchema,
	securityApiKeysInvalidate: SecurityApiKeysInvalidateInputSchema,
	securityApiKeysBulkUpdate: SecurityApiKeysBulkUpdateInputSchema,
	securityApiKeysClone: SecurityApiKeysCloneInputSchema,
	securityApiKeysGrant: SecurityApiKeysGrantInputSchema,
	securityApiKeysClearCache: SecurityApiKeysClearCacheInputSchema,
	securityApiKeysUpdate: SecurityApiKeysUpdateInputSchema,
	securityApiKeysQuery: SecurityApiKeysQueryInputSchema,
	securityCrossClusterApiKeysCreate:
		SecurityCrossClusterApiKeysCreateInputSchema,
	securityCrossClusterApiKeysUpdate:
		SecurityCrossClusterApiKeysUpdateInputSchema,
	securityAuthenticate: SecurityAuthenticateInputSchema,
	securityUsersGet: SecurityUsersGetInputSchema,
	securityUsersPut: SecurityUsersPutInputSchema,
	securityUsersDelete: SecurityUsersDeleteInputSchema,
	securityUsersDisable: SecurityUsersDisableInputSchema,
	securityUsersEnable: SecurityUsersEnableInputSchema,
	securityUsersChangePassword: SecurityUsersChangePasswordInputSchema,
	securityUsersQuery: SecurityUsersQueryInputSchema,
	securityHasPrivileges: SecurityHasPrivilegesInputSchema,
	securityGetUserPrivileges: SecurityGetUserPrivilegesInputSchema,
	securityRolesGet: SecurityRolesGetInputSchema,
	securityRolesPut: SecurityRolesPutInputSchema,
	securityRolesDelete: SecurityRolesDeleteInputSchema,
	securityRolesBulkPut: SecurityRolesBulkPutInputSchema,
	securityRolesBulkDelete: SecurityRolesBulkDeleteInputSchema,
	securityRolesClearCache: SecurityRolesClearCacheInputSchema,
	securityRolesQuery: SecurityRolesQueryInputSchema,
	securityRoleMappingsGet: SecurityRoleMappingsGetInputSchema,
	securityRoleMappingsPut: SecurityRoleMappingsPutInputSchema,
	securityRoleMappingsDelete: SecurityRoleMappingsDeleteInputSchema,
	securityPrivilegesPut: SecurityPrivilegesPutInputSchema,
	securityPrivilegesGetBuiltin: SecurityPrivilegesGetBuiltinInputSchema,
	securityPrivilegesGet: SecurityPrivilegesGetInputSchema,
	searchAsyncGet: SearchAsyncGetInputSchema,
	searchAsyncStatus: SearchAsyncStatusInputSchema,
	searchAsyncDelete: SearchAsyncDeleteInputSchema,
	searchClosePointInTime: SearchClosePointInTimeInputSchema,
	indicesResolveIndex: IndicesResolveIndexInputSchema,
	clusterResolveCluster: ClusterResolveClusterInputSchema,
} as const;

export const ElasticsearchEndpointOutputSchemas = {
	clusterGetHealth: ClusterGetHealthResponseSchema,
	indicesList: IndicesListResponseSchema,
	indicesGet: IndicesGetResponseSchema,
	searchRun: SearchRunResponseSchema,
	documentsGet: DocumentsGetResponseSchema,
	documentsExists: ExistsResultSchema,
	documentsIndex: WriteResponseSchema,
	documentsCreate: WriteResponseSchema,
	documentsUpdate: DocumentsUpdateOutputSchema,
	documentsDelete: WriteResponseSchema,
	documentsUpdateByQuery: ByScrollResponseSchema,
	documentsDeleteByQuery: ByScrollResponseSchema,
	documentsMget: DocumentsMgetOutputSchema,
	documentsGetSource: DocumentsGetSourceOutputSchema,
	documentsExistsSource: ExistsResultSchema,
	documentsExplain: DocumentsExplainOutputSchema,
	documentsTermvectors: TermVectorsResultSchema,
	documentsMtermvectors: DocumentsMtermvectorsOutputSchema,
	documentsBulk: DocumentsBulkOutputSchema,
	indicesCreate: IndicesCreateOutputSchema,
	indicesExists: ExistsResultSchema,
	indicesDelete: IndicesResponseBaseSchema,
	indicesOpen: IndicesOpenOutputSchema,
	indicesClose: IndicesCloseOutputSchema,
	indicesAddBlock: IndicesAddBlockOutputSchema,
	indicesRemoveBlock: IndicesRemoveBlockOutputSchema,
	indicesGetMapping: IndexKeyedMappingSchema,
	indicesPutMapping: IndicesResponseBaseSchema,
	indicesGetFieldMapping: IndexKeyedMappingSchema,
	indicesGetSettings: IndicesGetSettingsOutputSchema,
	indicesPutSettings: AcknowledgedResponseSchema,
	indicesGetAlias: IndexKeyedAliasesSchema,
	indicesExistsAlias: ExistsResultSchema,
	indicesPutAlias: AcknowledgedResponseSchema,
	indicesDeleteAlias: IndicesDeleteAliasOutputSchema,
	indicesRollover: IndicesRolloverOutputSchema,
	indicesClone: IndicesResizeOutputSchema,
	indicesSplit: IndicesResizeOutputSchema,
	indicesShrink: IndicesResizeOutputSchema,
	indicesDownsample: IndicesDownsampleOutputSchema,
	indicesAnalyze: IndicesAnalyzeOutputSchema,
	indicesStats: IndicesStatsOutputSchema,
	indicesSegments: IndicesSegmentsOutputSchema,
	indicesRecovery: IndicesRecoveryOutputSchema,
	indicesShardStores: IndicesShardStoresOutputSchema,
	indicesRefresh: ShardsOperationResponseSchema,
	indicesFlush: ShardsOperationResponseSchema,
	indicesForceMerge: IndicesForceMergeOutputSchema,
	indicesCacheClear: ShardsOperationResponseSchema,
	indicesReloadSearchAnalyzers: IndicesReloadSearchAnalyzersOutputSchema,
	indicesDiskUsage: IndicesDiskUsageOutputSchema,
	indicesFieldUsageStats: IndicesFieldUsageStatsOutputSchema,
	indicesDeprecations: IndicesDeprecationsOutputSchema,
	indicesExplainDataLifecycle: LifecycleIndicesSchema,
	indicesIlmExplain: LifecycleIndicesSchema,
	indicesIlmRemove: IndicesIlmRemoveOutputSchema,
	indicesIlmRetry: AcknowledgedResponseSchema,
	indicesClearSearchableSnapshotCache: EmptyObjectSchema,
	indicesSearchableSnapshotStats: IndicesSearchableSnapshotStatsOutputSchema,
	searchCount: SearchCountOutputSchema,
	searchMsearch: MultiSearchResultSchema,
	searchMsearchTemplate: MultiSearchResultSchema,
	searchTemplate: SearchRunResponseSchema,
	searchTermsEnum: SearchTermsEnumOutputSchema,
	searchFieldCaps: SearchFieldCapsOutputSchema,
	searchShards: SearchShardsOutputSchema,
	searchOpenPointInTime: SearchOpenPointInTimeOutputSchema,
	searchRankEval: SearchRankEvalOutputSchema,
	searchVectorTile: SearchVectorTileOutputSchema,
	searchEql: SearchEqlOutputSchema,
	searchAsyncSubmit: SearchAsyncSubmitOutputSchema,
	searchGraphExplore: SearchGraphExploreOutputSchema,
	searchValidateQuery: SearchValidateQueryOutputSchema,
	fleetSearch: SearchRunResponseSchema,
	fleetMsearch: MultiSearchResultSchema,
	fleetGlobalCheckpoints: FleetGlobalCheckpointsOutputSchema,
	ccrFollow: CcrFollowOutputSchema,
	ccrFollowInfo: CcrFollowInfoOutputSchema,
	ccrFollowStats: CcrFollowStatsOutputSchema,
	ccrForgetFollower: CcrForgetFollowerOutputSchema,
	ccrPauseFollow: AcknowledgedResponseSchema,
	ccrResumeFollow: AcknowledgedResponseSchema,
	ccrUnfollow: AcknowledgedResponseSchema,
	clusterPing: ExistsResultSchema,
	clusterGetInfo: ClusterGetInfoResponseSchema,
	clusterSubsystemInfo: ClusterSubsystemInfoOutputSchema,
	clusterPendingTasks: ClusterPendingTasksOutputSchema,
	clusterGetSettings: ClusterGetSettingsOutputSchema,
	clusterPutSettings: ClusterPutSettingsOutputSchema,
	clusterReroute: ClusterRerouteOutputSchema,
	clusterAllocationExplain: ClusterAllocationExplainOutputSchema,
	clusterGetState: ClusterGetStateOutputSchema,
	clusterGetStats: ClusterGetStatsOutputSchema,
	clusterAddVotingConfigExclusions: EmptyBodyResponse,
	clusterClearVotingConfigExclusions: EmptyBodyResponse,
	clusterRemoteInfo: ClusterRemoteInfoOutputSchema,
	clusterHealthReport: ClusterHealthReportOutputSchema,
	clusterSslCertificates: ClusterSslCertificatesOutputSchema,
	clusterScriptContexts: ClusterScriptContextsOutputSchema,
	clusterScriptLanguages: ClusterScriptLanguagesOutputSchema,
	catHelp: CatHelpResponseSchema,
	catAliases: CatAliasesResponseSchema,
	catAllocation: CatAllocationResponseSchema,
	catCircuitBreakers: CatCircuitBreakersResponseSchema,
	catComponentTemplates: CatComponentTemplatesResponseSchema,
	catCount: CatCountResponseSchema,
	catFielddata: CatFielddataResponseSchema,
	catHealth: CatHealthResponseSchema,
	catMaster: CatMasterResponseSchema,
	catMlJobs: CatMlJobsResponseSchema,
	catMlDataFrameAnalytics: CatMlDataFrameAnalyticsResponseSchema,
	catMlDatafeeds: CatMlDatafeedsResponseSchema,
	catMlTrainedModels: CatMlTrainedModelsResponseSchema,
	catNodeattrs: CatNodeattrsResponseSchema,
	catNodes: CatNodesResponseSchema,
	catPendingTasks: CatPendingTasksResponseSchema,
	catPlugins: CatPluginsResponseSchema,
	catRecovery: CatRecoveryResponseSchema,
	catRepositories: CatRepositoriesResponseSchema,
	catSegments: CatSegmentsResponseSchema,
	catShards: CatShardsResponseSchema,
	catSnapshots: CatSnapshotsResponseSchema,
	catTasks: CatTasksResponseSchema,
	catTemplates: CatTemplatesResponseSchema,
	catThreadPool: CatThreadPoolResponseSchema,
	catTransforms: CatTransformsResponseSchema,
	nodesInfo: NodesInfoOutputSchema,
	nodesStats: NodesStatsOutputSchema,
	nodesUsage: NodesUsageOutputSchema,
	nodesHotThreads: NodesHotThreadsOutputSchema,
	nodesReloadSecureSettings: NodesReloadSecureSettingsOutputSchema,
	nodesRepositoriesMetering: NodesRepositoriesMeteringOutputSchema,
	nodesClearRepositoriesMetering: NodesClearRepositoriesMeteringOutputSchema,
	tasksList: TaskListResponseSchema,
	tasksGet: TasksGetOutputSchema,
	tasksCancel: TaskListResponseSchema,
	securityApiKeysGet: SecurityApiKeysGetOutputSchema,
	securityApiKeysCreate: SecurityCreatedApiKeySchema,
	securityApiKeysInvalidate: SecurityApiKeysInvalidateOutputSchema,
	securityApiKeysBulkUpdate: SecurityApiKeysBulkUpdateOutputSchema,
	securityApiKeysClone: SecurityCreatedApiKeySchema,
	securityApiKeysGrant: SecurityCreatedApiKeySchema,
	securityApiKeysClearCache: SecurityCacheClearResponseSchema,
	securityApiKeysUpdate: SecurityApiKeysUpdateOutputSchema,
	securityApiKeysQuery: SecurityApiKeysQueryOutputSchema,
	securityCrossClusterApiKeysCreate: SecurityCreatedApiKeySchema,
	securityCrossClusterApiKeysUpdate: SecurityApiKeysUpdateOutputSchema,
	securityAuthenticate: SecurityAuthenticateOutputSchema,
	securityUsersGet: SecurityUsersGetOutputSchema,
	securityUsersPut: SecurityCreatedResponseSchema,
	securityUsersDelete: SecurityFoundResponseSchema,
	securityUsersDisable: SecurityEmptyResponseSchema,
	securityUsersEnable: SecurityEmptyResponseSchema,
	securityUsersChangePassword: SecurityEmptyResponseSchema,
	securityUsersQuery: SecurityUsersQueryOutputSchema,
	securityHasPrivileges: SecurityHasPrivilegesOutputSchema,
	securityGetUserPrivileges: SecurityGetUserPrivilegesOutputSchema,
	securityRolesGet: SecurityRolesGetOutputSchema,
	securityRolesPut: SecurityRolesPutOutputSchema,
	securityRolesDelete: SecurityFoundResponseSchema,
	securityRolesBulkPut: SecurityRolesBulkPutOutputSchema,
	securityRolesBulkDelete: SecurityRolesBulkDeleteOutputSchema,
	securityRolesClearCache: SecurityCacheClearResponseSchema,
	securityRolesQuery: SecurityRolesQueryOutputSchema,
	securityRoleMappingsGet: SecurityRoleMappingsGetOutputSchema,
	securityRoleMappingsPut: SecurityCreatedResponseSchema,
	securityRoleMappingsDelete: SecurityFoundResponseSchema,
	securityPrivilegesPut: SecurityPrivilegesPutOutputSchema,
	securityPrivilegesGetBuiltin: SecurityPrivilegesGetBuiltinOutputSchema,
	securityPrivilegesGet: SecurityPrivilegesPutOutputSchema,
	searchAsyncGet: SearchAsyncGetOutputSchema,
	searchAsyncStatus: SearchAsyncStatusOutputSchema,
	searchAsyncDelete: SearchAsyncDeleteOutputSchema,
	searchClosePointInTime: SearchClosePointInTimeOutputSchema,
	indicesResolveIndex: IndicesResolveIndexOutputSchema,
	clusterResolveCluster: ClusterResolveClusterOutputSchema,
} as const;
