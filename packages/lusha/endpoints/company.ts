import type { LushaEndpoints } from '..';
import { billingLog, call } from './call';
import {
	LushaEndpointInputSchemas as Inputs,
	LushaEndpointOutputSchemas as Outputs,
} from './types';

export const searchCompanies: LushaEndpoints['companySearchCompanies'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'company.searchCompanies',
			input: Inputs.companySearchCompanies,
			output: Outputs.companySearchCompanies,
		},
		input,
		({ companies, options, signals }) => ({
			method: 'POST',
			path: '/v3/companies/search',
			body: { companies, options, signals },
		}),
		{ log: (_, result) => billingLog(result) },
	);

export const enrichCompanies: LushaEndpoints['companyEnrichCompanies'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'company.enrichCompanies',
			input: Inputs.companyEnrichCompanies,
			output: Outputs.companyEnrichCompanies,
		},
		input,
		({ ids, reveal, tableId }) => ({
			method: 'POST',
			path: '/v3/companies/enrich',
			body: { ids, reveal, tableId },
		}),
		{ log: (_, result) => billingLog(result) },
	);

export const searchAndEnrichCompanies: LushaEndpoints['companySearchAndEnrichCompanies'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'company.searchAndEnrichCompanies',
				input: Inputs.companySearchAndEnrichCompanies,
				output: Outputs.companySearchAndEnrichCompanies,
			},
			input,
			({ companies, reveal, options }) => ({
				method: 'POST',
				path: '/v3/companies/search-and-enrich',
				body: { companies, reveal, options },
			}),
			{ log: (_, result) => billingLog(result) },
		);
