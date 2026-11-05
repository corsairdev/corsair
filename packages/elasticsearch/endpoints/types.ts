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
} as const;
