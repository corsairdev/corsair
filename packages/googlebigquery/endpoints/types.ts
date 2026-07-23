import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared BigQuery resource primitives (reused across domains)
// ─────────────────────────────────────────────────────────────────────────────

export const DatasetReferenceSchema = z.object({
	datasetId: z.string(),
	projectId: z.string().optional(),
});

export const TableReferenceSchema = z.object({
	projectId: z.string().optional(),
	datasetId: z.string(),
	tableId: z.string(),
});

export const RoutineReferenceSchema = z.object({
	projectId: z.string().optional(),
	datasetId: z.string(),
	routineId: z.string(),
});

export const ModelReferenceSchema = z.object({
	projectId: z.string().optional(),
	datasetId: z.string(),
	modelId: z.string(),
});

export const JobReferenceSchema = z.object({
	projectId: z.string().optional(),
	jobId: z.string().optional(),
	location: z.string().optional(),
});

export const ErrorProtoSchema = z.object({
	reason: z.string().optional(),
	location: z.string().optional(),
	debugInfo: z.string().optional(),
	message: z.string().optional(),
});

const TableFieldSchemaBase = z.object({
	name: z.string(),
	type: z.string(),
	mode: z.string().optional(),
	description: z.string().optional(),
	fields: z.array(z.unknown()).optional(),
});
export type TableFieldSchema = z.infer<typeof TableFieldSchemaBase> & {
	fields?: TableFieldSchema[];
};
// BigQuery table schema fields nest recursively for RECORD/STRUCT types.
export const TableFieldSchema: z.ZodType<TableFieldSchema> =
	TableFieldSchemaBase.extend({
		fields: z.lazy(() => z.array(TableFieldSchema)).optional(),
	});

export const TableSchemaSchema = z.object({
	fields: z.array(TableFieldSchema).optional(),
});

export const TableRowSchema = z.object({
	// Row cell values are heterogeneous (BigQuery's REST row encoding is
	// {v: value | {v: ...}[]}) and not worth fully modeling field-by-field.
	f: z.array(z.object({ v: z.unknown() })).optional(),
});

export const QueryParameterSchema = z.object({
	name: z.string().optional(),
	parameterType: z.object({
		type: z.string(),
		// Nested array element type is recursive (ARRAY of STRUCT, etc.);
		// BigQuery's REST shape is open-ended so we keep it unmodeled.
		arrayType: z.unknown().optional(),
		// Nested STRUCT field descriptors also recurse with open-ended types.
		structTypes: z.array(z.unknown()).optional(),
	}),
	parameterValue: z.object({
		// Scalar parameter values can be string | number | boolean | null
		// depending on the SQL type — not a single TS literal union in practice.
		value: z.unknown().optional(),
		// Nested array element values mirror parameterValue recursively.
		arrayValues: z.array(z.unknown()).optional(),
		// Nested STRUCT field values are keyed by field name with open-ended values.
		structValues: z.record(z.string(), z.unknown()).optional(),
	}),
});

// ─────────────────────────────────────────────────────────────────────────────
// queries domain (jobs.query / jobs.getQueryResults / jobs.insert / tabledata.insertAll
// / jobs.list / jobs.get / jobs.cancel / jobs.delete)
// ─────────────────────────────────────────────────────────────────────────────

const QueryInputSchema = z.object({
	projectId: z.string(),
	query: z.string(),
	maxResults: z.number().optional(),
	defaultDataset: DatasetReferenceSchema.optional(),
	timeoutMs: z.number().optional(),
	dryRun: z.boolean().optional(),
	useQueryCache: z.boolean().optional(),
	useLegacySql: z.boolean().optional(),
	parameterMode: z.enum(['POSITIONAL', 'NAMED']).optional(),
	queryParameters: z.array(QueryParameterSchema).optional(),
	location: z.string().optional(),
	maximumBytesBilled: z.string().optional(),
	requestId: z.string().optional(),
});
export type QueryInput = z.infer<typeof QueryInputSchema>;

const QueryResponseSchema = z.object({
	kind: z.string().optional(),
	schema: TableSchemaSchema.optional(),
	jobReference: JobReferenceSchema.optional(),
	totalRows: z.string().optional(),
	pageToken: z.string().optional(),
	rows: z.array(TableRowSchema).optional(),
	totalBytesProcessed: z.string().optional(),
	jobComplete: z.boolean().optional(),
	errors: z.array(ErrorProtoSchema).optional(),
	cacheHit: z.boolean().optional(),
	numDmlAffectedRows: z.string().optional(),
});
export type QueryResponse = z.infer<typeof QueryResponseSchema>;

const GetQueryResultsInputSchema = z.object({
	projectId: z.string(),
	jobId: z.string(),
	startIndex: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().optional(),
	timeoutMs: z.number().optional(),
	location: z.string().optional(),
});
export type GetQueryResultsInput = z.infer<typeof GetQueryResultsInputSchema>;

const GetQueryResultsResponseSchema = QueryResponseSchema.extend({
	etag: z.string().optional(),
});
export type GetQueryResultsResponse = z.infer<
	typeof GetQueryResultsResponseSchema
>;

const JobConfigurationQuerySchema = z.object({
	query: z.string(),
	destinationTable: TableReferenceSchema.optional(),
	createDisposition: z.enum(['CREATE_IF_NEEDED', 'CREATE_NEVER']).optional(),
	writeDisposition: z
		.enum(['WRITE_TRUNCATE', 'WRITE_APPEND', 'WRITE_EMPTY'])
		.optional(),
	defaultDataset: DatasetReferenceSchema.optional(),
	priority: z.enum(['INTERACTIVE', 'BATCH']).optional(),
	useLegacySql: z.boolean().optional(),
	useQueryCache: z.boolean().optional(),
	maximumBytesBilled: z.string().optional(),
	queryParameters: z.array(QueryParameterSchema).optional(),
	parameterMode: z.enum(['POSITIONAL', 'NAMED']).optional(),
});

const JobConfigurationLoadSchema = z.object({
	sourceUris: z.array(z.string()).optional(),
	destinationTable: TableReferenceSchema,
	schema: TableSchemaSchema.optional(),
	sourceFormat: z
		.enum([
			'CSV',
			'NEWLINE_DELIMITED_JSON',
			'AVRO',
			'PARQUET',
			'ORC',
			'DATASTORE_BACKUP',
		])
		.optional(),
	createDisposition: z.enum(['CREATE_IF_NEEDED', 'CREATE_NEVER']).optional(),
	writeDisposition: z
		.enum(['WRITE_TRUNCATE', 'WRITE_APPEND', 'WRITE_EMPTY'])
		.optional(),
	skipLeadingRows: z.number().optional(),
	autodetect: z.boolean().optional(),
	fieldDelimiter: z.string().optional(),
	encoding: z.enum(['UTF-8', 'ISO-8859-1']).optional(),
});

const JobConfigurationExtractSchema = z.object({
	sourceTable: TableReferenceSchema.optional(),
	destinationUris: z.array(z.string()).optional(),
	destinationFormat: z
		.enum(['CSV', 'NEWLINE_DELIMITED_JSON', 'AVRO', 'PARQUET'])
		.optional(),
	compression: z.enum(['NONE', 'GZIP', 'DEFLATE', 'SNAPPY']).optional(),
	fieldDelimiter: z.string().optional(),
});

