import { z } from 'zod';

// Shapes follow the Snowflake SQL API OpenAPI 2.0.0
// (snowflakedb/snowflake-rest-api-specs specifications/sqlapi.yaml) and the
// reference at https://docs.snowflake.com/en/developer-guide/sql-api/reference.
// Outputs stay loose so a field Snowflake adds later still parses.

// Snowflake's own examples are 8-4-4-4-12 hex and fail a strict RFC 4122 check:
// the statement handle 019c06a4-0000-df4f-0000-00100006589e has variant nibble
// 0, and request id ea7b46ed-bdc1-8c32-d593-764fcad64e83 has version nibble 8.
const UuidShape = z
	.string()
	.regex(
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
		'Expected a UUID-shaped id (8-4-4-4-12 hex)',
	);

const NonEmpty = z.string().min(1);

// https://docs.snowflake.com/en/developer-guide/sql-api/submitting-requests
const BindingSchema = z
	.object({
		type: z.enum([
			'FIXED',
			'REAL',
			'DECFLOAT',
			'TEXT',
			'BINARY',
			'BOOLEAN',
			'DATE',
			'TIME',
			'TIMESTAMP_TZ',
			'TIMESTAMP_LTZ',
			'TIMESTAMP_NTZ',
		]),
		value: z.string(),
	})
	.strict();

// OpenAPI declares multi_statement_count an integer. The multi-statement
// guide also sends a decimal string ("2"). Negatives are rejected.
const MultiStatementCountSchema = z.union([
	z.number().int().min(0),
	z.string().regex(/^(0|[1-9]\d*)$/),
]);

// The reference lists three session parameters the OpenAPI file omits:
// client_result_chunk_size, rows_per_resultset, and use_cached_result.
const ParametersSchema = z
	.object({
		timezone: NonEmpty.optional(),
		query_tag: NonEmpty.optional(),
		binary_output_format: NonEmpty.optional(),
		date_output_format: NonEmpty.optional(),
		time_output_format: NonEmpty.optional(),
		timestamp_output_format: NonEmpty.optional(),
		timestamp_ltz_output_format: NonEmpty.optional(),
		timestamp_ntz_output_format: NonEmpty.optional(),
		timestamp_tz_output_format: NonEmpty.optional(),
		multi_statement_count: MultiStatementCountSchema.optional(),
		client_result_chunk_size: z.number().int().min(16).max(160).optional(),
		rows_per_resultset: z.number().int().min(0).optional(),
		use_cached_result: NonEmpty.optional(),
	})
	.strict();

// OpenAPI says timeout's maximum is 604800 seconds, and 0 means that maximum.
const TimeoutSchema = z.number().int().min(0).max(604800);

function retryNeedsRequestId(value: {
	retry?: boolean;
	requestId?: string;
}): boolean {
	return value.retry !== true || value.requestId !== undefined;
}

const retryIssue = {
	message:
		'retry=true requires requestId so Snowflake can match the original request',
	path: ['retry'],
};

export const SubmitStatementInputSchema = z
	.object({
		requestId: UuidShape.optional().describe(
			'UUID-shaped request ID (8-4-4-4-12 hex).',
		),
		async: z
			.boolean()
			.optional()
			.describe('Return the handle immediately when true.'),
		nullable: z
			.boolean()
			.optional()
			.describe('`false` returns SQL NULL as the string `"null"`.'),
		retry: z
			.boolean()
			.optional()
			.describe(
				'Requires `requestId`. Set `true` with the `requestId` of the original request to resubmit it; Snowflake does not run it twice. A new `requestId` runs the statement again.',
			),
		statement: z.string().min(1),
		timeout: TimeoutSchema.optional(),
		database: NonEmpty.optional(),
		schema: NonEmpty.optional(),
		warehouse: NonEmpty.optional(),
		role: NonEmpty.optional(),
		bindings: z.record(z.string().min(1), BindingSchema).optional(),
		parameters: ParametersSchema.optional(),
	})
	.strict()
	.refine(retryNeedsRequestId, retryIssue);

export type SubmitStatementInput = z.infer<typeof SubmitStatementInputSchema>;

