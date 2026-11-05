import type { ApolloEndpoints } from '..';
import { saveOrganizations } from './cache';
import { call } from './call';

export const search: ApolloEndpoints['organizationsSearch'] = async (
	ctx,
	input,
) => {
	const result = await call(
		ctx,
		'organizationsSearch',
		'organizations.search',
		'POST',
		'mixed_companies/search',
		input,
	);
	await saveOrganizations(ctx, result.organizations);
	return result;
};

export const enrich: ApolloEndpoints['organizationsEnrich'] = async (
	ctx,
	input,
) => {
	const result = await call(
		ctx,
		'organizationsEnrich',
		'organizations.enrich',
		'GET',
		'organizations/enrich',
		input,
	);
	await saveOrganizations(ctx, [result.organization]);
	return result;
};

export const get: ApolloEndpoints['organizationsGet'] = async (ctx, input) => {
	const result = await call(
		ctx,
		'organizationsGet',
		'organizations.get',
		'GET',
		'organizations/{id}',
		input,
		['id'],
	);
	await saveOrganizations(ctx, [result.organization]);
	return result;
};

export const jobPostings: ApolloEndpoints['organizationsJobPostings'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'organizationsJobPostings',
		'organizations.jobPostings',
		'GET',
		'organizations/{organization_id}/job_postings',
		input,
		['organization_id'],
	);
