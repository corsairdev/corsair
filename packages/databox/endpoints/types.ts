import { z } from 'zod';

// Inputs use Databox v2's own parameter names. Outputs are `.loose()` and
// their documented fields `.nullish()`, so a field Databox adds or omits
// cannot fail a call that has already happened. Status-like strings stay
// plain strings: an unknown status must not fail a read. Field reference:
// https://developers.databox.com/docs/api/api.databox.com

const IdSchema = z.number().int().positive();

const AccountIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		'Sent as x-account-id to act on one account of the organization instead of the organization tied to the key. Only for organizations with accounts enabled.',
	);

const IdempotencyKeySchema = z
	.string()
	.min(1)
	.describe(
		'Sent as Idempotency-Key; Databox returns the original response for the same key within 24 hours.',
	);

const PageSchema = z.number().int().min(0).describe('Zero-based page number.');

const PageSizeSchema = z
	.number()
	.int()
	.positive()
	.describe('Maximum items per page; the docs example uses 100.');

const SortBySchema = z.string().min(1).describe('Field to sort by.');

const SortOrderSchema = z
	.string()
	.min(1)
	.describe('Sort direction, such as asc or desc.');

const NextPageSchema = z
	.number()
	.int()
	.min(0)
	.nullable()
	.describe(
		'The next zero-based page while more items remain; null on the last page.',
	);

// ── shared output shapes ───────────────────────────────────────────────────

const StatusInfoSchema = z
	.object({
		// A string rather than an enum: status values such as active, error,
		// pending and onHold must not fail a read when Databox adds one.
		status: z.string().nullish(),
		statusCode: z.string().nullish(),
		errorType: z.string().nullish(),
		reason: z.string().nullish(),
		description: z.string().nullish(),
		userAction: z.string().nullish(),
	})
	.loose();

const UserRefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export const DataSourceSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		integrationKey: z.string().nullish(),
		timezone: z.string().nullish(),
		statusInfo: StatusInfoSchema.nullish(),
		connectionId: z.number().nullish(),
		managedBy: UserRefSchema.nullish(),
		createdAt: z.string().nullish(),
		lastActivityAt: z.string().nullish(),
		syncInterval: z.number().nullish(),
	})
	.loose();

export type DataboxDataSource = z.infer<typeof DataSourceSchema>;

export const DatasetSchema = z
	.object({
		id: z.number(),
		// dataset or mergedDataset; a plain string so a new type still reads.
		type: z.string().nullish(),
		// Null for merged datasets.
		dataSourceId: z.number().nullish(),
		name: z.string().nullish(),
		timezone: z.string().nullish(),
		ingestionSupported: z.boolean().nullish(),
		statusInfo: StatusInfoSchema.nullish(),
		syncInfo: z
			.object({
				status: z.string().nullish(),
				type: z.string().nullish(),
				initiatedAt: z.string().nullish(),
				lastSuccessfulSyncAt: z.string().nullish(),
			})
			.loose()
			.nullish(),
		verificationInfo: z
			.object({ isVerified: z.boolean().nullish() })
			.loose()
			.nullish(),
		// Present on API-created datasets only.
		ingestionInfo: z
			.object({
				lastStatus: z.string().nullish(),
				lastIngestionAt: z.string().nullish(),
			})
			.loose()
			.nullish(),
		createdAt: z.string().nullish(),
		lastActivityAt: z.string().nullish(),
	})
	.loose();

export type DataboxDataset = z.infer<typeof DatasetSchema>;