export const GetStatementInputSchema = z
	.object({
		statementHandle: UuidShape.describe('UUID-shaped handle (8-4-4-4-12 hex).'),
		requestId: UuidShape.optional().describe(
			'UUID-shaped request ID (8-4-4-4-12 hex).',
		),
		partition: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Partition index, starting at 0.'),
		retry: z.boolean().optional().describe('Requires `requestId`.'),
	})
	.strict()
	.refine(retryNeedsRequestId, retryIssue);

export type GetStatementInput = z.infer<typeof GetStatementInputSchema>;

export const CancelStatementInputSchema = z
	.object({
		statementHandle: UuidShape.describe('UUID-shaped handle (8-4-4-4-12 hex).'),
		requestId: UuidShape.optional().describe(
			'UUID-shaped request ID (8-4-4-4-12 hex).',
		),
		retry: z.boolean().optional().describe('Requires `requestId`.'),
	})
	.strict()
	.refine(retryNeedsRequestId, retryIssue);

export type CancelStatementInput = z.infer<typeof CancelStatementInputSchema>;

const RowTypeSchema = z
	.object({
		name: z.string().optional(),
		type: z.string().optional(),
		length: z.number().int().nullish(),
		precision: z.number().int().nullish(),
		scale: z.number().int().nullish(),
		nullable: z.boolean().optional(),
	})
	.loose();

const PartitionInfoSchema = z
	.object({
		rowCount: z.number().int().optional(),
		uncompressedSize: z.number().int().optional(),
		compressedSize: z.number().int().optional(),
	})
	.loose();

const ResultSetMetaDataSchema = z
	.object({
		format: z.string().optional(),
		numRows: z.number().int().optional(),
		rowType: z.array(RowTypeSchema).optional(),
		partitionInfo: z.array(PartitionInfoSchema).optional(),
	})
	.loose();

const StatsSchema = z
	.object({
		numRowsInserted: z.number().int().optional(),
		numRowsUpdated: z.number().int().optional(),
		numRowsDeleted: z.number().int().optional(),
		numDuplicateRowsUpdated: z.number().int().optional(),
	})
	.loose();

// 200 ResultSet and 202 QueryStatus share statementHandle. `data` is present
// on a finished result (and may be empty) and absent while the statement runs.
export const StatementResultSchema = z
	.object({
		code: z.string().optional(),
		sqlState: z.string().optional(),
		message: z.string().optional(),
		statementHandle: z.string(),
		statementHandles: z.array(z.string()).optional(),
		createdOn: z.number().optional(),
		statementStatusUrl: z.string().optional(),
		resultSetMetaData: ResultSetMetaDataSchema.optional(),
		data: z
			.array(z.array(z.string().nullable()))
			.optional()
			.describe('Rows. Each cell is a string or null.'),
		stats: StatsSchema.optional(),
	})
	.loose();

export type StatementResult = z.infer<typeof StatementResultSchema>;

export const CancelStatusSchema = z
	.object({
		code: z.string().optional(),
		sqlState: z.string().optional(),
		message: z.string().optional(),
		statementHandle: z.string(),
		statementStatusUrl: z.string().optional(),
		createdOn: z.number().optional(),
	})
	.loose();

export type CancelStatus = z.infer<typeof CancelStatusSchema>;

export type SnowflakeEndpointInputs = {
	statementsSubmit: SubmitStatementInput;
	statementsGet: GetStatementInput;
	statementsCancel: CancelStatementInput;
};

export type SnowflakeEndpointOutputs = {
	statementsSubmit: StatementResult;
	statementsGet: StatementResult;
	statementsCancel: CancelStatus;
};

export const SnowflakeEndpointInputSchemas = {
	statementsSubmit: SubmitStatementInputSchema,
	statementsGet: GetStatementInputSchema,
	statementsCancel: CancelStatementInputSchema,
};

export const SnowflakeEndpointOutputSchemas = {
	statementsSubmit: StatementResultSchema,
	statementsGet: StatementResultSchema,
	statementsCancel: CancelStatusSchema,
};
