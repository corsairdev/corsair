import { logEventFromContext } from 'corsair/core';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpoints } from '../index';
import type { SecuritytrailsEndpointOutputs } from './types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './types';

/**
 * `POST /v1/query/scroll` — run a SQL-like query against the `hosts` or `ips`
 * tables.
 *
 * Returns at most 100 records; `id` is the cursor for `sql.scroll`. This
 * endpoint is sold separately from the retail plans, so a key without the
 * entitlement is rejected by the provider rather than by us.
 * https://docs.securitytrails.com/docs/how-to-use-the-sql-api
 */
export const query: SecuritytrailsEndpoints['sqlQuery'] = async (
	ctx,
	input,
) => {
	const parsed = SecuritytrailsEndpointInputSchemas.sqlQuery.parse(input);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['sqlQuery']
	>('query/scroll', ctx.key, {
		method: 'POST',
		body: { query: parsed.query },
		query: { page: parsed.page },
		schema: SecuritytrailsEndpointOutputSchemas.sqlQuery,
	});

	await logEventFromContext(
		ctx,
		'securitytrails.sql.query',
		{ query: parsed.query, page: parsed.page },
		'completed',
	);

	return response;
};

/**
 * `GET /v1/query/scroll/{id}` — next 100 records for an open SQL cursor.
 *
 * The docs warn that querying past the end of the result set still bills
 * against the plan, so callers should stop once `records` comes back short.
 * https://docs.securitytrails.com/docs/how-to-use-the-sql-api
 */
export const scroll: SecuritytrailsEndpoints['sqlScroll'] = async (
	ctx,
	input,
) => {
	const { id } = SecuritytrailsEndpointInputSchemas.sqlScroll.parse(input);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['sqlScroll']
	>(`query/scroll/${encodeURIComponent(id)}`, ctx.key, {
		method: 'GET',
		schema: SecuritytrailsEndpointOutputSchemas.sqlScroll,
	});

	await logEventFromContext(ctx, 'securitytrails.sql.scroll', {}, 'completed');

	return response;
};
