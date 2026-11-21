import type { PipelineCrmEndpoints } from '..';
import { call } from './call';
import {
	conditionsQuery,
	PipelineCrmEndpointInputSchemas as Inputs,
	PipelineCrmEndpointOutputSchemas as Outputs,
} from './types';

const V3 = '/api/v3';

/** Maps the writable fields onto the wrapped company body. */
function companyBody(c: {
	name?: string;
	description?: string;
	email?: string;
	web?: string;
	address1?: string;
	address2?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
	phone1?: string;
	phone2?: string;
	facebookUrl?: string;
	linkedInUrl?: string;
	twitter?: string;
	userId?: number;
	customFields?: Record<string, unknown>;
}): Record<string, unknown> {
	return {
		name: c.name,
		description: c.description,
		email: c.email,
		web: c.web,
		address_1: c.address1,
		address_2: c.address2,
		city: c.city,
		state: c.state,
		postal_code: c.postalCode,
		country: c.country,
		phone1: c.phone1,
		phone2: c.phone2,
		facebook_url: c.facebookUrl,
		linked_in_url: c.linkedInUrl,
		twitter: c.twitter,
		user_id: c.userId,
		custom_fields: c.customFields,
	};
}

export const list: PipelineCrmEndpoints['companiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.list',
			input: Inputs.companiesList,
			output: Outputs.companiesList,
		},
		input,
		({ conditions, sort, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/companies`,
			query: { ...conditionsQuery(conditions), sort, page, per_page: perPage },
		}),
		{ log: (_, page_) => ({ count: page_.entries.length }) },
	);

export const create: PipelineCrmEndpoints['companiesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.create',
			input: Inputs.companiesCreate,
			output: Outputs.companiesCreate,
		},
		input,
		({ checkForDuplicates, ...fields }) => ({
			method: 'POST',
			path: `${V3}/companies`,
			query: { check_for_duplicates: checkForDuplicates },
			body: { company: companyBody(fields) },
		}),
		{ log: (_, company) => ({ companyId: company.id ?? undefined }) },
	);

export const get: PipelineCrmEndpoints['companiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.get',
			input: Inputs.companiesGet,
			output: Outputs.companiesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `${V3}/companies/${id}` }),
		{ log: (_, company) => ({ companyId: company.id ?? undefined }) },
	);

export const update: PipelineCrmEndpoints['companiesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.update',
			input: Inputs.companiesUpdate,
			output: Outputs.companiesUpdate,
		},
		input,
		({ id, deliverReassignmentEmail, ...fields }) => ({
			method: 'PUT',
			path: `${V3}/companies/${id}`,
			query: { deliver_reassignment_email: deliverReassignmentEmail },
			body: { company: companyBody(fields) },
		}),
		{ log: ({ id }) => ({ companyId: id }) },
	);

export const deleteCompany: PipelineCrmEndpoints['companiesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.delete',
			input: Inputs.companiesDelete,
			output: Outputs.companiesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `${V3}/companies/${id}` }),
		{ log: ({ id }) => ({ companyId: id }) },
	);

export const autocomplete: PipelineCrmEndpoints['companiesAutocomplete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.autocomplete',
			input: Inputs.companiesAutocomplete,
			output: Outputs.companiesAutocomplete,
		},
		input,
		({ q }) => ({
			method: 'GET',
			path: `${V3}/companies/autocomplete`,
			query: { q },
		}),
		{ log: (_, matches) => ({ count: matches.length }) },
	);

export const listPeople: PipelineCrmEndpoints['companiesListPeople'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.listPeople',
			input: Inputs.companiesListPeople,
			output: Outputs.companiesListPeople,
		},
		input,
		({ id }) => ({ method: 'GET', path: `${V3}/companies/${id}/people` }),
		{
			log: (parsed, page_) => ({
				companyId: parsed.id,
				count: page_.entries.length,
			}),
		},
	);
