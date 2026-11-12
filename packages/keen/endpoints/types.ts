import { z } from 'zod';

// Inputs use Keen's own names. Outputs are `.loose()` with their documented
// fields nullish, so a field Keen adds or omits cannot fail a call that has
// already happened. Reference: https://keen.io/docs/api/

const CollectionSchema = z
	.string()
	.min(1)
	.max(255)
	.describe('The event collection, such as `purchases`.');

const SavedQueryNameSchema = z
	.string()
	.min(1)
	.describe('The saved query name, which is also its identifier.');

const DatasetNameSchema = z
	.string()
	.min(1)
	.describe('The cached dataset name.');

// ── query building blocks ─────────────────────────────────────────────────

export const KEEN_ANALYSIS_TYPES = [
	'count',
	'count_unique',
	'minimum',
	'maximum',
	'sum',
	'average',
	'median',
	'percentile',
	'select_unique',
	'standard_deviation',
	'funnel',
] as const;

export const KEEN_FILTER_OPERATORS = [
	'eq',
	'ne',
	'lt',
	'lte',
	'gt',
	'gte',
	'exists',
	'in',
	'contains',
	'not_contains',
	'within',
	'regex',
] as const;

export const KEEN_INTERVALS = [
	'minutely',
	'hourly',
	'daily',
	'weekly',
	'monthly',
	'yearly',
] as const;

/** Keen's two documented timeframe forms: a relative name, or an absolute pair. */
export const KeenTimeframeSchema = z
	.union([
		z
			.string()
			.min(1)
			.describe(
				'A relative timeframe such as `this_14_days` or `previous_week`.',
			),
		z
			.object({
				start: z.string().min(1),
				end: z.string().min(1),
			})
			.loose()
			.describe('An absolute window, as ISO date-times.'),
	])
	.describe('A relative name, or an object with `start` and `end`.');

/**
 * A query result is a number for the scalar analyses, an array of values for
 * `select_unique`, and an array of objects for `group_by` or `interval`. Naming
 * all three keeps the docs honest instead of printing `any`.
 */
export const KeenResultSchema = z.union([
	z.number(),
	z.string(),
	z.array(z.union([z.number(), z.string(), z.record(z.string(), z.unknown())])),
]);

const FilterSchema = z
	.object({
		property_name: z.string().min(1).describe('The event property to test.'),
		operator: z.enum(KEEN_FILTER_OPERATORS),
		property_value: z
			.unknown()
			.describe(
				'The value to compare. An array for `in`, a boolean for `exists`, and a string for `regex`.',
			),
	})
	.loose();

const FilterInputSchema = z
	.object({
		property_name: z.string().min(1),
		operator: z.enum(KEEN_FILTER_OPERATORS),
		// unknown: the comparison value's type follows the operator, which the
		// input schema checks below rather than typing eight separate cases.
		property_value: z.unknown(),
	})
	.superRefine((value, ctx) => {
		const expected = (kind: string) => {
			ctx.addIssue({
				code: 'custom',
				path: ['property_value'],
				message: `\`${value.operator}\` takes ${kind}.`,
			});
		};
		if (value.operator === 'exists') {
			if (typeof value.property_value !== 'boolean') expected('a boolean');
			return;
		}
		if (value.operator === 'in') {
			if (!Array.isArray(value.property_value)) expected('an array');
			return;
		}
		if (
			value.operator === 'contains' ||
			value.operator === 'not_contains' ||
			value.operator === 'regex'
		) {
			if (typeof value.property_value !== 'string') expected('a string');
			return;
		}
		// `eq`, `ne`, and the four comparisons take a number or a string.
		if (
			typeof value.property_value !== 'number' &&
			typeof value.property_value !== 'string'
		) {
			expected('a number or a string');
		}
	});

/**
 * A query names its target property, and the analysis types that need one say
 * so here rather than at Keen. `count` and `funnel` take none.
 */
const analysisNeedsTarget = (analysisType: string) =>
	analysisType !== 'count' && analysisType !== 'funnel';

