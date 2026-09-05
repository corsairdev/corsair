import { logEventFromContext } from 'corsair/core';
import { assertSafeIdentifier, query, resolveBaseUrl } from '../client';
import type { ClickhouseEndpoints } from '../index';
import type { GetDatabaseSchemaResponse } from './types';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './types';

type TableInfo = GetDatabaseSchemaResponse['tables'][number];

const TABLES_SQL =
	'SELECT name, engine, total_rows AS totalRows, total_bytes AS totalBytes ' +
	'FROM system.tables ' +
	'WHERE database = {database:String} ' +
	'ORDER BY name ' +
	'LIMIT {limit:UInt32} OFFSET {offset:UInt32}';

const COLUMNS_SQL =
	'SELECT name, type, position, comment, default_expression AS defaultExpression ' +
	'FROM system.columns ' +
	'WHERE database = {database:String} AND table = {table:String} ' +
	'ORDER BY position';

export const getDatabaseSchema: ClickhouseEndpoints['getDatabaseSchema'] =
	async (ctx, rawInput) => {
		const input =
			ClickhouseEndpointInputSchemas.getDatabaseSchema.parse(rawInput);
		const baseUrl = await resolveBaseUrl(ctx);

		assertSafeIdentifier(input.database, 'database');

		const limit = input.limit ?? 1000;
		const offset = input.offset ?? 0;
		const tableRows = await query(baseUrl, ctx.key, TABLES_SQL, {
			params: { database: input.database, limit, offset },
		});

		const tables: TableInfo[] = tableRows.map((row) => ({
			name: String(row.name ?? ''),
			engine: row.engine as string | undefined,
			totalRows: row.totalRows as string | number | undefined,
			totalBytes: row.totalBytes as string | number | undefined,
		}));

		if (input.includeColumns) {
			const tablesWithColumns = await Promise.all(
				tables.map(async (table) => {
					const columnRows = await query(baseUrl, ctx.key, COLUMNS_SQL, {
						params: { database: input.database, table: table.name },
					});
					return {
						...table,
						columns: columnRows.map((row) => ({
							name: String(row.name ?? ''),
							type: String(row.type ?? ''),
							position: row.position as string | number | undefined,
							comment: row.comment as string | undefined,
							defaultExpression: row.defaultExpression as string | undefined,
						})),
					};
				}),
			);
			tables.splice(0, tables.length, ...tablesWithColumns);
		}

		await logEventFromContext(
			ctx,
			'clickhouse.schema.getDatabase',
			{
				database: input.database,
				count: tables.length,
				includeColumns: input.includeColumns ?? false,
			},
			'completed',
		);

		return ClickhouseEndpointOutputSchemas.getDatabaseSchema.parse({
			database: input.database,
			tables,
			count: tables.length,
		});
	};
