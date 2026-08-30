import { logEventFromContext } from 'corsair/core';
import { query, resolveBaseUrl, stripNonCodeTokens } from '../client';
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

	// Strip at most one trailing semicolon so callers like `SELECT 1;` still
	// produce valid SQL when we append ` LIMIT n`. Without this,
	// `SELECT 1; LIMIT 10` is a syntax error.
	const normalizedSql = input.sql.replace(/;\s*$/, '');
	// Scan for a real `LIMIT n` clause in the executable code only —
	// `LIMIT` text inside a comment or string literal must not suppress the
	// caller's intended cap.
	const scanSql = stripNonCodeTokens(normalizedSql);
	const sql =
		input.limit !== undefined && !/\blimit\s+\d+/i.test(scanSql)
			? `${normalizedSql}\nLIMIT ${input.limit}`
			: normalizedSql;
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
