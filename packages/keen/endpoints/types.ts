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
 * A query result is a number for the scalar analyses (null when no event
 * matched an average, minimum or the like), an array of values for
 * `select_unique` (which can be booleans), an array of objects for `group_by`
 * or `interval`, and an object keyed by label for a multi-analysis saved query.
 * Naming the forms keeps the docs honest instead of printing `any`.
 */
export const KeenResultSchema = z.union([
	z.number(),
	z.string(),
	z.boolean(),
	z.null(),
	z.array(
		z.union([
			z.number(),
			z.string(),
			z.boolean(),
			z.null(),
			// unknown: a group or interval row carries the grouped property names
			// as keys, so its shape follows the query.
			z.record(z.string(), z.unknown()),
		]),
	),
	// unknown: a multi-analysis result is keyed by the caller's labels, and each
	// value takes the shape of its own analysis.
	z.record(z.string(), z.unknown()),
]);

const SIMPLE_FILTER_OPERATORS = KEEN_FILTER_OPERATORS;

// A scalar Keen can compare: strings, numbers and booleans are the property
// types it infers.
const isScalar = (value: unknown) =>
	typeof value === 'string' ||
	typeof value === 'number' ||
	typeof value === 'boolean';

const SimpleFilterInputSchema = z
	.object({
		property_name: z.string().min(1),
		operator: z.enum(SIMPLE_FILTER_OPERATORS),
		// unknown: the comparison value's type follows the operator, which the
		// refinement below checks rather than typing each operator separately.
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
		const v = value.property_value;
		switch (value.operator) {
			case 'exists':
				if (typeof v !== 'boolean') expected('a boolean');
				return;
			case 'in':
				if (!Array.isArray(v)) expected('an array');
				return;
			case 'regex':
				if (typeof v !== 'string') expected('a string');
				return;
			case 'within': {
				// Keen's geo filter: `{ coordinates: [longitude, latitude], max_distance_miles }`.
				const geo = v as {
					coordinates?: unknown;
					max_distance_miles?: unknown;
				};
				if (
					typeof v !== 'object' ||
					v === null ||
					!Array.isArray(geo.coordinates) ||
					geo.coordinates.length !== 2 ||
					!geo.coordinates.every((n) => typeof n === 'number') ||
					typeof geo.max_distance_miles !== 'number'
				) {
					expected(
						'an object with `coordinates` ([longitude, latitude]) and `max_distance_miles`',
					);
				}
				return;
			}
			case 'lt':
			case 'lte':
			case 'gt':
			case 'gte':
				if (typeof v !== 'number' && typeof v !== 'string') {
					expected('a number or a string');
				}
				return;
			default:
				// `eq`, `ne`, `contains` and `not_contains` compare against a string,
				// a number or a boolean, including one element of a list property.
				if (!isScalar(v)) expected('a string, a number or a boolean');
		}
	});

// An or filter matches an event when any of its operands match.
const OrFilterInputSchema = z.object({
	operator: z.literal('or'),
	operands: z.array(SimpleFilterInputSchema).min(1),
});

const FilterInputSchema = z.union([
	OrFilterInputSchema,
	SimpleFilterInputSchema,
]);

/**
 * A query names its target property, and the analysis types that need one say
 * so here rather than at Keen. `count` and `funnel` take none.
 */
const analysisNeedsTarget = (analysisType: string) =>
	analysisType !== 'count' && analysisType !== 'funnel';

// A funnel step names its own collection and the actor to follow through it.
// Steps inherit `timeframe` and `timezone` from the funnel when they omit them.
const FunnelStepSchema = z
	.object({
		event_collection: CollectionSchema,
		actor_property: z
			.string()
			.min(1)
			.describe('The property that identifies an actor, such as `user.id`.'),
		timeframe: KeenTimeframeSchema.optional(),
		timezone: z.string().optional(),
		filters: z.array(FilterInputSchema).min(1).optional(),
		optional: z.boolean().optional(),
		inverted: z.boolean().optional(),
		with_actors: z.boolean().optional(),
	})
	.loose();

const AnalysisFields = z.object({
	analysis_type: z.enum(KEEN_ANALYSIS_TYPES),
	event_collection: CollectionSchema.optional().describe(
		'The collection to analyze. Required for every analysis but `funnel`, whose steps name their own; inside a multi-analysis it comes from the outer request.',
	),
	steps: z
		.array(FunnelStepSchema)
		.min(1)
		.optional()
		.describe('Required for `funnel`: the steps, in order.'),
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
		.min(0)
		.max(100)
		.nullable()
		.optional()
		.describe('Required for `percentile`: the percentile to read, 0 to 100.'),
	include_metadata: z.boolean().optional(),
});

