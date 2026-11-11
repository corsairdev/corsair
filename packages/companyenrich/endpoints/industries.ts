import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { makeCompanyEnrichRequest } from '../client';
import type { IndustriesListResponse } from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// Industry reference data (docs:
// https://docs.companyenrich.com/reference/get_v2-industries.md).

export const industriesList: CompanyenrichEndpoints['industriesList'] = async (
	ctx,
	input,
) => {
	CompanyenrichEndpointInputSchemas.industriesList.parse(input);

	// Returns every industry with the NAICS prefixes accepted by company search
	// `filter.naicsCodes`; no credits are deducted.
	const response = await makeCompanyEnrichRequest<IndustriesListResponse>(
		'/v2/industries',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed =
		CompanyenrichEndpointOutputSchemas.industriesList.parse(response);

	await logEventFromContext(
		ctx,
		'companyenrich.industries.list',
		{ count: parsed.items.length },
		'completed',
	);

	return parsed;
};
