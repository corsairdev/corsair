import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { query } from '../client';
import type { ClickhouseEndpoints } from '../index';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './types';

/**
 * Run a SQL query against the user's ClickHouse instance.
 *
 * `ctx.key` is the Basic auth header (`Basic <base64>`) supplied by keyBuilder.
 * `ctx.options.baseUrl` is the per-tenant ClickHouse HTTP endpoint, set at
 * plugin construction time (or per-call via the corsair CLI when wiring).
 */
export const execute: ClickhouseEndpoints['executeQuery'] = async (
	ctx,
	rawInput,
) => {
	const input = ClickhouseEndpointInputSchemas.executeQuery.parse(rawInput);
	const baseUrl = ctx.options.baseUrl;
	if (!baseUrl) {
		throw new AuthMissingError('clickhouse', 'baseUrl');
	}

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