const JobConfigurationCopySchema = z.object({
	sourceTable: TableReferenceSchema.optional(),
	sourceTables: z.array(TableReferenceSchema).optional(),
	destinationTable: TableReferenceSchema,
	createDisposition: z.enum(['CREATE_IF_NEEDED', 'CREATE_NEVER']).optional(),
	writeDisposition: z
		.enum(['WRITE_TRUNCATE', 'WRITE_APPEND', 'WRITE_EMPTY'])
		.optional(),
});

export const JobConfigurationSchema = z.object({
	jobType: z.enum(['QUERY', 'LOAD', 'EXTRACT', 'COPY']).optional(),
	query: JobConfigurationQuerySchema.optional(),
	load: JobConfigurationLoadSchema.optional(),
	extract: JobConfigurationExtractSchema.optional(),
	copy: JobConfigurationCopySchema.optional(),
	dryRun: z.boolean().optional(),
	jobTimeoutMs: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
});

export const JobStatusSchema = z.object({
	state: z.enum(['PENDING', 'RUNNING', 'DONE']).optional(),
	errorResult: ErrorProtoSchema.optional(),
	errors: z.array(ErrorProtoSchema).optional(),
});

export const JobSchema = z.object({
	id: z.string().optional(),
	kind: z.string().optional(),
	selfLink: z.string().optional(),
	etag: z.string().optional(),
	jobReference: JobReferenceSchema.optional(),
	configuration: JobConfigurationSchema.optional(),
	status: JobStatusSchema.optional(),
	// Statistics shape differs per job type (query/load/extract/copy) with dozens
	// of type-specific numeric fields; not worth modeling individually here.
	statistics: z.record(z.string(), z.unknown()).optional(),
	user_email: z.string().optional(),
});
export type Job = z.infer<typeof JobSchema>;

const InsertJobInputSchema = z.object({
	projectId: z.string(),
	jobReference: JobReferenceSchema.optional(),
	configuration: JobConfigurationSchema,
});
export type InsertJobInput = z.infer<typeof InsertJobInputSchema>;

const InsertJobWithUploadInputSchema = z.object({
	projectId: z.string(),
	jobReference: JobReferenceSchema.optional(),
	configuration: JobConfigurationSchema,
	/** Raw file contents to upload as the load job's source data. */
	fileContent: z.string(),
	fileName: z.string().optional(),
	contentType: z.string().optional(),
});
export type InsertJobWithUploadInput = z.infer<
	typeof InsertJobWithUploadInputSchema
>;

const InsertAllRowSchema = z.object({
	insertId: z.string().optional(),
	// Row payload shape is caller-defined (arbitrary column -> value map).
	json: z.record(z.string(), z.unknown()),
});

const InsertAllInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
	rows: z.array(InsertAllRowSchema),
	skipInvalidRows: z.boolean().optional(),
	ignoreUnknownValues: z.boolean().optional(),
	templateSuffix: z.string().optional(),
});
export type InsertAllInput = z.infer<typeof InsertAllInputSchema>;

const InsertAllResponseSchema = z.object({
	kind: z.string().optional(),
	insertErrors: z
		.array(
			z.object({
				index: z.number().optional(),
				errors: z.array(ErrorProtoSchema).optional(),
			}),
		)
		.optional(),
});
export type InsertAllResponse = z.infer<typeof InsertAllResponseSchema>;

const ListJobsInputSchema = z.object({
	projectId: z.string(),
	allUsers: z.boolean().optional(),
	maxResults: z.number().optional(),
	minCreationTime: z.string().optional(),
	maxCreationTime: z.string().optional(),
	pageToken: z.string().optional(),
	projection: z.enum(['full', 'minimal']).optional(),
	stateFilter: z.array(z.enum(['done', 'pending', 'running'])).optional(),
	parentJobId: z.string().optional(),
});
export type ListJobsInput = z.infer<typeof ListJobsInputSchema>;

const ListJobsResponseSchema = z.object({
	kind: z.string().optional(),
	etag: z.string().optional(),
	jobs: z.array(JobSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListJobsResponse = z.infer<typeof ListJobsResponseSchema>;

const GetJobInputSchema = z.object({
	projectId: z.string(),
	jobId: z.string(),
	location: z.string().optional(),
});
export type GetJobInput = z.infer<typeof GetJobInputSchema>;

const CancelJobInputSchema = z.object({
	projectId: z.string(),
	jobId: z.string(),
	location: z.string().optional(),
});
export type CancelJobInput = z.infer<typeof CancelJobInputSchema>;

const CancelJobResponseSchema = z.object({
	kind: z.string().optional(),
	job: JobSchema.optional(),
});
export type CancelJobResponse = z.infer<typeof CancelJobResponseSchema>;

const DeleteJobMetadataInputSchema = z.object({
	projectId: z.string(),
	jobId: z.string(),
	location: z.string().optional(),
});
export type DeleteJobMetadataInput = z.infer<
	typeof DeleteJobMetadataInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// datasets domain (datasets.list / .get / .insert / .update / .patch / .delete / .undelete)
// ─────────────────────────────────────────────────────────────────────────────

const DatasetAccessSchema = z.object({
	role: z.string().optional(),
	userByEmail: z.string().optional(),
	groupByEmail: z.string().optional(),
	domain: z.string().optional(),
	specialGroup: z.string().optional(),
	iamMember: z.string().optional(),
	view: TableReferenceSchema.optional(),
	routine: RoutineReferenceSchema.optional(),
	dataset: z
		.object({
			dataset: DatasetReferenceSchema,
			targetTypes: z.array(z.string()).optional(),
		})
		.optional(),
});

export const DatasetSchema = z.object({
	id: z.string().optional(),
	kind: z.string().optional(),
	etag: z.string().optional(),
	selfLink: z.string().optional(),
	datasetReference: DatasetReferenceSchema,
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	defaultTableExpirationMs: z.string().optional(),
	defaultPartitionExpirationMs: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	access: z.array(DatasetAccessSchema).optional(),
	location: z.string().optional(),
	maxTimeTravelHours: z.string().optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
});
export type Dataset = z.infer<typeof DatasetSchema>;

const ListDatasetsInputSchema = z.object({
	projectId: z.string(),
	all: z.boolean().optional(),
	filter: z.string().optional(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListDatasetsInput = z.infer<typeof ListDatasetsInputSchema>;

const ListDatasetsResponseSchema = z.object({
	kind: z.string().optional(),
	etag: z.string().optional(),
	datasets: z
		.array(
			z.object({
				kind: z.string().optional(),
				id: z.string().optional(),
				datasetReference: DatasetReferenceSchema,
				labels: z.record(z.string(), z.string()).optional(),
				friendlyName: z.string().optional(),
				location: z.string().optional(),
			}),
		)
		.optional(),
	nextPageToken: z.string().optional(),
});
export type ListDatasetsResponse = z.infer<typeof ListDatasetsResponseSchema>;

const GetDatasetInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	datasetView: z.enum(['FULL', 'METADATA', 'ACL']).optional(),
});
export type GetDatasetInput = z.infer<typeof GetDatasetInputSchema>;

const CreateDatasetInputSchema = z.object({
	projectId: z.string(),
	datasetReference: DatasetReferenceSchema,
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	defaultTableExpirationMs: z.string().optional(),
	defaultPartitionExpirationMs: z.string().optional(),
	access: z.array(DatasetAccessSchema).optional(),
});
export type CreateDatasetInput = z.infer<typeof CreateDatasetInputSchema>;

const UpdateDatasetInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	dataset: DatasetSchema,
});
export type UpdateDatasetInput = z.infer<typeof UpdateDatasetInputSchema>;

const PatchDatasetInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	dataset: DatasetSchema.partial({ datasetReference: true }),
});
export type PatchDatasetInput = z.infer<typeof PatchDatasetInputSchema>;

const DeleteDatasetInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	deleteContents: z.boolean().optional(),
});
export type DeleteDatasetInput = z.infer<typeof DeleteDatasetInputSchema>;

const UndeleteDatasetInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	deletionTime: z.string().optional(),
});
export type UndeleteDatasetInput = z.infer<typeof UndeleteDatasetInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// tables domain (tables.list / tabledata.list / tables.get / .insert / .update / .patch / .delete)
// ─────────────────────────────────────────────────────────────────────────────

const TimePartitioningSchema = z.object({
	type: z.enum(['DAY', 'HOUR', 'MONTH', 'YEAR']).optional(),
	expirationMs: z.string().optional(),
	field: z.string().optional(),
});

const ClusteringSchema = z.object({
	fields: z.array(z.string()).optional(),
});

const TableViewSchema = z.object({
	query: z.string().optional(),
	useLegacySql: z.boolean().optional(),
});

const ExternalDataConfigurationSchema = z.object({
	sourceUris: z.array(z.string()).optional(),
	sourceFormat: z.string().optional(),
	schema: TableSchemaSchema.optional(),
	autodetect: z.boolean().optional(),
});

export const TableResourceSchema = z.object({
	id: z.string().optional(),
	kind: z.string().optional(),
	etag: z.string().optional(),
	selfLink: z.string().optional(),
	tableReference: TableReferenceSchema,
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	schema: TableSchemaSchema.optional(),
	timePartitioning: TimePartitioningSchema.optional(),
	clustering: ClusteringSchema.optional(),
	view: TableViewSchema.optional(),
	externalDataConfiguration: ExternalDataConfigurationSchema.optional(),
	type: z.string().optional(),
	location: z.string().optional(),
	numRows: z.string().optional(),
	numBytes: z.string().optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	expirationTime: z.string().optional(),
});
export type TableResource = z.infer<typeof TableResourceSchema>;

const ListTablesInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListTablesInput = z.infer<typeof ListTablesInputSchema>;

const ListTablesResponseSchema = z.object({
	kind: z.string().optional(),
	etag: z.string().optional(),
	tables: z
		.array(
			z.object({
				kind: z.string().optional(),
				id: z.string().optional(),
				tableReference: TableReferenceSchema,
				friendlyName: z.string().optional(),
				type: z.string().optional(),
				creationTime: z.string().optional(),
				expirationTime: z.string().optional(),
				labels: z.record(z.string(), z.string()).optional(),
				view: TableViewSchema.optional(),
			}),
		)
		.optional(),
	nextPageToken: z.string().optional(),
	totalItems: z.number().optional(),
});
export type ListTablesResponse = z.infer<typeof ListTablesResponseSchema>;

const ListTableDataInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
	startIndex: z.string().optional(),
	selectedFields: z.string().optional(),
});
export type ListTableDataInput = z.infer<typeof ListTableDataInputSchema>;

const ListTableDataResponseSchema = z.object({
	kind: z.string().optional(),
	etag: z.string().optional(),
	totalRows: z.string().optional(),
	pageToken: z.string().optional(),
	rows: z.array(TableRowSchema).optional(),
});
export type ListTableDataResponse = z.infer<typeof ListTableDataResponseSchema>;

const GetTableSchemaInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
	selectedFields: z.string().optional(),
	view: z
		.enum(['TABLE_METADATA_VIEW_UNSPECIFIED', 'BASIC', 'STORAGE_STATS', 'FULL'])
		.optional(),
});
export type GetTableSchemaInput = z.infer<typeof GetTableSchemaInputSchema>;

const CreateTableInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableReference: TableReferenceSchema,
	schema: TableSchemaSchema.optional(),
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	timePartitioning: TimePartitioningSchema.optional(),
	clustering: ClusteringSchema.optional(),
	view: TableViewSchema.optional(),
	externalDataConfiguration: ExternalDataConfigurationSchema.optional(),
});
export type CreateTableInput = z.infer<typeof CreateTableInputSchema>;

const UpdateTableInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
	table: TableResourceSchema,
});
export type UpdateTableInput = z.infer<typeof UpdateTableInputSchema>;

const PatchTableInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
	table: TableResourceSchema.partial({ tableReference: true }),
});
export type PatchTableInput = z.infer<typeof PatchTableInputSchema>;

const DeleteTableInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
});
export type DeleteTableInput = z.infer<typeof DeleteTableInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// routines domain (routines.list / .get / .insert / .update / .delete)
// ─────────────────────────────────────────────────────────────────────────────

const RoutineArgumentSchema = z.object({
	name: z.string().optional(),
	argumentKind: z.enum(['FIXED_TYPE', 'ANY_TYPE']).optional(),
	mode: z.enum(['IN', 'OUT', 'INOUT']).optional(),
	// dataType is a recursively-structured StandardSqlDataType (arrays/structs nest
	// arbitrarily); not worth modeling field-by-field here.
	dataType: z.record(z.string(), z.unknown()).optional(),
});

export const RoutineSchema = z.object({
	etag: z.string().optional(),
	routineReference: RoutineReferenceSchema,
	routineType: z
		.enum([
			'SCALAR_FUNCTION',
			'PROCEDURE',
			'TABLE_VALUED_FUNCTION',
			'AGGREGATE_FUNCTION',
		])
		.optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	language: z.enum(['SQL', 'JAVASCRIPT', 'PYTHON', 'JAVA', 'SCALA']).optional(),
	arguments: z.array(RoutineArgumentSchema).optional(),
	returnType: z.record(z.string(), z.unknown()).optional(),
	importedLibraries: z.array(z.string()).optional(),
	definitionBody: z.string().optional(),
	description: z.string().optional(),
	determinismLevel: z
		.enum([
			'DETERMINISM_LEVEL_UNSPECIFIED',
			'DETERMINISTIC',
			'NOT_DETERMINISTIC',
		])
		.optional(),
});
export type Routine = z.infer<typeof RoutineSchema>;

const ListRoutinesInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
	filter: z.string().optional(),
	readMask: z.string().optional(),
});
export type ListRoutinesInput = z.infer<typeof ListRoutinesInputSchema>;