const AnalysisSchema = z
	.object({
		analysis_type: z.enum(KEEN_ANALYSIS_TYPES),
		event_collection: CollectionSchema,
		target_property: z
			.string()
			.min(1)
			.optional()
			.describe('Required for every analysis except `count` and `funnel`.'),
		timeframe: KeenTimeframeSchema.optional(),
		interval: z
			.enum(KEEN_INTERVALS)
			.optional()
			.describe('Split the result into one value per interval.'),
		timezone: z
			.string()
			.optional()
			.describe('IANA timezone for interval boundaries, such as `US/Pacific`.'),
		filters: z.array(FilterInputSchema).min(1).optional(),
		group_by: z
			.array(
				z.union([
					z.string().min(1),
					// unknown: the other group_by forms (buckets and ranges) have
					// keys that change per form, so they pass through as Keen takes
					// them rather than being typed twice.
					z.record(z.string(), z.unknown()),
				]),
			)
			.min(1)
			.optional()
			.describe(
				'A property name, or a buckets or ranges object; all in Keen’s own shape.',
			),
		order_by: z
			.array(
				z.object({
					property_name: z.string().min(1),
					direction: z.enum(['ASC', 'DESC']),
				}),
			)
			.min(1)
			.optional(),
		limit: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Maximum group rows to return.'),
		percentile: z
			.number()
			.nullable()
			.optional()
			.describe('Required for `percentile`: the percentile to read, 0 to 100.'),
		include_metadata: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (analysisNeedsTarget(value.analysis_type) && !value.target_property) {
			ctx.addIssue({
				code: 'custom',
				path: ['target_property'],
				message: `\`${value.analysis_type}\` needs a \`target_property\`.`,
			});
		}
		if (value.analysis_type === 'percentile' && value.percentile == null) {
			ctx.addIssue({
				code: 'custom',
				path: ['percentile'],
				message: '`percentile` needs a `percentile` value between 0 and 100.',
			});
		}
		if (
			value.analysis_type !== 'percentile' &&
			value.percentile !== undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['percentile'],
				message: 'Only a `percentile` analysis takes `percentile`.',
			});
		}
	});

export type KeenAnalysisInput = z.input<typeof AnalysisSchema>;

/** What a query result looks like when it has no interval and no group_by. */
export const KeenScalarResultSchema = z
	.object({
		result: KeenResultSchema,
	})
	.loose();

// ── events.record ─────────────────────────────────────────────────────────

const EventsRecordInputSchema = z.object({
	collection: CollectionSchema,
	event: z
		.record(z.string(), z.unknown())
		.describe(
			'The event body. Its keys become properties. `keen.timestamp` overrides when Keen records it.',
		),
});

export type EventsRecordInput = z.input<typeof EventsRecordInputSchema>;

const EventsRecordResponseSchema = z.object({ created: z.boolean() }).loose();

export type EventsRecordResponse = z.infer<typeof EventsRecordResponseSchema>;

// ── events.recordMany ─────────────────────────────────────────────────────

const EventsRecordManyInputSchema = z
	.object({
		events: z
			.record(z.string(), z.array(z.record(z.string(), z.unknown())).min(1))
			.describe(
				'Collection name to events. Keen recommends batches of 5,000 or less.',
			),
	})
	.superRefine((value, ctx) => {
		// `z.record` accepts an empty object, and a request with no events would
		// be a round trip that stores nothing.
		if (Object.keys(value.events).length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['events'],
				message: 'Send at least one collection with at least one event.',
			});
		}
	});

export type EventsRecordManyInput = z.input<typeof EventsRecordManyInputSchema>;

// Each collection comes back as a list with one entry per event, where an entry
// says whether that event was stored.
const EventsRecordManyResponseSchema = z
	.record(z.string(), z.array(z.object({ success: z.boolean() }).loose()))
	.describe('Collection name to one result per event.');

export type EventsRecordManyResponse = z.infer<
	typeof EventsRecordManyResponseSchema
>;

// ── collections ───────────────────────────────────────────────────────────

const CollectionPropertiesSchema = z
	.record(z.string(), z.string())
	.describe(
		'Property name to inferred type: `num`, `string`, `bool` and so on.',
	);

const CollectionsListInputSchema = z.object({});