/**
 * The checks every analysis shares. A standalone query must name its
 * collection; an entry in a multi-analysis takes it from the outer request.
 */
function refineAnalysis(requireCollection: boolean) {
	return (value: z.output<typeof AnalysisFields>, ctx: z.RefinementCtx) => {
		if (value.analysis_type === 'funnel') {
			if (!value.steps) {
				ctx.addIssue({
					code: 'custom',
					path: ['steps'],
					message: '`funnel` needs `steps`.',
				});
			}
		} else {
			if (value.steps !== undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['steps'],
					message: 'Only a `funnel` analysis takes `steps`.',
				});
			}
			if (requireCollection && !value.event_collection) {
				ctx.addIssue({
					code: 'custom',
					path: ['event_collection'],
					message: `\`${value.analysis_type}\` needs an \`event_collection\`.`,
				});
			}
		}
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
	};
}

const AnalysisSchema = AnalysisFields.superRefine(refineAnalysis(true));

// An entry in a multi-analysis: the outer request carries the collection.
const MultiAnalysisEntrySchema = AnalysisFields.superRefine(
	refineAnalysis(false),
);

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
	// unknown: an event is the caller's own data; Keen infers each property's type.
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
		// unknown: each event is the caller's own data, as in events.record.
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
		.record(z.string(), MultiAnalysisEntrySchema)
		.describe(
			'Label to analysis. Each label becomes a key in the result. Keen allows at most 10 analyses per request.',
		),
	timeframe: KeenTimeframeSchema.optional(),
	interval: z.enum(KEEN_INTERVALS).optional(),
	timezone: z.string().optional(),
	filters: z.array(FilterInputSchema).min(1).optional(),
	group_by: z
		.array(
			z.union([
				z.string().min(1),
				// unknown: buckets and ranges pass through in Keen's own shape, as in
				// a single analysis.
				z.record(z.string(), z.unknown()),
			]),
		)
		.min(1)
		.optional(),
});

export type QueriesMultiAnalysisInput = z.input<
	typeof QueriesMultiAnalysisInputSchema
>;

// A multi-analysis result is keyed by the label each analysis was given. A
// plain run answers that object of labels; an interval run answers an array of
// `{ timeframe, value: { label: ... } }`, and a grouped run an array of rows
// carrying the group values next to the labels.
const QueriesMultiAnalysisResponseSchema = z
	.object({
		result: z.union([
			// unknown: each label's value takes the shape of its own analysis.
			z.record(z.string(), z.unknown()),
			// unknown: interval and group rows hold the same per-label values.
			z.array(z.record(z.string(), z.unknown())),
		]),
	})
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
		// unknown: the stored analysis document, whose keys follow its analysis
		// type; the metadata and run information are Keen's free-form objects.
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

// Keen caches a saved query only between four and 24 hours apart.
const MIN_REFRESH_SECONDS = 4 * 60 * 60;
const MAX_REFRESH_SECONDS = 24 * 60 * 60;

// Keen saves a multi-analysis too: the same body as `queries.multiAnalysis`
// with `analysis_type: 'multi_analysis'`.
const SavedMultiAnalysisSchema = QueriesMultiAnalysisInputSchema.extend({
	analysis_type: z.literal('multi_analysis'),
});

const SavedQueryCreateInputSchema = z.object({
	queryName: SavedQueryNameSchema,
	query: z
		.union([SavedMultiAnalysisSchema, AnalysisSchema])
		.describe(
			'One analysis, or a multi-analysis with `analysis_type: multi_analysis` and its `analyses` map.',
		),
	refresh_rate: z
		.number()
		.int()
		.refine(
			(value) =>
				value === 0 ||
				(value >= MIN_REFRESH_SECONDS && value <= MAX_REFRESH_SECONDS),
			'`refresh_rate` is 0, or between 14400 (four hours) and 86400 (24 hours).',
		)
		.describe(
			'Seconds between refreshes. `0` caches nothing; a cached query refreshes every 14400 (four hours) to 86400 (24 hours) seconds.',
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
		// unknown: the stored analysis document, as on the definition.
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
		// unknown: the cached analysis document, whose keys follow its type.
		query: z.record(z.string(), z.unknown()).nullish(),
		// Keen echoes a single index property as a string on create and lists
		// them as an array elsewhere.
		index_by: z.union([z.string(), z.array(z.string())]).nullish(),
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
		.union([
			z.string().min(1),
			z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
		])
		.describe(
			'The index value that selects the rows: a string for a single string index property, or an object of property name to value when there are several or the value is not a string.',
		),
	timeframe: KeenTimeframeSchema.describe(
		'A relative timeframe in the dataset’s own unit, or an absolute window that lines up with its intervals.',
	),
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
