import { logEventFromContext } from 'corsair/core';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpoints } from '../index';
import { safely } from './persist';
import type { SecuritytrailsEndpointOutputs } from './types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './types';

/**
 * `POST /v1/ips/list` — DSL search over the IP dataset.
 *
 * The DSL query travels in the body; `page` is a query-string parameter and
 * `meta.max_page` bounds it.
 * https://docs.securitytrails.com/reference/search-ips-dsl-old-1
 */
export const search: SecuritytrailsEndpoints['ipsSearch'] = async (
	ctx,
	input,
) => {
	const { query, page } =
		SecuritytrailsEndpointInputSchemas.ipsSearch.parse(input);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['ipsSearch']
	>('ips/list', ctx.key, {
		method: 'POST',
		body: { query },
		query: { page },
		schema: SecuritytrailsEndpointOutputSchemas.ipsSearch,
	});

	if (response?.records?.length && ctx.db.ips) {
		for (const record of response.records) {
			if (!record.ip) continue;

			await safely(`ip ${record.ip}`, () =>
				ctx.db.ips.upsertByEntityId(record.ip as string, {
					id: record.ip as string,
					ip: record.ip as string,
					ptr: record.ptr ?? null,
					ports: record.ports,
					query,
				}),
			);
		}
	}

	await logEventFromContext(
		ctx,
		'securitytrails.ips.search',
		{ query, page },
		'completed',
	);

	return response;
};

/**
 * `POST /v1/ips/stats` — aggregate port and PTR statistics for a DSL query.
 * Returns counts only, so nothing here is worth caching.
 * https://docs.securitytrails.com/reference/ip-search-statistics-old-1
 */
export const stats: SecuritytrailsEndpoints['ipsStats'] = async (
	ctx,
	input,
) => {
	const { query } = SecuritytrailsEndpointInputSchemas.ipsStats.parse(input);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['ipsStats']
	>('ips/stats', ctx.key, {
		method: 'POST',
		body: { query },
		schema: SecuritytrailsEndpointOutputSchemas.ipsStats,
	});

	await logEventFromContext(
		ctx,
		'securitytrails.ips.stats',
		{ query },
		'completed',
	);

	return response;
};