export type CollectionsListInput = z.input<typeof CollectionsListInputSchema>;

const CollectionSchemaResponse = z
	.object({
		name: z.string(),
		properties: CollectionPropertiesSchema.nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type KeenCollection = z.infer<typeof CollectionSchemaResponse>;

const CollectionsListResponseSchema = z.array(CollectionSchemaResponse);

export type CollectionsListResponse = z.infer<
	typeof CollectionsListResponseSchema
>;

const CollectionsGetInputSchema = z.object({ collection: CollectionSchema });

export type CollectionsGetInput = z.input<typeof CollectionsGetInputSchema>;

const CollectionGetResponseSchema = z
	.object({
		properties: CollectionPropertiesSchema.nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type CollectionGetResponse = z.infer<typeof CollectionGetResponseSchema>;

const PropertiesGetInputSchema = z.object({
	collection: CollectionSchema,
	property: z
		.string()
		.min(1)
		.describe(
			'The property name, which may contain dots, such as `item.price`.',
		),
});

export type PropertiesGetInput = z.input<typeof PropertiesGetInputSchema>;

// Reading one property names the property's type in its body.
const PropertyGetResponseSchema = z
	.object({
		property_name: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

export type PropertyGetResponse = z.infer<typeof PropertyGetResponseSchema>;

// ── queries ───────────────────────────────────────────────────────────────

// A standalone query is the analysis document itself, so the same schema
// applies rather than a restatement that could drift.
export const QueriesRunInputSchema = AnalysisSchema;

export type QueriesRunInput = z.input<typeof QueriesRunInputSchema>;

// A query answers a scalar result, an interval result, or a grouped result, and
// which one arrives depends on the request. The schema accepts all three and
// keeps the shape Keen sent, rather than pretending an interval result has a
// scalar in it.
const QueriesRunResponseSchema = z.object({ result: KeenResultSchema }).loose();

export type QueriesRunResponse = z.infer<typeof QueriesRunResponseSchema>;

const QueriesMultiAnalysisInputSchema = z.object({
	event_collection: CollectionSchema,
	analyses: z
		.record(z.string(), AnalysisSchema)
		.describe(
			'Label to analysis. Each label becomes a key in the result. Keen allows at most 10 analyses per request.',
		),
	timeframe: KeenTimeframeSchema.optional(),
	interval: z.enum(KEEN_INTERVALS).optional(),
	timezone: z.string().optional(),
	filters: z.array(FilterInputSchema).min(1).optional(),
	group_by: z
		.array(z.union([z.string().min(1), z.record(z.string(), z.unknown())]))
		.min(1)
		.optional(),
});

export type QueriesMultiAnalysisInput = z.input<
	typeof QueriesMultiAnalysisInputSchema
>;

// A multi-analysis result is keyed by the label each analysis was given, so a
// scalar run answers an object of numbers and an interval run an object of
// arrays. Both are records, which is what this keeps.
const QueriesMultiAnalysisResponseSchema = z
	.object({ result: z.record(z.string(), z.unknown()) })
	.loose();

export type QueriesMultiAnalysisResponse = z.infer<
	typeof QueriesMultiAnalysisResponseSchema
>;

// ── saved queries ─────────────────────────────────────────────────────────

const SavedQueriesListInputSchema = z.object({});

export type SavedQueriesListInput = z.input<typeof SavedQueriesListInputSchema>;

const SavedQuerySchema = z
	.object({
		query_name: z.string(),
		refresh_rate: z.number().nullish(),
		query: z.record(z.string(), z.unknown()).nullish(),
		metadata: z.record(z.string(), z.unknown()).nullish(),
		created_date: z.string().nullish(),
		last_modified_date: z.string().nullish(),
		user_last_modified_date: z.string().nullish(),
		run_information: z.record(z.string(), z.unknown()).nullish(),
		urls: z
			.object({
				cached_query_url: z.string().nullish(),
				cached_query_results_url: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type KeenSavedQuery = z.infer<typeof SavedQuerySchema>;

const SavedQueriesListResponseSchema = z
	.object({ queries: z.array(SavedQuerySchema) })
	.loose();

export type SavedQueriesListResponse = z.infer<
	typeof SavedQueriesListResponseSchema
>;

const SavedQueryGetInputSchema = z.object({ queryName: SavedQueryNameSchema });

export type SavedQueryGetInput = z.input<typeof SavedQueryGetInputSchema>;

const SavedQueryResponseSchema = SavedQuerySchema.loose();

export type SavedQueryResponse = z.infer<typeof SavedQueryResponseSchema>;

const SavedQueryCreateInputSchema = z.object({
	queryName: SavedQueryNameSchema,
	query: AnalysisSchema,
	refresh_rate: z
		.number()
		.int()
		.min(0)
		.describe(
			'Seconds between refreshes. `0` caches nothing; anything above 0 must be at least four hours.',
		),
	metadata: z
		.object({ display_name: z.string().min(1) })
		.loose()
		.optional(),
});

export type SavedQueryCreateInput = z.input<typeof SavedQueryCreateInputSchema>;

const SavedQueryResultInputSchema = z.object({
	queryName: SavedQueryNameSchema,
});

export type SavedQueryResultInput = z.input<typeof SavedQueryResultInputSchema>;

const SavedQueryResultResponseSchema = z
	.object({
		query_name: z.string(),
		result: KeenResultSchema,
		refresh_rate: z.number().nullish(),
		query: z.record(z.string(), z.unknown()).nullish(),
		created_date: z.string().nullish(),
		last_modified_date: z.string().nullish(),
		urls: z
			.object({
				cached_query_url: z.string().nullish(),
				cached_query_results_url: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type SavedQueryResultResponse = z.infer<
	typeof SavedQueryResultResponseSchema
>;

const SavedQueryRemoveInputSchema = z.object({
	queryName: SavedQueryNameSchema,
});

export type SavedQueryRemoveInput = z.input<typeof SavedQueryRemoveInputSchema>;

/** Every delete on the API answers 204 with no body. */
const DeletedResponseSchema = z.object({
	success: z.literal(true).describe('The resource is gone.'),
});

export type DeletedResponse = z.infer<typeof DeletedResponseSchema>;

// ── datasets ──────────────────────────────────────────────────────────────

const DatasetsListInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe(
			'Datasets per page. Defaults to 10, and Keen allows at most 100.',
		),
	after_name: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The dataset name the next page starts after. Keen’s `next_page_url` names it.',
		),
});

export type DatasetsListInput = z.input<typeof DatasetsListInputSchema>;

const DatasetSchema = z
	.object({
		project_id: z.string().nullish(),
		organization_id: z.string().nullish(),
		dataset_name: z.string(),
		display_name: z.string().nullish(),
		query: z.record(z.string(), z.unknown()).nullish(),
		index_by: z.array(z.string()).nullish(),
		last_scheduled_date: z.string().nullish(),
		latest_subtimeframe_available: z.string().nullish(),
		milliseconds_behind: z.number().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type KeenDataset = z.infer<typeof DatasetSchema>;

const DatasetsListResponseSchema = z
	.object({
		datasets: z.array(DatasetSchema),
		next_page_url: z
			.string()
			.nullish()
			.describe('The next page while more remain; absent on the last page.'),
		next_after_name: z
			.string()
			.nullable()
			.describe(
				'The `after_name` for the next page, read out of `next_page_url`; null on the last page.',
			),
	})
	.loose();

export type DatasetsListResponse = z.infer<typeof DatasetsListResponseSchema>;

const DatasetGetInputSchema = z.object({ datasetName: DatasetNameSchema });

export type DatasetGetInput = z.input<typeof DatasetGetInputSchema>;

const DatasetGetResponseSchema = DatasetSchema.loose();

export type DatasetGetResponse = z.infer<typeof DatasetGetResponseSchema>;

const DatasetResultInputSchema = z.object({
	datasetName: DatasetNameSchema,
	index_by: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Values for the dataset’s `index_by` properties, which select the rows to return.',
		),
	timeframe: KeenTimeframeSchema.optional(),
});

export type DatasetResultInput = z.input<typeof DatasetResultInputSchema>;

const DatasetResultResponseSchema = z
	.object({ result: KeenResultSchema })
	.loose();

export type DatasetResultResponse = z.infer<typeof DatasetResultResponseSchema>;

const DatasetRemoveInputSchema = z.object({ datasetName: DatasetNameSchema });

export type DatasetRemoveInput = z.input<typeof DatasetRemoveInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KeenEndpointInputs = {
	eventsRecord: EventsRecordInput;
	eventsRecordMany: EventsRecordManyInput;
	collectionsList: CollectionsListInput;
	collectionsGet: CollectionsGetInput;
	propertiesGet: PropertiesGetInput;
	queriesRun: QueriesRunInput;
	queriesMultiAnalysis: QueriesMultiAnalysisInput;
	savedQueriesList: SavedQueriesListInput;
	savedQueriesGet: SavedQueryGetInput;
	savedQueriesCreate: SavedQueryCreateInput;
	savedQueriesResult: SavedQueryResultInput;
	savedQueriesRemove: SavedQueryRemoveInput;
	datasetsList: DatasetsListInput;
	datasetsGet: DatasetGetInput;
	datasetsResult: DatasetResultInput;
	datasetsRemove: DatasetRemoveInput;
};

export type KeenEndpointOutputs = {
	eventsRecord: EventsRecordResponse;
	eventsRecordMany: EventsRecordManyResponse;
	collectionsList: CollectionsListResponse;
	collectionsGet: CollectionGetResponse;
	propertiesGet: PropertyGetResponse;
	queriesRun: QueriesRunResponse;
	queriesMultiAnalysis: QueriesMultiAnalysisResponse;
	savedQueriesList: SavedQueriesListResponse;
	savedQueriesGet: SavedQueryResponse;
	savedQueriesCreate: SavedQueryResponse;
	savedQueriesResult: SavedQueryResultResponse;
	savedQueriesRemove: DeletedResponse;
	datasetsList: DatasetsListResponse;
	datasetsGet: DatasetGetResponse;
	datasetsResult: DatasetResultResponse;
	datasetsRemove: DeletedResponse;
};

export const KeenEndpointInputSchemas = {
	eventsRecord: EventsRecordInputSchema,
	eventsRecordMany: EventsRecordManyInputSchema,
	collectionsList: CollectionsListInputSchema,
	collectionsGet: CollectionsGetInputSchema,
	propertiesGet: PropertiesGetInputSchema,
	queriesRun: QueriesRunInputSchema,
	queriesMultiAnalysis: QueriesMultiAnalysisInputSchema,
	savedQueriesList: SavedQueriesListInputSchema,
	savedQueriesGet: SavedQueryGetInputSchema,
	savedQueriesCreate: SavedQueryCreateInputSchema,
	savedQueriesResult: SavedQueryResultInputSchema,
	savedQueriesRemove: SavedQueryRemoveInputSchema,
	datasetsList: DatasetsListInputSchema,
	datasetsGet: DatasetGetInputSchema,
	datasetsResult: DatasetResultInputSchema,
	datasetsRemove: DatasetRemoveInputSchema,
} as const;

export const KeenEndpointOutputSchemas = {
	eventsRecord: EventsRecordResponseSchema,
	eventsRecordMany: EventsRecordManyResponseSchema,
	collectionsList: CollectionsListResponseSchema,
	collectionsGet: CollectionGetResponseSchema,
	propertiesGet: PropertyGetResponseSchema,
	queriesRun: QueriesRunResponseSchema,
	queriesMultiAnalysis: QueriesMultiAnalysisResponseSchema,
	savedQueriesList: SavedQueriesListResponseSchema,
	savedQueriesGet: SavedQueryResponseSchema,
	savedQueriesCreate: SavedQueryResponseSchema,
	savedQueriesResult: SavedQueryResultResponseSchema,
	savedQueriesRemove: DeletedResponseSchema,
	datasetsList: DatasetsListResponseSchema,
	datasetsGet: DatasetGetResponseSchema,
	datasetsResult: DatasetResultResponseSchema,
	datasetsRemove: DeletedResponseSchema,
} as const;
