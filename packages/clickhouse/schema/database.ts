import { z } from 'zod';

/** Official Nullable(UInt64) over HTTP JSONEachRow: number, quoted string, or null. */
const clickhouseUInt64 = z.union([z.number(), z.string()]).nullish();

/**
 * system.databases row.
 * Official: https://clickhouse.com/docs/operations/system-tables/databases
 */
export const ClickhouseDatabase = z
	.object({
		name: z.string(),
		engine: z.string(),
		data_path: z.string().optional(),
		metadata_path: z.string().optional(),
		uuid: z.string().optional(),
		engine_full: z.string().optional(),
		comment: z.string().optional(),
		is_external: z.union([z.number(), z.boolean()]).optional(),
	})
	.loose();
export type ClickhouseDatabase = z.infer<typeof ClickhouseDatabase>;

/**
 * system.tables row (aliases `totalRows` / `totalBytes` used by plugin SQL).
 * Official: https://clickhouse.com/docs/operations/system-tables/tables
 */
export const ClickhouseTable = z
	.object({
		database: z.string().optional(),
		name: z.string(),
		engine: z.string().optional(),
		total_rows: clickhouseUInt64,
		total_bytes: clickhouseUInt64,
		totalRows: clickhouseUInt64,
		totalBytes: clickhouseUInt64,
		comment: z.string().optional(),
	})
	.loose();
export type ClickhouseTable = z.infer<typeof ClickhouseTable>;

/**
 * system.columns row (alias `defaultExpression` used by plugin SQL).
 * Official: https://clickhouse.com/docs/operations/system-tables/columns
 */
export const ClickhouseColumn = z
	.object({
		database: z.string().optional(),
		table: z.string().optional(),
		name: z.string(),
		type: z.string(),
		position: clickhouseUInt64,
		comment: z.string().optional(),
		default_kind: z.string().optional(),
		default_expression: z.string().optional(),
		defaultExpression: z.string().optional(),
	})
	.loose();
export type ClickhouseColumn = z.infer<typeof ClickhouseColumn>;

/**
 * JSONEachRow query result. Dynamic columns; no stable entity shape.
 * Official: https://clickhouse.com/docs/interfaces/formats/JSONEachRow
 */
export const ClickhouseQueryResult = z
	.object({})
	.loose()
	.describe('Generic ClickHouse JSONEachRow result row');
export type ClickhouseQueryResult = z.infer<typeof ClickhouseQueryResult>;
