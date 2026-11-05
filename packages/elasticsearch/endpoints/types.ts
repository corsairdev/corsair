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

// ── cluster.getHealth: GET /_cluster/health ──────────────────────────────────

// Cluster-level call (spec default `level=cluster`); no wire body to protect.
export const ClusterGetHealthInputSchema = z.object({});
export type ClusterGetHealthInput = z.infer<typeof ClusterGetHealthInputSchema>;

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
};

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
} as const;
