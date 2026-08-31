import { logEventFromContext } from 'corsair/core';
import { assertSafeIdentifier, query, resolveBaseUrl } from '../client';
import type { ClickhouseEndpoints } from '../index';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './types';

const TABLE_META_SQL =
	'SELECT engine, total_rows AS totalRows ' +
	'FROM system.tables ' +
	'WHERE database = {database:String} AND name = {table:String}';

const COLUMNS_SQL =
	'SELECT name, type, position, comment, default_expression AS defaultExpression ' +
	'FROM system.columns ' +
	'WHERE database = {database:String} AND table = {table:String} ' +
	'ORDER BY position';

export const getTableSchema: ClickhouseEndpoints['getTableSchema'] = async (
	ctx,
	rawInput,
) => {
	const input = ClickhouseEndpointInputSchemas.getTableSchema.parse(rawInput);
	const baseUrl = await resolveBaseUrl(ctx);

	assertSafeIdentifier(input.database, 'database');
	assertSafeIdentifier(input.table, 'table');

	const [metaRows, columnRows] = await Promise.all([
		query(baseUrl, ctx.key, TABLE_META_SQL, {
			params: { database: input.database, table: input.table },
		}),
		query(baseUrl, ctx.key, COLUMNS_SQL, {
			params: { database: input.database, table: input.table },
		}),
	]);

	const meta = metaRows[0];
	const columns = columnRows.map((row) => ({
		name: String(row.name ?? ''),
		type: String(row.type ?? ''),
		position: row.position as string | number | undefined,
		comment: row.comment as string | undefined,
		defaultExpression: row.defaultExpression as string | undefined,
	}));

	let sampleRows: Record<string, unknown>[] | undefined;
	if (input.includeSample) {
		const sampleSize = input.sampleSize ?? 5;
		const sampleSql =
			'SELECT * FROM {database:Identifier}.{table:Identifier} LIMIT {limit:UInt32}';
		sampleRows = await query(baseUrl, ctx.key, sampleSql, {
			params: {
				database: input.database,
				table: input.table,
				limit: sampleSize,
			},
		});
	}

	await logEventFromContext(
		ctx,
		'clickhouse.schema.getTable',
		{
			database: input.database,
			table: input.table,
			columnCount: columns.length,
			withSample: Boolean(input.includeSample),
		},
		'completed',
	);

	return ClickhouseEndpointOutputSchemas.getTableSchema.parse({
		database: input.database,
		table: input.table,
		engine: meta?.engine as string | undefined,
		totalRows: meta?.totalRows as string | number | undefined,
		columns,
		sampleRows,
	});
};
