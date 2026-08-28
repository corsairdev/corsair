import { logEventFromContext } from 'corsair/core';
import { query, resolveBaseUrl } from '../client';
import type { ClickhouseEndpoints } from '../index';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './types';

/**
 * Run a SQL query against the user's ClickHouse instance.
 *
 * `ctx.key` is the Basic auth header (`Basic <base64>`) supplied by keyBuilder.
 * `resolveBaseUrl(ctx)` returns the per-tenant ClickHouse HTTP endpoint from
 * either `ctx.options.baseUrl` (solo mode) or the account's
 * `tenant_external_id` (multi-tenant mode).
 */
export const execute: ClickhouseEndpoints['executeQuery'] = async (
	ctx,
	rawInput,
) => {
	const input = ClickhouseEndpointInputSchemas.executeQuery.parse(rawInput);
	const baseUrl = await resolveBaseUrl(ctx);

	const limitClause =
		input.limit !== undefined && !/\blimit\s+\d+/i.test(input.sql)
			? ` LIMIT ${input.limit}`
			: '';

	const sql = `${input.sql}${limitClause}`;
	const rows = await query(baseUrl, ctx.key, sql);

	await logEventFromContext(
		ctx,
		'clickhouse.execute.query',
		{ sql: input.sql, rowCount: rows.length },
		'completed',
	);

	return ClickhouseEndpointOutputSchemas.executeQuery.parse({
		rows,
		rowCount: rows.length,
	});
};
