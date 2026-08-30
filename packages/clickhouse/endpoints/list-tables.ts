import { logEventFromContext } from 'corsair/core';
import { assertSafeIdentifier, query, resolveBaseUrl } from '../client';
import type { ClickhouseEndpoints } from '../index';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './types';

const LIST_TABLES_SQL =
	'SELECT name, engine, total_rows AS totalRows, total_bytes AS totalBytes ' +
	'FROM system.tables ' +
	'WHERE database = {database:String} ' +
	'ORDER BY name';

export const listTables: ClickhouseEndpoints['listTables'] = async (
	ctx,
	rawInput,
) => {
	const input = ClickhouseEndpointInputSchemas.listTables.parse(rawInput);
	const baseUrl = await resolveBaseUrl(ctx);

	assertSafeIdentifier(input.database, 'database');

	const limit = input.limit ?? 1000;
	const offset = input.offset ?? 0;
	const sql = `${LIST_TABLES_SQL} LIMIT {limit:UInt32} OFFSET {offset:UInt32}`;
	const rows = await query(baseUrl, ctx.key, sql, {
		params: { database: input.database, limit, offset },
	});

	const tables = rows.map((row) => ({
		name: String(row.name ?? ''),
		engine: String(row.engine ?? ''),
		totalRows: row.totalRows as string | number | undefined,
		totalBytes: row.totalBytes as string | number | undefined,
	}));

	await logEventFromContext(
		ctx,
		'clickhouse.query.listTables',
		{ database: input.database, count: tables.length },
		'completed',
	);

	return ClickhouseEndpointOutputSchemas.listTables.parse({
		database: input.database,
		tables,
		count: tables.length,
	});
};