const ListRoutinesResponseSchema = z.object({
	routines: z.array(RoutineSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListRoutinesResponse = z.infer<typeof ListRoutinesResponseSchema>;

const GetRoutineInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	routineId: z.string(),
	readMask: z.string().optional(),
});
export type GetRoutineInput = z.infer<typeof GetRoutineInputSchema>;

const CreateRoutineInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	routineReference: RoutineReferenceSchema,
	routineType: z.enum([
		'SCALAR_FUNCTION',
		'PROCEDURE',
		'TABLE_VALUED_FUNCTION',
		'AGGREGATE_FUNCTION',
	]),
	definitionBody: z.string(),
	language: z.enum(['SQL', 'JAVASCRIPT', 'PYTHON', 'JAVA', 'SCALA']).optional(),
	arguments: z.array(RoutineArgumentSchema).optional(),
	returnType: z.record(z.string(), z.unknown()).optional(),
	description: z.string().optional(),
	determinismLevel: z
		.enum([
			'DETERMINISM_LEVEL_UNSPECIFIED',
			'DETERMINISTIC',
			'NOT_DETERMINISTIC',
		])
		.optional(),
});
export type CreateRoutineInput = z.infer<typeof CreateRoutineInputSchema>;

const UpdateRoutineInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	routineId: z.string(),
	routine: RoutineSchema,
});
export type UpdateRoutineInput = z.infer<typeof UpdateRoutineInputSchema>;

const DeleteRoutineInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	routineId: z.string(),
});
export type DeleteRoutineInput = z.infer<typeof DeleteRoutineInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// iam domain (table/routine/connection IAM policies, row access policies, data
// policies, service account) — spans the bigquery, connection, and dataPolicy hosts
// ─────────────────────────────────────────────────────────────────────────────

const IamConditionSchema = z.object({
	expression: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
});

const IamBindingSchema = z.object({
	role: z.string().optional(),
	members: z.array(z.string()).optional(),
	condition: IamConditionSchema.optional(),
});

export const IamPolicySchema = z.object({
	version: z.number().optional(),
	bindings: z.array(IamBindingSchema).optional(),
	etag: z.string().optional(),
});
export type IamPolicy = z.infer<typeof IamPolicySchema>;

const GetTableIamPolicyInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
	requestedPolicyVersion: z.number().optional(),
});
export type GetTableIamPolicyInput = z.infer<
	typeof GetTableIamPolicyInputSchema
>;

const GetRoutineIamPolicyInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	routineId: z.string(),
	requestedPolicyVersion: z.number().optional(),
});
export type GetRoutineIamPolicyInput = z.infer<
	typeof GetRoutineIamPolicyInputSchema
>;

const SetRoutineIamPolicyInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	routineId: z.string(),
	policy: IamPolicySchema,
	updateMask: z.string().optional(),
});
export type SetRoutineIamPolicyInput = z.infer<
	typeof SetRoutineIamPolicyInputSchema
>;

const TestRoutineIamPermissionsInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	routineId: z.string(),
	permissions: z.array(z.string()),
});
export type TestRoutineIamPermissionsInput = z.infer<
	typeof TestRoutineIamPermissionsInputSchema
>;

const TestIamPermissionsResponseSchema = z.object({
	permissions: z.array(z.string()).optional(),
});
export type TestIamPermissionsResponse = z.infer<
	typeof TestIamPermissionsResponseSchema
>;

const GetConnectionIamPolicyInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	connectionId: z.string(),
	requestedPolicyVersion: z.number().optional(),
});
export type GetConnectionIamPolicyInput = z.infer<
	typeof GetConnectionIamPolicyInputSchema
>;

const RowAccessPolicyReferenceSchema = z.object({
	projectId: z.string().optional(),
	datasetId: z.string().optional(),
	tableId: z.string().optional(),
	policyId: z.string().optional(),
});

const RowAccessPolicySchema = z.object({
	etag: z.string().optional(),
	rowAccessPolicyReference: RowAccessPolicyReferenceSchema.optional(),
	filterPredicate: z.string().optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
});

const ListRowAccessPoliciesInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	tableId: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListRowAccessPoliciesInput = z.infer<
	typeof ListRowAccessPoliciesInputSchema
>;

const ListRowAccessPoliciesResponseSchema = z.object({
	rowAccessPolicies: z.array(RowAccessPolicySchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListRowAccessPoliciesResponse = z.infer<
	typeof ListRowAccessPoliciesResponseSchema
>;

const DataMaskingPolicySchema = z.object({
	predefinedExpression: z.string().optional(),
});

const DataPolicySchema = z.object({
	name: z.string().optional(),
	dataPolicyId: z.string().optional(),
	policyTag: z.string().optional(),
	dataPolicyType: z
		.enum([
			'DATA_POLICY_TYPE_UNSPECIFIED',
			'COLUMN_LEVEL_SECURITY_POLICY',
			'DATA_MASKING_POLICY',
		])
		.optional(),
	dataMaskingPolicy: DataMaskingPolicySchema.optional(),
});
export type DataPolicy = z.infer<typeof DataPolicySchema>;

const CreateLocationsDatapoliciesInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	dataPolicyId: z.string(),
	policyTag: z.string().optional(),
	dataPolicyType: z
		.enum([
			'DATA_POLICY_TYPE_UNSPECIFIED',
			'COLUMN_LEVEL_SECURITY_POLICY',
			'DATA_MASKING_POLICY',
		])
		.optional(),
	dataMaskingPolicy: DataMaskingPolicySchema.optional(),
});
export type CreateLocationsDatapoliciesInput = z.infer<
	typeof CreateLocationsDatapoliciesInputSchema
>;

const ListLocationsDatapoliciesInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	filter: z.string().optional(),
});
export type ListLocationsDatapoliciesInput = z.infer<
	typeof ListLocationsDatapoliciesInputSchema
>;

