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

const FieldMap = (value: z.ZodType) =>
	z.record(z.string().min(1), value);

// Index names and document ids are caller-controlled path segments; blank
// strings are never valid targets.
const NonBlankString = z.string().min(1).regex(/\S/, 'Expected a non-blank string');

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
	_source: z.union([z.boolean(), z.array(z.string().min(1)).min(1)])
		.optional(),
});
export type SearchRunInput = z.input<typeof SearchRunInputSchema>;

const SearchHitSchema = z.looseObject({
	_index: z.string(),
	_id: z.string(),
	_score: z.number().nullable().optional(),
	_source: z.record(z.string(), z.unknown()).optional(),
	_ignored: z.array(z.string()).optional(),
	sort: z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
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
	_source: z.record(z.string(), z.unknown()).optional(),
	_version: z.number().optional(),
	_seq_no: z.number().optional(),
	_primary_term: z.number().optional(),
});
export type DocumentsGetResponse = z.infer<typeof DocumentsGetResponseSchema>;

// ── registry ─────────────────────────────────────────────────────────────────

export type ElasticsearchEndpointInputs = {
	clusterGetHealth: ClusterGetHealthInput;
	indicesList: IndicesListInput;
	indicesGet: IndicesGetInput;
	searchRun: SearchRunInput;
	documentsGet: DocumentsGetInput;
};

export type ElasticsearchEndpointOutputs = {
	clusterGetHealth: ClusterGetHealthResponse;
	indicesList: IndicesListResponse;
	indicesGet: IndicesGetResponse;
	searchRun: SearchRunResponse;
	documentsGet: DocumentsGetResponse;
};

export type ElasticsearchOperation = keyof ElasticsearchEndpointInputs;

export const ElasticsearchEndpointInputSchemas = {
	clusterGetHealth: ClusterGetHealthInputSchema,
	indicesList: IndicesListInputSchema,
	indicesGet: IndicesGetInputSchema,
	searchRun: SearchRunInputSchema,
	documentsGet: DocumentsGetInputSchema,
} as const;

export const ElasticsearchEndpointOutputSchemas = {
	clusterGetHealth: ClusterGetHealthResponseSchema,
	indicesList: IndicesListResponseSchema,
	indicesGet: IndicesGetResponseSchema,
	searchRun: SearchRunResponseSchema,
	documentsGet: DocumentsGetResponseSchema,
} as const;
