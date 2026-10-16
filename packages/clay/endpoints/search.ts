import { logEventFromContext } from 'corsair/core';
import type { ClayContext, ClayEndpoints } from '..';
import { makeClayRequest } from '../client';
import type { RunSearchResponse } from './types';
import { ClayEndpointInputSchemas, ClayEndpointOutputSchemas } from './types';

async function saveResults(ctx: ClayContext, page: RunSearchResponse) {
	try {
		if (page.source_type === 'people' && ctx.db.people) {
			for (const person of page.data) {
				const current = person.matched_experiences[0];
				await ctx.db.people.upsertByEntityId(String(person.clay_profile_id), {
					clayProfileId: person.clay_profile_id,
					name: person.name,
					firstName: person.first_name,
					lastName: person.last_name,
					linkedinUrl: person.linkedin_url,
					location: person.location.name,
					currentTitle: current?.title,
					currentCompany: current?.company,
				});
			}
		}
		if (page.source_type === 'companies' && ctx.db.companies) {
			for (const company of page.data) {
				await ctx.db.companies.upsertByEntityId(
					String(company.clay_company_id),
					{
						clayCompanyId: company.clay_company_id,
						name: company.name,
						domain: company.domain,
						size: company.size,
						industry: company.industry,
						country: company.country,
						linkedinUrl: company.linkedin_url,
					},
				);
			}
		}
	} catch (error) {
		console.warn('Failed to save Clay search results to database:', error);
	}
}

export const reference: ClayEndpoints['searchReference'] = async (
	ctx,
	input,
) => {
	ClayEndpointInputSchemas.searchReference.parse(input ?? {});
	const result = ClayEndpointOutputSchemas.searchReference.parse(
		await makeClayRequest<unknown>('search/query-mode/reference', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'clay.search.reference',
		{ length: result.reference.length },
		'completed',
	);
	return result;
};

export const create: ClayEndpoints['searchCreate'] = async (ctx, input) => {
	const body = ClayEndpointInputSchemas.searchCreate.parse(input);
	const result = ClayEndpointOutputSchemas.searchCreate.parse(
		await makeClayRequest<unknown>('search/query-mode', ctx.key, {
			method: 'POST',
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'clay.search.create',
		{ searchId: result.search_id, sourceType: result.source_type },
		'completed',
	);
	return result;
};

export const run: ClayEndpoints['searchRun'] = async (ctx, input) => {
	const { search_id, limit } = ClayEndpointInputSchemas.searchRun.parse(input);
	// The iterator is stateful: each call returns the next page while has_more.
	const result = ClayEndpointOutputSchemas.searchRun.parse(
		await makeClayRequest<unknown>(
			'search/query-mode/{search_id}/run',
			ctx.key,
			{ method: 'POST', path: { search_id }, body: { limit } },
		),
	);

	await saveResults(ctx, result);
	await logEventFromContext(
		ctx,
		'clay.search.run',
		{
			searchId: search_id,
			sourceType: result.source_type,
			resultCount: result.data.length,
			hasMore: result.has_more,
		},
		'completed',
	);
	return result;
};