const ListLocationsDatapoliciesResponseSchema = z.object({
	dataPolicies: z.array(DataPolicySchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListLocationsDatapoliciesResponse = z.infer<
	typeof ListLocationsDatapoliciesResponseSchema
>;

const GetServiceAccountInputSchema = z.object({
	projectId: z.string(),
});
export type GetServiceAccountInput = z.infer<
	typeof GetServiceAccountInputSchema
>;

const GetServiceAccountResponseSchema = z.object({
	kind: z.string().optional(),
	email: z.string().optional(),
});
export type GetServiceAccountResponse = z.infer<
	typeof GetServiceAccountResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// connections domain (bigqueryconnection.googleapis.com/v1 Connection resources)
// ─────────────────────────────────────────────────────────────────────────────

const CloudSqlPropertiesSchema = z.object({
	instanceId: z.string().optional(),
	database: z.string().optional(),
	type: z.enum(['DATABASE_TYPE_UNSPECIFIED', 'POSTGRES', 'MYSQL']).optional(),
	credential: z
		.object({
			username: z.string().optional(),
			password: z.string().optional(),
		})
		.optional(),
});

const CloudResourcePropertiesSchema = z.object({
	serviceAccountId: z.string().optional(),
});

const AwsPropertiesSchema = z.object({
	crossAccountRole: z.object({ iamRoleId: z.string().optional() }).optional(),
	accessRole: z.object({ iamRoleId: z.string().optional() }).optional(),
});

const AzurePropertiesSchema = z.object({
	application: z.string().optional(),
	clientId: z.string().optional(),
	objectId: z.string().optional(),
	customerTenantId: z.string().optional(),
});

export const ConnectionSchema = z.object({
	name: z.string().optional(),
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	hasCredential: z.boolean().optional(),
	cloudSql: CloudSqlPropertiesSchema.optional(),
	cloudResource: CloudResourcePropertiesSchema.optional(),
	aws: AwsPropertiesSchema.optional(),
	azure: AzurePropertiesSchema.optional(),
});
export type Connection = z.infer<typeof ConnectionSchema>;

const ListBigQueryConnectionsInputSchema = z.object({
	projectId: z.string(),
	/** Defaults to the "-" wildcard to aggregate connections across all locations. */
	location: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListBigQueryConnectionsInput = z.infer<
	typeof ListBigQueryConnectionsInputSchema
>;

const ListConnectionsResponseSchema = z.object({
	connections: z.array(ConnectionSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListConnectionsResponse = z.infer<
	typeof ListConnectionsResponseSchema
>;

const ListLocationsConnectionsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListLocationsConnectionsInput = z.infer<
	typeof ListLocationsConnectionsInputSchema
>;

const CreateConnectionInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	connectionId: z.string(),
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	cloudSql: CloudSqlPropertiesSchema.optional(),
	cloudResource: CloudResourcePropertiesSchema.optional(),
	aws: AwsPropertiesSchema.optional(),
	azure: AzurePropertiesSchema.optional(),
});
export type CreateConnectionInput = z.infer<typeof CreateConnectionInputSchema>;

const UpdateConnectionInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	connectionId: z.string(),
	updateMask: z.string().optional(),
	connection: ConnectionSchema,
});
export type UpdateConnectionInput = z.infer<typeof UpdateConnectionInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// reservations domain (bigqueryreservation.googleapis.com/v1)
// ─────────────────────────────────────────────────────────────────────────────

const AutoscaleSchema = z.object({
	currentSlots: z.string().optional(),
	maxSlots: z.string().optional(),
});

export const ReservationSchema = z.object({
	name: z.string().optional(),
	slotCapacity: z.string().optional(),
	ignoreIdleSlots: z.boolean().optional(),
	creationTime: z.string().optional(),
	updateTime: z.string().optional(),
	concurrency: z.string().optional(),
	edition: z
		.enum(['EDITION_UNSPECIFIED', 'STANDARD', 'ENTERPRISE', 'ENTERPRISE_PLUS'])
		.optional(),
	autoscale: AutoscaleSchema.optional(),
});
export type Reservation = z.infer<typeof ReservationSchema>;

const ListReservationsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	filter: z.string().optional(),
});
export type ListReservationsInput = z.infer<typeof ListReservationsInputSchema>;

const ListReservationsResponseSchema = z.object({
	reservations: z.array(ReservationSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListReservationsResponse = z.infer<
	typeof ListReservationsResponseSchema
>;

const CreateReservationInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	reservationId: z.string(),
	slotCapacity: z.string().optional(),
	ignoreIdleSlots: z.boolean().optional(),
	edition: z
		.enum(['EDITION_UNSPECIFIED', 'STANDARD', 'ENTERPRISE', 'ENTERPRISE_PLUS'])
		.optional(),
	autoscale: AutoscaleSchema.optional(),
});
export type CreateReservationInput = z.infer<
	typeof CreateReservationInputSchema
>;

const ListReservationGroupsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListReservationGroupsInput = z.infer<
	typeof ListReservationGroupsInputSchema
>;

const ListReservationGroupsResponseSchema = z.object({
	reservationGroups: z
		.array(z.object({ name: z.string().optional() }))
		.optional(),
	nextPageToken: z.string().optional(),
});
export type ListReservationGroupsResponse = z.infer<
	typeof ListReservationGroupsResponseSchema
>;

const AssignmentSchema = z.object({
	name: z.string().optional(),
	assignee: z.string().optional(),
	jobType: z
		.enum([
			'JOB_TYPE_UNSPECIFIED',
			'PIPELINE',
			'QUERY',
			'ML_EXTERNAL',
			'BACKGROUND',
			'CONTINUOUS',
		])
		.optional(),
	state: z.enum(['STATE_UNSPECIFIED', 'PENDING', 'ACTIVE']).optional(),
});
export type Assignment = z.infer<typeof AssignmentSchema>;

const ListReservationAssignmentsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	reservationId: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListReservationAssignmentsInput = z.infer<
	typeof ListReservationAssignmentsInputSchema
>;

const ListReservationAssignmentsResponseSchema = z.object({
	assignments: z.array(AssignmentSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListReservationAssignmentsResponse = z.infer<
	typeof ListReservationAssignmentsResponseSchema
>;

const CreateReservationAssignmentInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	reservationId: z.string(),
	assignee: z.string(),
	jobType: z.enum([
		'JOB_TYPE_UNSPECIFIED',
		'PIPELINE',
		'QUERY',
		'ML_EXTERNAL',
		'BACKGROUND',
		'CONTINUOUS',
	]),
});
export type CreateReservationAssignmentInput = z.infer<
	typeof CreateReservationAssignmentInputSchema
>;

const SearchAllAssignmentsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	query: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type SearchAllAssignmentsInput = z.infer<
	typeof SearchAllAssignmentsInputSchema
>;

const SearchAllAssignmentsResponseSchema = z.object({
	assignments: z.array(AssignmentSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type SearchAllAssignmentsResponse = z.infer<
	typeof SearchAllAssignmentsResponseSchema
>;

const CapacityCommitmentSchema = z.object({
	name: z.string().optional(),
	slotCount: z.string().optional(),
	plan: z
		.enum([
			'COMMITMENT_PLAN_UNSPECIFIED',
			'FLEX',
			'FLEX_FLAT_RATE',
			'MONTHLY',
			'ANNUAL',
			'THREE_YEAR',
		])
		.optional(),
	state: z
		.enum(['STATE_UNSPECIFIED', 'PENDING', 'ACTIVE', 'FAILED'])
		.optional(),
	commitmentEndTime: z.string().optional(),
	renewalPlan: z
		.enum([
			'COMMITMENT_PLAN_UNSPECIFIED',
			'FLEX',
			'FLEX_FLAT_RATE',
			'MONTHLY',
			'ANNUAL',
			'THREE_YEAR',
			'NONE',
		])
		.optional(),
});
export type CapacityCommitment = z.infer<typeof CapacityCommitmentSchema>;

const ListCapacityCommitmentsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListCapacityCommitmentsInput = z.infer<
	typeof ListCapacityCommitmentsInputSchema
>;

const ListCapacityCommitmentsResponseSchema = z.object({
	capacityCommitments: z.array(CapacityCommitmentSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListCapacityCommitmentsResponse = z.infer<
	typeof ListCapacityCommitmentsResponseSchema
>;

const CreateCapacityCommitmentInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	slotCount: z.string(),
	plan: z.enum([
		'COMMITMENT_PLAN_UNSPECIFIED',
		'FLEX',
		'FLEX_FLAT_RATE',
		'MONTHLY',
		'ANNUAL',
		'THREE_YEAR',
	]),
	renewalPlan: z
		.enum([
			'COMMITMENT_PLAN_UNSPECIFIED',
			'FLEX',
			'FLEX_FLAT_RATE',
			'MONTHLY',
			'ANNUAL',
			'THREE_YEAR',
			'NONE',
		])
		.optional(),
	enforceSingleAdminProjectPerOrg: z.boolean().optional(),
});
export type CreateCapacityCommitmentInput = z.infer<
	typeof CreateCapacityCommitmentInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// analyticsHub domain (analyticshub.googleapis.com/v1 — data exchanges & listings)
// ─────────────────────────────────────────────────────────────────────────────

const BigQueryDatasetSourceSchema = z.object({
	dataset: z.string().optional(),
	selectedResources: z
		.array(
			z.object({ table: z.string().optional(), view: z.string().optional() }),
		)
		.optional(),
});

export const ListingSchema = z.object({
	name: z.string().optional(),
	displayName: z.string().optional(),
	description: z.string().optional(),
	primaryContact: z.string().optional(),
	documentation: z.string().optional(),
	state: z.enum(['STATE_UNSPECIFIED', 'ACTIVE']).optional(),
	categories: z.array(z.string()).optional(),
	bigqueryDataset: BigQueryDatasetSourceSchema.optional(),
});
export type Listing = z.infer<typeof ListingSchema>;

export const DataExchangeSchema = z.object({
	name: z.string().optional(),
	displayName: z.string().optional(),
	description: z.string().optional(),
	primaryContact: z.string().optional(),
	documentation: z.string().optional(),
	listingCount: z.number().optional(),
});
export type DataExchange = z.infer<typeof DataExchangeSchema>;

const ListAnalyticsHubListingsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	dataExchangeId: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListAnalyticsHubListingsInput = z.infer<
	typeof ListAnalyticsHubListingsInputSchema
>;

const ListListingsResponseSchema = z.object({
	listings: z.array(ListingSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListListingsResponse = z.infer<typeof ListListingsResponseSchema>;

const ListDataexchangesListingsInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListDataexchangesListingsInput = z.infer<
	typeof ListDataexchangesListingsInputSchema
>;

const ListDataExchangesResponseSchema = z.object({
	dataExchanges: z.array(DataExchangeSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListDataExchangesResponse = z.infer<
	typeof ListDataExchangesResponseSchema
>;

const CreateListingInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	dataExchangeId: z.string(),
	listingId: z.string(),
	displayName: z.string(),
	description: z.string().optional(),
	primaryContact: z.string().optional(),
	bigqueryDataset: BigQueryDatasetSourceSchema.optional(),
});
export type CreateListingInput = z.infer<typeof CreateListingInputSchema>;

const CreateDataExchangeInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	dataExchangeId: z.string(),
	displayName: z.string(),
	description: z.string().optional(),
	primaryContact: z.string().optional(),
	documentation: z.string().optional(),
});
export type CreateDataExchangeInput = z.infer<
	typeof CreateDataExchangeInputSchema
>;

const ListOrganizationDataExchangesInputSchema = z.object({
	organizationId: z.string(),
	location: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListOrganizationDataExchangesInput = z.infer<
	typeof ListOrganizationDataExchangesInputSchema
>;

// Analytics Hub "query templates" (data exchange query galleries) is a newer,
// sparsely-documented surface; the exact resource shape isn't publicly finalized,
// so the response body is left as an untyped fallback here.
const ListQueryTemplatesInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	dataExchangeId: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListQueryTemplatesInput = z.infer<
	typeof ListQueryTemplatesInputSchema
>;

const ListQueryTemplatesResponseSchema = z.object({
	queryTemplates: z.array(z.record(z.string(), z.unknown())).optional(),
	nextPageToken: z.string().optional(),
});
export type ListQueryTemplatesResponse = z.infer<
	typeof ListQueryTemplatesResponseSchema
>;

const CreateQueryTemplateInputSchema = z.object({
	projectId: z.string(),
	location: z.string(),
	dataExchangeId: z.string(),
	displayName: z.string(),
	query: z.string(),
	description: z.string().optional(),
});
export type CreateQueryTemplateInput = z.infer<
	typeof CreateQueryTemplateInputSchema
>;

// Shape not publicly finalized (see note above) — passthrough record.
const QueryTemplateResponseSchema = z.record(z.string(), z.unknown());
export type QueryTemplateResponse = z.infer<typeof QueryTemplateResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ml domain (BigQuery ML models, plus locations/projects listing)
// ─────────────────────────────────────────────────────────────────────────────

const StandardSqlFieldSchema = z.object({
	name: z.string().optional(),
	type: z.record(z.string(), z.unknown()).optional(),
});

export const BigQueryModelSchema = z.object({
	etag: z.string().optional(),
	modelReference: ModelReferenceSchema,
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	description: z.string().optional(),
	friendlyName: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	expirationTime: z.string().optional(),
	location: z.string().optional(),
	modelType: z.string().optional(),
	featureColumns: z.array(StandardSqlFieldSchema).optional(),
	labelColumns: z.array(StandardSqlFieldSchema).optional(),
	// Training run metrics differ per model type (regression vs classification vs
	// time-series) with dozens of type-specific fields; not modeled individually.
	trainingRuns: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type BigQueryModel = z.infer<typeof BigQueryModelSchema>;

const ListModelsInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;

const ListModelsResponseSchema = z.object({
	models: z.array(BigQueryModelSchema).optional(),
	nextPageToken: z.string().optional(),
});
export type ListModelsResponse = z.infer<typeof ListModelsResponseSchema>;

const GetBigqueryModelInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	modelId: z.string(),
});
export type GetBigqueryModelInput = z.infer<typeof GetBigqueryModelInputSchema>;

const PatchModelInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	modelId: z.string(),
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	expirationTime: z.string().optional(),
});
export type PatchModelInput = z.infer<typeof PatchModelInputSchema>;

const DeleteModelInputSchema = z.object({
	projectId: z.string(),
	datasetId: z.string(),
	modelId: z.string(),
});
export type DeleteModelInput = z.infer<typeof DeleteModelInputSchema>;

const ListLocationsInputSchema = z.object({
	projectId: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	filter: z.string().optional(),
});
export type ListLocationsInput = z.infer<typeof ListLocationsInputSchema>;

const ListLocationsResponseSchema = z.object({
	locations: z
		.array(
			z.object({
				name: z.string().optional(),
				locationId: z.string().optional(),
				displayName: z.string().optional(),
			}),
		)
		.optional(),
	nextPageToken: z.string().optional(),
});
export type ListLocationsResponse = z.infer<typeof ListLocationsResponseSchema>;

const ListProjectsInputSchema = z.object({
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;

const ListProjectsResponseSchema = z.object({
	kind: z.string().optional(),
	etag: z.string().optional(),
	projects: z
		.array(
			z.object({
				kind: z.string().optional(),
				id: z.string().optional(),
				numericId: z.string().optional(),
				projectReference: z
					.object({ projectId: z.string().optional() })
					.optional(),
				friendlyName: z.string().optional(),
			}),
		)
		.optional(),
	nextPageToken: z.string().optional(),
	totalItems: z.number().optional(),
});
export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint input/output type maps + schema registries
// ─────────────────────────────────────────────────────────────────────────────

export type GoogleBigqueryEndpointInputs = {
	queriesQuery: QueryInput;
	queriesGetQueryResults: GetQueryResultsInput;
	queriesInsertJob: InsertJobInput;
	queriesInsertJobWithUpload: InsertJobWithUploadInput;
	queriesInsertAll: InsertAllInput;
	queriesListJobs: ListJobsInput;
	queriesGetJob: GetJobInput;
	queriesCancelJob: CancelJobInput;
	queriesDeleteJobMetadata: DeleteJobMetadataInput;
	datasetsList: ListDatasetsInput;
	datasetsGet: GetDatasetInput;
	datasetsCreate: CreateDatasetInput;
	datasetsUpdate: UpdateDatasetInput;
	datasetsPatch: PatchDatasetInput;
	datasetsDelete: DeleteDatasetInput;
	datasetsUndelete: UndeleteDatasetInput;
	tablesList: ListTablesInput;
	tablesListTableData: ListTableDataInput;
	tablesGetSchema: GetTableSchemaInput;
	tablesCreate: CreateTableInput;
	tablesUpdate: UpdateTableInput;
	tablesPatch: PatchTableInput;
	tablesDelete: DeleteTableInput;
	routinesList: ListRoutinesInput;
	routinesGet: GetRoutineInput;
	routinesCreate: CreateRoutineInput;
	routinesUpdate: UpdateRoutineInput;
	routinesDelete: DeleteRoutineInput;
	iamGetTableIamPolicy: GetTableIamPolicyInput;
	iamGetRoutineIamPolicy: GetRoutineIamPolicyInput;
	iamSetRoutineIamPolicy: SetRoutineIamPolicyInput;
	iamTestRoutineIamPermissions: TestRoutineIamPermissionsInput;
	iamGetConnectionIamPolicy: GetConnectionIamPolicyInput;
	iamListRowAccessPolicies: ListRowAccessPoliciesInput;
	iamCreateLocationsDatapolicies: CreateLocationsDatapoliciesInput;
	iamListLocationsDatapolicies: ListLocationsDatapoliciesInput;
	iamGetServiceAccount: GetServiceAccountInput;
	connectionsListBigQueryConnections: ListBigQueryConnectionsInput;
	connectionsListLocationsConnections: ListLocationsConnectionsInput;
	connectionsCreate: CreateConnectionInput;
	connectionsUpdate: UpdateConnectionInput;
	reservationsList: ListReservationsInput;
	reservationsCreate: CreateReservationInput;
	reservationsListGroups: ListReservationGroupsInput;
	reservationsListAssignments: ListReservationAssignmentsInput;
	reservationsCreateAssignment: CreateReservationAssignmentInput;
	reservationsSearchAllAssignments: SearchAllAssignmentsInput;
	reservationsListCapacityCommitments: ListCapacityCommitmentsInput;
	reservationsCreateCapacityCommitment: CreateCapacityCommitmentInput;
	analyticsHubListListings: ListAnalyticsHubListingsInput;
	analyticsHubListDataexchangesListings: ListDataexchangesListingsInput;
	analyticsHubCreateListing: CreateListingInput;
	analyticsHubCreateDataExchange: CreateDataExchangeInput;
	analyticsHubListOrganizationDataExchanges: ListOrganizationDataExchangesInput;
	analyticsHubListQueryTemplates: ListQueryTemplatesInput;
	analyticsHubCreateQueryTemplate: CreateQueryTemplateInput;
	mlListModels: ListModelsInput;
	mlGetBigqueryModel: GetBigqueryModelInput;
	mlPatchModel: PatchModelInput;
	mlDeleteModel: DeleteModelInput;
	mlListLocations: ListLocationsInput;
	mlListProjects: ListProjectsInput;
};

export type GoogleBigqueryEndpointOutputs = {
	queriesQuery: QueryResponse;
	queriesGetQueryResults: GetQueryResultsResponse;
	queriesInsertJob: Job;
	queriesInsertJobWithUpload: Job;
	queriesInsertAll: InsertAllResponse;
	queriesListJobs: ListJobsResponse;
	queriesGetJob: Job;
	queriesCancelJob: CancelJobResponse;
	queriesDeleteJobMetadata: void;
	datasetsList: ListDatasetsResponse;
	datasetsGet: Dataset;
	datasetsCreate: Dataset;
	datasetsUpdate: Dataset;
	datasetsPatch: Dataset;
	datasetsDelete: void;
	datasetsUndelete: Dataset;
	tablesList: ListTablesResponse;
	tablesListTableData: ListTableDataResponse;
	tablesGetSchema: TableResource;
	tablesCreate: TableResource;
	tablesUpdate: TableResource;
	tablesPatch: TableResource;
	tablesDelete: void;
	routinesList: ListRoutinesResponse;
	routinesGet: Routine;
	routinesCreate: Routine;
	routinesUpdate: Routine;
	routinesDelete: void;
	iamGetTableIamPolicy: IamPolicy;
	iamGetRoutineIamPolicy: IamPolicy;
	iamSetRoutineIamPolicy: IamPolicy;
	iamTestRoutineIamPermissions: TestIamPermissionsResponse;
	iamGetConnectionIamPolicy: IamPolicy;
	iamListRowAccessPolicies: ListRowAccessPoliciesResponse;
	iamCreateLocationsDatapolicies: DataPolicy;
	iamListLocationsDatapolicies: ListLocationsDatapoliciesResponse;
	iamGetServiceAccount: GetServiceAccountResponse;
	connectionsListBigQueryConnections: ListConnectionsResponse;
	connectionsListLocationsConnections: ListConnectionsResponse;
	connectionsCreate: Connection;
	connectionsUpdate: Connection;
	reservationsList: ListReservationsResponse;
	reservationsCreate: Reservation;
	reservationsListGroups: ListReservationGroupsResponse;
	reservationsListAssignments: ListReservationAssignmentsResponse;
	reservationsCreateAssignment: Assignment;
	reservationsSearchAllAssignments: SearchAllAssignmentsResponse;
	reservationsListCapacityCommitments: ListCapacityCommitmentsResponse;
	reservationsCreateCapacityCommitment: CapacityCommitment;
	analyticsHubListListings: ListListingsResponse;
	analyticsHubListDataexchangesListings: ListDataExchangesResponse;
	analyticsHubCreateListing: Listing;
	analyticsHubCreateDataExchange: DataExchange;
	analyticsHubListOrganizationDataExchanges: ListDataExchangesResponse;
	analyticsHubListQueryTemplates: ListQueryTemplatesResponse;
	analyticsHubCreateQueryTemplate: QueryTemplateResponse;
	mlListModels: ListModelsResponse;
	mlGetBigqueryModel: BigQueryModel;
	mlPatchModel: BigQueryModel;
	mlDeleteModel: void;
	mlListLocations: ListLocationsResponse;
	mlListProjects: ListProjectsResponse;
};

export const GoogleBigqueryEndpointInputSchemas = {
	queriesQuery: QueryInputSchema,
	queriesGetQueryResults: GetQueryResultsInputSchema,
	queriesInsertJob: InsertJobInputSchema,
	queriesInsertJobWithUpload: InsertJobWithUploadInputSchema,
	queriesInsertAll: InsertAllInputSchema,
	queriesListJobs: ListJobsInputSchema,
	queriesGetJob: GetJobInputSchema,
	queriesCancelJob: CancelJobInputSchema,
	queriesDeleteJobMetadata: DeleteJobMetadataInputSchema,
	datasetsList: ListDatasetsInputSchema,
	datasetsGet: GetDatasetInputSchema,
	datasetsCreate: CreateDatasetInputSchema,
	datasetsUpdate: UpdateDatasetInputSchema,
	datasetsPatch: PatchDatasetInputSchema,
	datasetsDelete: DeleteDatasetInputSchema,
	datasetsUndelete: UndeleteDatasetInputSchema,
	tablesList: ListTablesInputSchema,
	tablesListTableData: ListTableDataInputSchema,
	tablesGetSchema: GetTableSchemaInputSchema,
	tablesCreate: CreateTableInputSchema,
	tablesUpdate: UpdateTableInputSchema,
	tablesPatch: PatchTableInputSchema,
	tablesDelete: DeleteTableInputSchema,
	routinesList: ListRoutinesInputSchema,
	routinesGet: GetRoutineInputSchema,
	routinesCreate: CreateRoutineInputSchema,
	routinesUpdate: UpdateRoutineInputSchema,
	routinesDelete: DeleteRoutineInputSchema,
	iamGetTableIamPolicy: GetTableIamPolicyInputSchema,
	iamGetRoutineIamPolicy: GetRoutineIamPolicyInputSchema,
	iamSetRoutineIamPolicy: SetRoutineIamPolicyInputSchema,
	iamTestRoutineIamPermissions: TestRoutineIamPermissionsInputSchema,
	iamGetConnectionIamPolicy: GetConnectionIamPolicyInputSchema,
	iamListRowAccessPolicies: ListRowAccessPoliciesInputSchema,
	iamCreateLocationsDatapolicies: CreateLocationsDatapoliciesInputSchema,
	iamListLocationsDatapolicies: ListLocationsDatapoliciesInputSchema,
	iamGetServiceAccount: GetServiceAccountInputSchema,
	connectionsListBigQueryConnections: ListBigQueryConnectionsInputSchema,
	connectionsListLocationsConnections: ListLocationsConnectionsInputSchema,
	connectionsCreate: CreateConnectionInputSchema,
	connectionsUpdate: UpdateConnectionInputSchema,
	reservationsList: ListReservationsInputSchema,
	reservationsCreate: CreateReservationInputSchema,
	reservationsListGroups: ListReservationGroupsInputSchema,
	reservationsListAssignments: ListReservationAssignmentsInputSchema,
	reservationsCreateAssignment: CreateReservationAssignmentInputSchema,
	reservationsSearchAllAssignments: SearchAllAssignmentsInputSchema,
	reservationsListCapacityCommitments: ListCapacityCommitmentsInputSchema,
	reservationsCreateCapacityCommitment: CreateCapacityCommitmentInputSchema,
	analyticsHubListListings: ListAnalyticsHubListingsInputSchema,
	analyticsHubListDataexchangesListings: ListDataexchangesListingsInputSchema,
	analyticsHubCreateListing: CreateListingInputSchema,
	analyticsHubCreateDataExchange: CreateDataExchangeInputSchema,
	analyticsHubListOrganizationDataExchanges:
		ListOrganizationDataExchangesInputSchema,
	analyticsHubListQueryTemplates: ListQueryTemplatesInputSchema,
	analyticsHubCreateQueryTemplate: CreateQueryTemplateInputSchema,
	mlListModels: ListModelsInputSchema,
	mlGetBigqueryModel: GetBigqueryModelInputSchema,
	mlPatchModel: PatchModelInputSchema,
	mlDeleteModel: DeleteModelInputSchema,
	mlListLocations: ListLocationsInputSchema,
	mlListProjects: ListProjectsInputSchema,
} as const;

export const GoogleBigqueryEndpointOutputSchemas = {
	queriesQuery: QueryResponseSchema,
	queriesGetQueryResults: GetQueryResultsResponseSchema,
	queriesInsertJob: JobSchema,
	queriesInsertJobWithUpload: JobSchema,
	queriesInsertAll: InsertAllResponseSchema,
	queriesListJobs: ListJobsResponseSchema,
	queriesGetJob: JobSchema,
	queriesCancelJob: CancelJobResponseSchema,
	queriesDeleteJobMetadata: z.void(),
	datasetsList: ListDatasetsResponseSchema,
	datasetsGet: DatasetSchema,
	datasetsCreate: DatasetSchema,
	datasetsUpdate: DatasetSchema,
	datasetsPatch: DatasetSchema,
	datasetsDelete: z.void(),
	datasetsUndelete: DatasetSchema,
	tablesList: ListTablesResponseSchema,
	tablesListTableData: ListTableDataResponseSchema,
	tablesGetSchema: TableResourceSchema,
	tablesCreate: TableResourceSchema,
	tablesUpdate: TableResourceSchema,
	tablesPatch: TableResourceSchema,
	tablesDelete: z.void(),
	routinesList: ListRoutinesResponseSchema,
	routinesGet: RoutineSchema,
	routinesCreate: RoutineSchema,
	routinesUpdate: RoutineSchema,
	routinesDelete: z.void(),
	iamGetTableIamPolicy: IamPolicySchema,
	iamGetRoutineIamPolicy: IamPolicySchema,
	iamSetRoutineIamPolicy: IamPolicySchema,
	iamTestRoutineIamPermissions: TestIamPermissionsResponseSchema,
	iamGetConnectionIamPolicy: IamPolicySchema,
	iamListRowAccessPolicies: ListRowAccessPoliciesResponseSchema,
	iamCreateLocationsDatapolicies: DataPolicySchema,
	iamListLocationsDatapolicies: ListLocationsDatapoliciesResponseSchema,
	iamGetServiceAccount: GetServiceAccountResponseSchema,
	connectionsListBigQueryConnections: ListConnectionsResponseSchema,
	connectionsListLocationsConnections: ListConnectionsResponseSchema,
	connectionsCreate: ConnectionSchema,
	connectionsUpdate: ConnectionSchema,
	reservationsList: ListReservationsResponseSchema,
	reservationsCreate: ReservationSchema,
	reservationsListGroups: ListReservationGroupsResponseSchema,
	reservationsListAssignments: ListReservationAssignmentsResponseSchema,
	reservationsCreateAssignment: AssignmentSchema,
	reservationsSearchAllAssignments: SearchAllAssignmentsResponseSchema,
	reservationsListCapacityCommitments: ListCapacityCommitmentsResponseSchema,
	reservationsCreateCapacityCommitment: CapacityCommitmentSchema,
	analyticsHubListListings: ListListingsResponseSchema,
	analyticsHubListDataexchangesListings: ListDataExchangesResponseSchema,
	analyticsHubCreateListing: ListingSchema,
	analyticsHubCreateDataExchange: DataExchangeSchema,
	analyticsHubListOrganizationDataExchanges: ListDataExchangesResponseSchema,
	analyticsHubListQueryTemplates: ListQueryTemplatesResponseSchema,
	analyticsHubCreateQueryTemplate: QueryTemplateResponseSchema,
	mlListModels: ListModelsResponseSchema,
	mlGetBigqueryModel: BigQueryModelSchema,
	mlPatchModel: BigQueryModelSchema,
	mlDeleteModel: z.void(),
	mlListLocations: ListLocationsResponseSchema,
	mlListProjects: ListProjectsResponseSchema,
} as const;
