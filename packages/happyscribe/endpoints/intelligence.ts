import { asRecord } from 'corsair/core';
import type { HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

// Intelligence lists answer `{ results, _links: { next: { url } } }`; flatten
// the cursor for the caller. A 404 here usually means the organization is
// not enrolled in the Intelligence API.
// unknown: the raw body is the list envelope until the output schema
// validates it.
function intelList(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record) return raw;
	return {
		...record,
		nextPageUrl: asRecord(asRecord(record._links)?.next)?.url,
	};
}

export const listCompanies: HappyScribeEndpoints['companiesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.list',
			input: Inputs.companiesList,
			output: Outputs.companiesList,
		},
		input,
		({ organizationId, search, domain, page, perPage }) => ({
			method: 'GET',
			path: '/companies',
			query: {
				organization_id: organizationId,
				search,
				domain,
				page,
				per_page: perPage,
			},
			replaySafe: true,
		}),
		{
			shape: intelList,
			log: (_, result) => ({
				count: result.results.length,
				hasMore: result.nextPageUrl !== undefined,
			}),
		},
	);

export const getCompany: HappyScribeEndpoints['companiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.get',
			input: Inputs.companiesGet,
			output: Outputs.companiesGet,
		},
		input,
		({ companyId, organizationId }) => ({
			method: 'GET',
			path: `/companies/${segment(companyId)}`,
			query: { organization_id: organizationId },
			replaySafe: true,
		}),
	);

export const listPeople: HappyScribeEndpoints['peopleList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.list',
			input: Inputs.peopleList,
			output: Outputs.peopleList,
		},
		input,
		({ organizationId, search, email, companyId, page, perPage }) => ({
			method: 'GET',
			path: '/people',
			query: {
				organization_id: organizationId,
				search,
				email,
				company_id: companyId,
				page,
				per_page: perPage,
			},
			replaySafe: true,
		}),
		{
			shape: intelList,
			log: (_, result) => ({
				count: result.results.length,
				hasMore: result.nextPageUrl !== undefined,
			}),
		},
	);

export const getPerson: HappyScribeEndpoints['peopleGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.get',
			input: Inputs.peopleGet,
			output: Outputs.peopleGet,
		},
		input,
		({ personId, organizationId }) => ({
			method: 'GET',
			path: `/people/${segment(personId)}`,
			query: { organization_id: organizationId },
			replaySafe: true,
		}),
	);
