import { z } from 'zod';

/**
 * Execute a SQL query against ClickHouse and return the rows.
 *
 * The endpoint accepts read-only SQL in the minimal first cut. The plugin
 * does not enforce that here — caller responsibility. A future iteration
 * can add a read-only guard.
 */
const ExecuteQueryInputSchema = z.object({
	sql: z.string().min(1).describe('SQL query to execute against ClickHouse'),
	database: z
		.string()
		.optional()
		.describe('Default database context (passed as ?database= query param)'),
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
		.array(z.record(z.string(), z.unknown()))
		.describe('Result rows; column names map to native JSON values'),
	rowCount: z.number().int().nonnegative(),
});

export type ExecuteQueryResponse = z.infer<typeof ExecuteQueryResponseSchema>;

export type ClickhouseEndpointInputs = {
	executeQuery: ExecuteQueryInput;
};

export type ClickhouseEndpointOutputs = {
	executeQuery: ExecuteQueryResponse;
};

export const ClickhouseEndpointInputSchemas = {
	executeQuery: ExecuteQueryInputSchema,
} as const;

export const ClickhouseEndpointOutputSchemas = {
	executeQuery: ExecuteQueryResponseSchema,
} as const;