const IngestionSummarySchema = z
	.object({
		ingestion: z
			.object({
				receivedRecordCount: z.number().nullish(),
				appendedRecordCount: z.number().nullish(),
				overwrittenRecordCount: z.number().nullish(),
				rejectedRecordCount: z.number().nullish(),
			})
			.loose()
			.nullish(),
		dataset: z
			.object({
				columnCount: z.number().nullish(),
				rowCount: z.number().nullish(),
				size: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const IngestionSchema = z
	.object({
		id: z.string(),
		initiatedAt: z.string().nullish(),
		// A string rather than an enum: Databox does not document the allowed
		// values; the ingest response example says queued.
		status: z.string().nullish(),
		duration: z.number().nullish(),
		initiatedBy: UserRefSchema.nullish(),
		summary: IngestionSummarySchema.nullish(),
		// unknown: per-record rejection payloads keyed by Databox's error
		// fields plus the rejected record itself; passed through as sent.
		errors: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type DataboxIngestion = z.infer<typeof IngestionSchema>;

const ColumnMetadataSchema = z
	.object({
		id: z.string().nullish(),
		displayName: z.string().nullish(),
		// datetime, number and string on create; responses also carry
		// currency, duration and percentage.
		dataType: z.string().nullish(),
		order: z.number().nullish(),
		visible: z.boolean().nullish(),
	})
	.loose();

export type DataboxColumnMetadata = z.infer<typeof ColumnMetadataSchema>;

export const MetricSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		sourceId: z.number().nullish(),
		dimensions: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						displayName: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		supportsDrilldown: z.boolean().nullish(),
		verificationInfo: z
			.object({ isVerified: z.boolean().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export type DataboxMetric = z.infer<typeof MetricSchema>;

export const DashboardSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		integrationKeys: z.array(z.string()).nullish(),
	})
	.loose();

export type DataboxDashboard = z.infer<typeof DashboardSchema>;

// ── auth.validateKey ───────────────────────────────────────────────────────

const ValidateKeyInputSchema = z.object({});

export type ValidateKeyInput = z.input<typeof ValidateKeyInputSchema>;

const ValidateKeyResponseSchema = z.object({
	valid: z.literal(true),
});

export type ValidateKeyResponse = z.infer<typeof ValidateKeyResponseSchema>;

// ── dataSources.list ───────────────────────────────────────────────────────

const ListDataSourcesInputSchema = z.object({
	search: z.string().min(1).optional().describe('Filter by keyword.'),
	connectionId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only data sources with this connection.'),
	sortBy: SortBySchema.optional(),
	sortOrder: SortOrderSchema.optional(),
	page: PageSchema.optional(),
	pageSize: PageSizeSchema.optional(),
	accountId: AccountIdSchema.optional(),
});

export type ListDataSourcesInput = z.input<typeof ListDataSourcesInputSchema>;

const ListDataSourcesResponseSchema = z.object({
	dataSources: z.array(DataSourceSchema),
	page: z.number(),
	pageSize: z.number(),
	totalItems: z.number().nullish(),
	nextPage: NextPageSchema,
});

export type ListDataSourcesResponse = z.infer<
	typeof ListDataSourcesResponseSchema
>;

// ── dataSources.create ─────────────────────────────────────────────────────

const CreateDataSourceInputSchema = z.object({
	name: z.string().min(1).describe('Display name, such as Sales.'),
	timezone: z
		.string()
		.min(1)
		.optional()
		.describe('IANA timezone identifier, such as Europe/Ljubljana.'),
	accountId: AccountIdSchema.optional(),
	idempotencyKey: IdempotencyKeySchema.optional(),
});

export type CreateDataSourceInput = z.input<typeof CreateDataSourceInputSchema>;

const CreateDataSourceResponseSchema = z.object({
	dataSource: DataSourceSchema,
});

export type CreateDataSourceResponse = z.infer<
	typeof CreateDataSourceResponseSchema
>;

// ── dataSources.get ────────────────────────────────────────────────────────

const GetDataSourceInputSchema = z.object({
	id: IdSchema.describe('The data source to read.'),
	accountId: AccountIdSchema.optional(),
});

export type GetDataSourceInput = z.input<typeof GetDataSourceInputSchema>;

const GetDataSourceResponseSchema = z.object({
	dataSource: DataSourceSchema,
});

export type GetDataSourceResponse = z.infer<typeof GetDataSourceResponseSchema>;

// ── dataSources.delete ─────────────────────────────────────────────────────

const DeleteDataSourceInputSchema = z.object({
	id: IdSchema.describe(
		'The data source to delete, along with every dataset and record it holds.',
	),
	accountId: AccountIdSchema.optional(),
});

export type DeleteDataSourceInput = z.input<typeof DeleteDataSourceInputSchema>;

const DeleteDataSourceResponseSchema = z.object({
	message: z
		.string()
		.nullish()
		.describe("Databox's human-readable outcome note."),
});

export type DeleteDataSourceResponse = z.infer<
	typeof DeleteDataSourceResponseSchema
>;

// ── datasets.list ──────────────────────────────────────────────────────────

const ListDatasetsInputSchema = z.object({
	dataSourceId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only datasets in this data source.'),
	type: z
		.enum(['dataset', 'mergedDataset'])
		.optional()
		.describe('dataset is API-created; mergedDataset combines several.'),
	search: z.string().min(1).optional().describe('Search term.'),
	sortBy: SortBySchema.optional(),
	sortOrder: SortOrderSchema.optional(),
	page: PageSchema.optional(),
	pageSize: PageSizeSchema.optional(),
	accountId: AccountIdSchema.optional(),
});

export type ListDatasetsInput = z.input<typeof ListDatasetsInputSchema>;

const ListDatasetsResponseSchema = z.object({
	datasets: z.array(DatasetSchema),
	page: z.number(),
	pageSize: z.number(),
	totalItems: z.number().nullish(),
	nextPage: NextPageSchema,
});

export type ListDatasetsResponse = z.infer<typeof ListDatasetsResponseSchema>;

// ── datasets.create ────────────────────────────────────────────────────────

const ColumnInputSchema = z.object({
	id: z.string().min(1).describe('Unique column identifier.'),
	dataType: z
		.enum(['datetime', 'number', 'string'])
		.describe('Value type stored in the column.'),
});

export type DataboxColumnInput = z.input<typeof ColumnInputSchema>;

const CreateDatasetInputSchema = z.object({
	name: z.string().min(1).describe('Display name, such as Transactions.'),
	dataSourceId: IdSchema.describe('The data source that holds the dataset.'),
	primaryKey: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Column identifiers that make a record unique; re-ingesting a matching record overwrites it instead of appending.',
		),
	schema: z
		.array(ColumnInputSchema)
		.min(1)
		.describe('Column definitions for the dataset.'),
	accountId: AccountIdSchema.optional(),
	idempotencyKey: IdempotencyKeySchema.optional(),
});

export type CreateDatasetInput = z.input<typeof CreateDatasetInputSchema>;

const CreateDatasetResponseSchema = z.object({
	dataset: DatasetSchema,
});

export type CreateDatasetResponse = z.infer<typeof CreateDatasetResponseSchema>;

// ── datasets.get ───────────────────────────────────────────────────────────

const GetDatasetInputSchema = z.object({
	id: IdSchema.describe('The dataset to read.'),
	accountId: AccountIdSchema.optional(),
});

export type GetDatasetInput = z.input<typeof GetDatasetInputSchema>;

const GetDatasetResponseSchema = z.object({
	dataset: DatasetSchema,
});

export type GetDatasetResponse = z.infer<typeof GetDatasetResponseSchema>;

// ── datasets.listData ──────────────────────────────────────────────────────

const ListDatasetDataInputSchema = z.object({
	id: IdSchema.describe('The dataset whose records to read.'),
	sortBy: SortBySchema.optional().describe('Column to sort by.'),
	sortOrder: SortOrderSchema.optional(),
	page: PageSchema.optional(),
	pageSize: PageSizeSchema.optional(),
	accountId: AccountIdSchema.optional(),
});

export type ListDatasetDataInput = z.input<typeof ListDatasetDataInputSchema>;

// unknown: record keys are dataset column IDs, so the shape varies per
// dataset; values follow the column's dataType.
const DatasetRecordSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

export type DataboxDatasetRecord = z.infer<typeof DatasetRecordSchema>;

const ListDatasetDataResponseSchema = z.object({
	records: z.array(DatasetRecordSchema),
	schema: z.array(ColumnMetadataSchema).nullish(),
	page: z.number(),
	pageSize: z.number(),
	totalItems: z.number().nullish(),
	nextPage: NextPageSchema,
	lastUpdatedAt: z.string().nullish(),
});

export type ListDatasetDataResponse = z.infer<
	typeof ListDatasetDataResponseSchema
>;

// ── datasets.ingestData ────────────────────────────────────────────────────

const IngestDatasetDataInputSchema = z.object({
	id: IdSchema.describe('The dataset to ingest into.'),
	records: z
		.array(DatasetRecordSchema)
		.min(1)
		.max(500)
		.describe(
			'Records keyed by column ID; at most 500 rows per request. With a primaryKey, matching records overwrite.',
		),
	accountId: AccountIdSchema.optional(),
	idempotencyKey: IdempotencyKeySchema.optional(),
});

export type IngestDatasetDataInput = z.input<
	typeof IngestDatasetDataInputSchema
>;

const IngestDatasetDataResponseSchema = z.object({
	ingestionId: z
		.string()
		.describe('Pass with the dataset ID to datasets.getIngestion to poll.'),
	status: z.string().nullish(),
	message: z.string().nullish(),
});

export type IngestDatasetDataResponse = z.infer<
	typeof IngestDatasetDataResponseSchema
>;

// ── datasets.getIngestion ──────────────────────────────────────────────────

const GetIngestionInputSchema = z.object({
	id: IdSchema.describe('The dataset the ingestion ran against.'),
	ingestionId: z
		.string()
		.min(1)
		.describe('The ingestion ID returned by datasets.ingestData.'),
	accountId: AccountIdSchema.optional(),
});

export type GetIngestionInput = z.input<typeof GetIngestionInputSchema>;

const GetIngestionResponseSchema = z.object({
	ingestion: IngestionSchema,
});

export type GetIngestionResponse = z.infer<typeof GetIngestionResponseSchema>;

// ── metrics.list ───────────────────────────────────────────────────────────

const ListMetricsInputSchema = z.object({
	sourceId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only metrics of this data source or dataset.'),
	search: z.string().min(1).optional().describe('Search metric names.'),
	page: PageSchema.optional(),
	pageSize: PageSizeSchema.optional(),
	accountId: AccountIdSchema.optional(),
});

export type ListMetricsInput = z.input<typeof ListMetricsInputSchema>;

const ListMetricsResponseSchema = z.object({
	metrics: z.array(MetricSchema),
	page: z.number(),
	pageSize: z.number(),
	totalItems: z.number().nullish(),
	nextPage: NextPageSchema,
});

export type ListMetricsResponse = z.infer<typeof ListMetricsResponseSchema>;

// ── metrics.getData ────────────────────────────────────────────────────────

const MetricGranularitySchema = z.enum([
	'daily',
	'weekly',
	'monthly',
	'quarterly',
	'yearly',
	'allTime',
]);

const MetricFilterConditionSchema = z.object({
	type: z
		.enum(['dimension', 'unit'])
		.optional()
		.describe('What the condition targets; the docs default is dimension.'),
	field: z.string().min(1).describe('The field to filter on.'),
	operator: z.enum([
		'ANY_OF',
		'NONE_OF',
		'EQ',
		'NEQ',
		'CONTAINS',
		'NOT_CONTAINS',
	]),
	values: z
		.array(z.union([z.string(), z.number()]))
		.optional()
		.describe('Values the operator applies to.'),
});

const GetMetricDataInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			"Metric ID, such as 'GoogleAnalytics4@sessions', from metrics.list.",
		),
	sourceId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Restrict the metric to one data source or dataset.'),
	dateRange: z.object({
		from: z.string().min(1).describe('Range start, such as 2026-06-01.'),
		to: z.string().min(1).describe('Range end, such as 2026-06-30.'),
		granularity: MetricGranularitySchema.describe(
			'One point per period; hourly is rejected with a 400.',
		),
	}),
	dimensionIds: z
		.array(z.string().min(1))
		.optional()
		.describe('Dimension IDs to break the values down by; from the metric.'),
	filters: z
		.object({
			logicalOperator: z
				.enum(['and', 'or'])
				.optional()
				.describe('How the conditions combine.'),
			conditions: z
				.array(MetricFilterConditionSchema)
				.min(1)
				.describe('Conditions combined by the logical operator.'),
		})
		.optional(),
	accountId: AccountIdSchema.optional(),
});

export type GetMetricDataInput = z.input<typeof GetMetricDataInputSchema>;

const MetricDataPointSchema = z
	.object({
		date: z.string().nullish(),
		value: z.number().nullable().describe('Null for periods with no data.'),
		// unknown: dimension ID to value; the keys depend on the metric's
		// dimensions.
		dimensions: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const GetMetricDataResponseSchema = z.object({
	metric: z
		.object({
			id: z.string().nullish(),
			name: z.string().nullish(),
			sourceId: z.number().nullish(),
		})
		.loose()
		// Null only when syncInfo says a sync is pending or failed.
		.nullable(),
	dataPoints: z.array(MetricDataPointSchema),
	syncInfo: z
		.object({
			// synced, skipped, inProgress, neverSynced or failed; inProgress
			// and neverSynced mean call again shortly.
			status: z.string().nullish(),
			lastSyncedAt: z.string().nullish(),
			message: z.string().nullish(),
		})
		.loose()
		.nullish(),
});

export type GetMetricDataResponse = z.infer<typeof GetMetricDataResponseSchema>;

// ── dashboards.list ────────────────────────────────────────────────────────

const ListDashboardsInputSchema = z.object({
	search: z.string().min(1).optional().describe('Search filter.'),
	page: PageSchema.optional(),
	pageSize: PageSizeSchema.optional(),
	accountId: AccountIdSchema.optional(),
});

export type ListDashboardsInput = z.input<typeof ListDashboardsInputSchema>;

const ListDashboardsResponseSchema = z.object({
	dashboards: z.array(DashboardSchema),
	page: z.number(),
	pageSize: z.number(),
	totalItems: z.number().nullish(),
	nextPage: NextPageSchema,
});

export type ListDashboardsResponse = z.infer<
	typeof ListDashboardsResponseSchema
>;

// ── Registry ───────────────────────────────────────────────────────────────

export type DataboxEndpointInputs = {
	validateKey: ValidateKeyInput;
	listDataSources: ListDataSourcesInput;
	createDataSource: CreateDataSourceInput;
	getDataSource: GetDataSourceInput;
	deleteDataSource: DeleteDataSourceInput;
	listDatasets: ListDatasetsInput;
	createDataset: CreateDatasetInput;
	getDataset: GetDatasetInput;
	listDatasetData: ListDatasetDataInput;
	ingestDatasetData: IngestDatasetDataInput;
	getIngestion: GetIngestionInput;
	listMetrics: ListMetricsInput;
	getMetricData: GetMetricDataInput;
	listDashboards: ListDashboardsInput;
};

export type DataboxEndpointOutputs = {
	validateKey: ValidateKeyResponse;
	listDataSources: ListDataSourcesResponse;
	createDataSource: CreateDataSourceResponse;
	getDataSource: GetDataSourceResponse;
	deleteDataSource: DeleteDataSourceResponse;
	listDatasets: ListDatasetsResponse;
	createDataset: CreateDatasetResponse;
	getDataset: GetDatasetResponse;
	listDatasetData: ListDatasetDataResponse;
	ingestDatasetData: IngestDatasetDataResponse;
	getIngestion: GetIngestionResponse;
	listMetrics: ListMetricsResponse;
	getMetricData: GetMetricDataResponse;
	listDashboards: ListDashboardsResponse;
};

export const DataboxEndpointInputSchemas = {
	validateKey: ValidateKeyInputSchema,
	listDataSources: ListDataSourcesInputSchema,
	createDataSource: CreateDataSourceInputSchema,
	getDataSource: GetDataSourceInputSchema,
	deleteDataSource: DeleteDataSourceInputSchema,
	listDatasets: ListDatasetsInputSchema,
	createDataset: CreateDatasetInputSchema,
	getDataset: GetDatasetInputSchema,
	listDatasetData: ListDatasetDataInputSchema,
	ingestDatasetData: IngestDatasetDataInputSchema,
	getIngestion: GetIngestionInputSchema,
	listMetrics: ListMetricsInputSchema,
	getMetricData: GetMetricDataInputSchema,
	listDashboards: ListDashboardsInputSchema,
} as const;

export const DataboxEndpointOutputSchemas = {
	validateKey: ValidateKeyResponseSchema,
	listDataSources: ListDataSourcesResponseSchema,
	createDataSource: CreateDataSourceResponseSchema,
	getDataSource: GetDataSourceResponseSchema,
	deleteDataSource: DeleteDataSourceResponseSchema,
	listDatasets: ListDatasetsResponseSchema,
	createDataset: CreateDatasetResponseSchema,
	getDataset: GetDatasetResponseSchema,
	listDatasetData: ListDatasetDataResponseSchema,
	ingestDatasetData: IngestDatasetDataResponseSchema,
	getIngestion: GetIngestionResponseSchema,
	listMetrics: ListMetricsResponseSchema,
	getMetricData: GetMetricDataResponseSchema,
	listDashboards: ListDashboardsResponseSchema,
} as const;
