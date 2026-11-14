import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { compactQuery, makeCompanyEnrichRequest } from '../client';
import type {
	PeopleFindEmailResponse,
	PeopleSearchCountResponse,
	PeopleSearchPreviewResponse,
	PeopleSearchResponse,
	PersonResponse,
} from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// People endpoints. Costs and filters are documented per operation at
// https://docs.companyenrich.com/reference (People / Enrichment, People /
// Search).

export const peopleGet: CompanyenrichEndpoints['peopleGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = CompanyenrichEndpointInputSchemas.peopleGet.parse(input);

	// 2 credits per person returned, plus 1 for the `education` expansion and 1
	// per unique company for the `company` expansion (docs:
	// https://docs.companyenrich.com/reference/get_v2-people-personid.md).
	const response = await makeCompanyEnrichRequest<PersonResponse>(
		`/v2/people/${parsedInput.personId}`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({ expand: parsedInput.expand }),
		},
	);

	const parsed = CompanyenrichEndpointOutputSchemas.peopleGet.parse(response);

	await logEventFromContext(
		ctx,
		'companyenrich.people.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const peopleEnrich: CompanyenrichEndpoints['peopleEnrich'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CompanyenrichEndpointInputSchemas.peopleEnrich.parse(input);

	// 5 credits when a person is returned; the email address is matched against
	// common address patterns at the email's company (docs:
	// https://docs.companyenrich.com/reference/post_v2-people-enrich.md).
	const response = await makeCompanyEnrichRequest<PersonResponse>(
		'/v2/people/enrich',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed =
		CompanyenrichEndpointOutputSchemas.peopleEnrich.parse(response);

	// The request carries a personal email address, so the event records only
	// that one person was enriched.
	await logEventFromContext(
		ctx,
		'companyenrich.people.enrich',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const peopleFindEmail: CompanyenrichEndpoints['peopleFindEmail'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.peopleFindEmail.parse(input);

		// BETA, 10 credits when a previously unseen work email is found (docs:
		// https://docs.companyenrich.com/reference/get_v2-people-personid-email.md).
		const response = await makeCompanyEnrichRequest<PeopleFindEmailResponse>(
			`/v2/people/${parsedInput.personId}/email`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({ domain: parsedInput.domain }),
			},
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.peopleFindEmail.parse(response);

		// Never log the returned address: record the lookup outcome only.
		await logEventFromContext(
			ctx,
			'companyenrich.people.findEmail',
			{ count: 1, found: parsed.status === 'found' },
			'completed',
		);

		return parsed;
	};

export const peopleSearch: CompanyenrichEndpoints['peopleSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CompanyenrichEndpointInputSchemas.peopleSearch.parse(input);

	// 2 credits per returned person; cursor pagination, cursors expire after 30
	// minutes (docs:
	// https://docs.companyenrich.com/reference/post_v2-people-search.md).
	const response = await makeCompanyEnrichRequest<PeopleSearchResponse>(
		'/v2/people/search',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed =
		CompanyenrichEndpointOutputSchemas.peopleSearch.parse(response);

	await logEventFromContext(
		ctx,
		'companyenrich.people.search',
		{ count: parsed.items.length },
		'completed',
	);

	return parsed;
};

export const peopleSearchCount: CompanyenrichEndpoints['peopleSearchCount'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.peopleSearchCount.parse(input);

		// Free count over the same person filters and company query as search
		// (docs:
		// https://docs.companyenrich.com/reference/post_v2-people-search-count.md).
		const response = await makeCompanyEnrichRequest<PeopleSearchCountResponse>(
			'/v2/people/search/count',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.peopleSearchCount.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.people.searchCount',
			{ resultCount: parsed.count },
			'completed',
		);

		return parsed;
	};

export const peopleSearchPreview: CompanyenrichEndpoints['peopleSearchPreview'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.peopleSearchPreview.parse(input);

		// Up to 10 masked person summaries, no credit cost, plan must include
		// people previews (docs:
		// https://docs.companyenrich.com/reference/post_v2-people-search-preview.md).
		const response =
			await makeCompanyEnrichRequest<PeopleSearchPreviewResponse>(
				'/v2/people/search/preview',
				ctx.key,
				{ method: 'POST', body: parsedInput },
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.peopleSearchPreview.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.people.searchPreview',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};
