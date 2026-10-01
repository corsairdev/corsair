import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/** Searches Remoet's company catalogue, or lists starred companies (GET /user/companies). */
export const search: RemoetEndpoints['companiesSearch'] = async (
	ctx,
	input,
) => {
	const parsed = RemoetEndpointInputSchemas.companiesSearch.parse(input);
	const response = await makeRemoetRequest('/user/companies', ctx.key, {
		method: 'GET',
		query: parsed,
	});
	const validated = RemoetEndpointOutputSchemas.companiesSearch.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.companies.search',
		{
			starred: parsed.starred ?? false,
			resultCount: validated.listings.length,
			totalCount: validated.totalCount,
		},
		'completed',
	);
	return validated;
};

/** Reads one company by slug (GET /user/companies/:slug). */
export const get: RemoetEndpoints['companiesGet'] = async (ctx, input) => {
	const { slug, ...query } =
		RemoetEndpointInputSchemas.companiesGet.parse(input);
	const response = await makeRemoetRequest(
		`/user/companies/${encodeURIComponent(slug)}`,
		ctx.key,
		{ method: 'GET', query },
	);
	const validated = RemoetEndpointOutputSchemas.companiesGet.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.companies.get',
		{ id: validated.id, slug: validated.slug },
		'completed',
	);
	return validated;
};
