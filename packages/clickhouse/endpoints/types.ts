import { z } from 'zod';
import {
	ClickhouseColumn,
	ClickhouseDatabase,
	ClickhouseQueryResult,
	ClickhouseTable,
} from '../schema/database';

// --------------------------------------------------------------------------
// query.execute
// --------------------------------------------------------------------------

const ExecuteQueryInputSchema = z.object({
	sql: z.string().min(1).describe('SQL query to execute against ClickHouse'),
	database: z
		.string()
		.optional()
		.describe('Default database context (sent as ?database=)'),
	limit: z
		.number()
		.int()
		.positive()
		.max(10000)
		.optional()
		.describe(
			'Maximum rows to return; appended as LIMIT when not present in SQL',
		),
});
export type ExecuteQueryInput = z.infer<typeof ExecuteQueryInputSchema>;

const ExecuteQueryResponseSchema = z.object({
	rows: z
		.array(ClickhouseQueryResult)
		.describe('JSONEachRow objects; column names map to native JSON values'),
	rowCount: z.number().int().nonnegative(),
});
export type ExecuteQueryResponse = z.infer<typeof ExecuteQueryResponseSchema>;

// --------------------------------------------------------------------------
// query.listDatabases
// --------------------------------------------------------------------------

const ListDatabasesInputSchema = z.object({});
export type ListDatabasesInput = z.infer<typeof ListDatabasesInputSchema>;

const ListDatabasesResponseSchema = z.object({
	databases: z.array(ClickhouseDatabase.pick({ name: true, engine: true })),
});
export type ListDatabasesResponse = z.infer<typeof ListDatabasesResponseSchema>;

// --------------------------------------------------------------------------
// query.listTables
// --------------------------------------------------------------------------

const ListTablesInputSchema = z.object({
	database: z.string().describe('Database to list tables from'),
	limit: z
		.number()
		.int()
		.positive()
		.max(10000)
		.optional()
		.describe('Maximum tables to return'),
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Tables to skip before returning rows'),
});
export type ListTablesInput = z.infer<typeof ListTablesInputSchema>;

const ListTablesResponseSchema = z.object({
	database: z.string(),
	tables: z.array(
		ClickhouseTable.pick({
			name: true,
			engine: true,
			totalRows: true,
			totalBytes: true,
		}),
	),
	count: z.number().int().nonnegative().describe('Number of tables returned'),
});
export type ListTablesResponse = z.infer<typeof ListTablesResponseSchema>;

// --------------------------------------------------------------------------
// schema.getDatabase
// --------------------------------------------------------------------------

const ColumnInfoSchema = ClickhouseColumn.pick({
	name: true,
	type: true,
	position: true,
	comment: true,
	defaultExpression: true,
});

const TableInfoSchema = ClickhouseTable.pick({
	name: true,
	engine: true,
	totalRows: true,
	totalBytes: true,
}).extend({
	columns: z.array(ColumnInfoSchema).optional(),
});

const GetDatabaseSchemaInputSchema = z.object({
	database: z.string().describe('Database to introspect'),
	includeColumns: z
		.boolean()
		.optional()
		.describe('When true, also fetch column definitions for each table'),
	limit: z.number().int().positive().max(10000).optional(),
	offset: z.number().int().nonnegative().optional(),
});
export type GetDatabaseSchemaInput = z.infer<
	typeof GetDatabaseSchemaInputSchema
>;

const GetDatabaseSchemaResponseSchema = z.object({
	database: z.string(),
	tables: z.array(TableInfoSchema),
	count: z.number().int().nonnegative(),
});
export type GetDatabaseSchemaResponse = z.infer<
	typeof GetDatabaseSchemaResponseSchema
>;

// --------------------------------------------------------------------------
// schema.getTable
// --------------------------------------------------------------------------

const GetTableSchemaInputSchema = z.object({
	database: z.string().describe('Database the table belongs to'),
	table: z.string().describe('Table to introspect'),
	includeSample: z
		.boolean()
		.optional()
		.describe('When true, include up to `sampleSize` rows from the table'),
	sampleSize: z
		.number()
		.int()
		.positive()
		.max(1000)
		.optional()
		.describe('Sample row count when includeSample is true; defaults to 5'),
});
export type GetTableSchemaInput = z.infer<typeof GetTableSchemaInputSchema>;

const GetTableSchemaResponseSchema = z.object({
	database: z.string(),
	table: z.string(),
	engine: z.string().optional(),
	totalRows: ClickhouseTable.shape.totalRows,
	columns: z.array(ColumnInfoSchema),
	sampleRows: z
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe('Sample rows; only present when includeSample is true'),
});
export type GetTableSchemaResponse = z.infer<
	typeof GetTableSchemaResponseSchema
>;

// --------------------------------------------------------------------------
// play.get
// --------------------------------------------------------------------------

const GetPlayInterfaceInputSchema = z.object({});
export type GetPlayInterfaceInput = z.infer<typeof GetPlayInterfaceInputSchema>;

const GetPlayInterfaceResponseSchema = z.object({
	url: z.string().describe('The Play UI URL'),
	html: z.string().describe('Play UI HTML page (Monaco editor + query UI)'),
	sizeBytes: z.number().int().nonnegative(),
});
export type GetPlayInterfaceResponse = z.infer<
	typeof GetPlayInterfaceResponseSchema
>;

// --------------------------------------------------------------------------
// Aggregated maps
// --------------------------------------------------------------------------

export type ClickhouseEndpointInputs = {
	executeQuery: ExecuteQueryInput;
	listDatabases: ListDatabasesInput;
	listTables: ListTablesInput;
	getDatabaseSchema: GetDatabaseSchemaInput;
	getTableSchema: GetTableSchemaInput;
	getPlayInterface: GetPlayInterfaceInput;
};

export type ClickhouseEndpointOutputs = {
	executeQuery: ExecuteQueryResponse;
	listDatabases: ListDatabasesResponse;
	listTables: ListTablesResponse;
	getDatabaseSchema: GetDatabaseSchemaResponse;
	getTableSchema: GetTableSchemaResponse;
	getPlayInterface: GetPlayInterfaceResponse;
};

export const ClickhouseEndpointInputSchemas = {
	executeQuery: ExecuteQueryInputSchema,
	listDatabases: ListDatabasesInputSchema,
	listTables: ListTablesInputSchema,
	getDatabaseSchema: GetDatabaseSchemaInputSchema,
	getTableSchema: GetTableSchemaInputSchema,
	getPlayInterface: GetPlayInterfaceInputSchema,
} as const;

export const ClickhouseEndpointOutputSchemas = {
	executeQuery: ExecuteQueryResponseSchema,
	listDatabases: ListDatabasesResponseSchema,
	listTables: ListTablesResponseSchema,
	getDatabaseSchema: GetDatabaseSchemaResponseSchema,
	getTableSchema: GetTableSchemaResponseSchema,
	getPlayInterface: GetPlayInterfaceResponseSchema,
} as const;
