import type { PipelineCrmEndpoints } from '..';
import { call } from './call';
import {
	conditionsQuery,
	PipelineCrmEndpointInputSchemas as Inputs,
	PipelineCrmEndpointOutputSchemas as Outputs,
} from './types';

const V3 = '/api/v3';

/** Maps the writable fields onto the wrapped person body. */
function personBody(p: {
	firstName?: string;
	lastName?: string;
	fullName?: string;
	summary?: string;
	phone?: string;
	homePhone?: string;
	mobile?: string;
	position?: string;
	website?: string;
	email?: string;
	email2?: string;
	companyId?: number;
	companyName?: string;
	userId?: number;
	leadStatusId?: number;
	leadSourceId?: number;
	tagIds?: number[];
	customFields?: Record<string, unknown>;
}): Record<string, unknown> {
	return {
		first_name: p.firstName,
		last_name: p.lastName,
		full_name: p.fullName,
		summary: p.summary,
		phone: p.phone,
		home_phone: p.homePhone,
		mobile: p.mobile,
		position: p.position,
		website: p.website,
		email: p.email,
		email2: p.email2,
		company_id: p.companyId,
		company_name: p.companyName,
		user_id: p.userId,
		lead_status_id: p.leadStatusId,
		lead_source_id: p.leadSourceId,
		predefined_contacts_tag_ids: p.tagIds,
		custom_fields: p.customFields,
	};
}

export const list: PipelineCrmEndpoints['peopleList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.list',
			input: Inputs.peopleList,
			output: Outputs.peopleList,
		},
		input,
		({ conditions, sort, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/people`,
			query: { ...conditionsQuery(conditions), sort, page, per_page: perPage },
		}),
		{ log: (_, page_) => ({ count: page_.entries.length }) },
	);

export const create: PipelineCrmEndpoints['peopleCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.create',
			input: Inputs.peopleCreate,
			output: Outputs.peopleCreate,
		},
		input,
		(fields) => ({
			method: 'POST',
			path: `${V3}/people`,
			body: { person: personBody(fields) },
		}),
		{ log: (_, person) => ({ personId: person.id ?? undefined }) },
	);

export const get: PipelineCrmEndpoints['peopleGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.get',
			input: Inputs.peopleGet,
			output: Outputs.peopleGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `${V3}/people/${id}` }),
		{ log: (_, person) => ({ personId: person.id ?? undefined }) },
	);

export const update: PipelineCrmEndpoints['peopleUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.update',
			input: Inputs.peopleUpdate,
			output: Outputs.peopleUpdate,
		},
		input,
		({ id, deliverReassignmentEmail, ...fields }) => ({
			method: 'PUT',
			path: `${V3}/people/${id}`,
			query: { deliver_reassignment_email: deliverReassignmentEmail },
			body: { person: personBody(fields) },
		}),
		{ log: ({ id }) => ({ personId: id }) },
	);

export const deletePerson: PipelineCrmEndpoints['peopleDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'people.delete',
			input: Inputs.peopleDelete,
			output: Outputs.peopleDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `${V3}/people/${id}` }),
		{ log: ({ id }) => ({ personId: id }) },
	);

export const autocomplete: PipelineCrmEndpoints['peopleAutocomplete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'people.autocomplete',
			input: Inputs.peopleAutocomplete,
			output: Outputs.peopleAutocomplete,
		},
		input,
		({ q, companyId, dealId }) => ({
			method: 'GET',
			path: `${V3}/people/autocomplete`,
			// Live, the API answers 422 without an autocomplete parameter (the
			// reference only names q), so the text goes in both.
			query: { autocomplete: q, q, company_id: companyId, deal_id: dealId },
		}),
		{ log: (_, matches) => ({ count: matches.length }) },
	);

export const listDeals: PipelineCrmEndpoints['peopleListDeals'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'people.listDeals',
			input: Inputs.peopleListDeals,
			output: Outputs.peopleListDeals,
		},
		input,
		({ id, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/people/${id}/deals`,
			query: { page, per_page: perPage },
		}),
		{
			log: (parsed, page_) => ({
				personId: parsed.id,
				count: page_.entries.length,
			}),
		},
	);

export const listNotes: PipelineCrmEndpoints['peopleListNotes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'people.listNotes',
			input: Inputs.peopleListNotes,
			output: Outputs.peopleListNotes,
		},
		input,
		({ id, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/people/${id}/notes`,
			query: { page, per_page: perPage },
		}),
		{
			log: (parsed, page_) => ({
				personId: parsed.id,
				count: page_.entries.length,
			}),
		},
	);
