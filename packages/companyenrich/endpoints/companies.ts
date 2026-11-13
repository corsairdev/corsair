import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { compactQuery, makeCompanyEnrichRequest } from '../client';
import type {
	CompaniesAutocompleteResponse,
	CompaniesEnrichBatchResponse,
	CompaniesSearchCountResponse,
	CompaniesSearchPreviewResponse,
	CompaniesSearchResponse,
	CompaniesWorkforceResponse,
	CompanyResponse,
} from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// Company endpoints. Costs, parameters and response fields are documented per
// operation at https://docs.companyenrich.com/reference (Company / Enrichment,
// Company / Search).

export const companiesGet: CompanyenrichEndpoints['companiesGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CompanyenrichEndpointInputSchemas.companiesGet.parse(input);

	// 1 credit per company returned; each expansion (financial, keywords,
	// naicsCodes, technologies, workforce) adds 1 (docs:
	// https://docs.companyenrich.com/reference/get_v2-companies-companyid.md).
	const response = await makeCompanyEnrichRequest<CompanyResponse>(
		`/v2/companies/${encodeURIComponent(parsedInput.companyId)}`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({ expand: parsedInput.expand }),
		},
	);

	const parsed =
		CompanyenrichEndpointOutputSchemas.companiesGet.parse(response);

	await logEventFromContext(
		ctx,
		'companyenrich.companies.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const companiesEnrichByDomain: CompanyenrichEndpoints['companiesEnrichByDomain'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesEnrichByDomain.parse(input);

		// Domain lookup is the preferred enrichment method; `waitForEnrichment:
		// false` returns stored data immediately and a miss is a free 404 (docs:
		// https://docs.companyenrich.com/reference/get_v2-companies-enrich.md).
		const response = await makeCompanyEnrichRequest<CompanyResponse>(
			'/v2/companies/enrich',
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({
					domain: parsedInput.domain,
					expand: parsedInput.expand,
					waitForEnrichment: parsedInput.waitForEnrichment,
				}),
			},
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesEnrichByDomain.parse(
				response,
			);

		// The domain identifies a company rather than a person, but the event
		// stays a plain count so logged payloads never carry caller queries.
		await logEventFromContext(
			ctx,
			'companyenrich.companies.enrichByDomain',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const companiesEnrichByProperties: CompanyenrichEndpoints['companiesEnrichByProperties'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesEnrichByProperties.parse(
				input,
			);

		// Every provided property must match; the highest-ranked match wins (docs:
		// https://docs.companyenrich.com/reference/post_v2-companies-enrich.md).
		const response = await makeCompanyEnrichRequest<CompanyResponse>(
			'/v2/companies/enrich',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesEnrichByProperties.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'companyenrich.companies.enrichByProperties',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const companiesEnrichBatch: CompanyenrichEndpoints['companiesEnrichBatch'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesEnrichBatch.parse(input);

		// One result per requested domain, in request order; only `found` results
		// carry a company and consume credits (docs:
		// https://docs.companyenrich.com/reference/post_v2-companies-enrich-batch.md).
		const response =
			await makeCompanyEnrichRequest<CompaniesEnrichBatchResponse>(
				'/v2/companies/enrich/batch',
				ctx.key,
				{ method: 'POST', body: parsedInput },
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesEnrichBatch.parse(response);

		// Domains are caller-supplied, so the event reports only how many items
		// came back and how many resolved.
		const found = parsed.items.filter((item) => item.status === 'found').length;

		await logEventFromContext(
			ctx,
			'companyenrich.companies.enrichBatch',
			{ count: parsed.items.length, found },
			'completed',
		);

		return parsed;
	};

export const companiesAutocomplete: CompanyenrichEndpoints['companiesAutocomplete'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesAutocomplete.parse(input);

		// Returns up to 10 companies whose domain starts with the query and does
		// not consume credits (docs:
		// https://docs.companyenrich.com/reference/get_v2-companies-autocomplete.md).
		const response =
			await makeCompanyEnrichRequest<CompaniesAutocompleteResponse>(
				'/v2/companies/autocomplete',
				ctx.key,
				{
					method: 'GET',
					query: compactQuery({ query: parsedInput.query }),
				},
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesAutocomplete.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.companies.autocomplete',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};

export const companiesWorkforce: CompanyenrichEndpoints['companiesWorkforce'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesWorkforce.parse(input);

		// 1 credit per page; `cursor` walks the preceding 12-month history
		// windows (docs:
		// https://docs.companyenrich.com/reference/get_v2-companies-workforce.md).
		const response = await makeCompanyEnrichRequest<CompaniesWorkforceResponse>(
			'/v2/companies/workforce',
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({
					id: parsedInput.id,
					domain: parsedInput.domain,
					cursor: parsedInput.cursor,
				}),
			},
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesWorkforce.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.companies.workforce',
			{ count: 1, historyPoints: parsed.history?.length ?? 0 },
			'completed',
		);

		return parsed;
	};

export const companiesSearch: CompanyenrichEndpoints['companiesSearch'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesSearch.parse(input);

		// Standard search costs 1 credit per returned company, semantic 2, lookalike
		// 5; results use cursor pagination (docs:
		// https://docs.companyenrich.com/reference/post_v2-companies-search.md).
		const response = await makeCompanyEnrichRequest<CompaniesSearchResponse>(
			'/v2/companies/search',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesSearch.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.companies.search',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};

export const companiesSearchCount: CompanyenrichEndpoints['companiesSearchCount'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesSearchCount.parse(input);

		// Free count over the same filters, semantic query and lookalike seeds as
		// search (docs:
		// https://docs.companyenrich.com/reference/post_v2-companies-search-count.md).
		const response =
			await makeCompanyEnrichRequest<CompaniesSearchCountResponse>(
				'/v2/companies/search/count',
				ctx.key,
				{ method: 'POST', body: parsedInput },
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesSearchCount.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.companies.searchCount',
			{ resultCount: parsed.count },
			'completed',
		);

		return parsed;
	};

export const companiesSearchPreview: CompanyenrichEndpoints['companiesSearchPreview'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.companiesSearchPreview.parse(input);

		// Up to 25 summaries with the search ranking and no credit cost; the plan
		// must include company previews (docs:
		// https://docs.companyenrich.com/reference/post_v2-companies-search-preview.md).
		const response =
			await makeCompanyEnrichRequest<CompaniesSearchPreviewResponse>(
				'/v2/companies/search/preview',
				ctx.key,
				{ method: 'POST', body: parsedInput },
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.companiesSearchPreview.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.companies.searchPreview',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};
