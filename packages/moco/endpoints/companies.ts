import type { MocoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type { CustomPropertiesInput } from './types';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MocoEndpoints['companiesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.list',
			input: Inputs.companiesList,
			output: Outputs.companiesList,
		},
		input,
		({ page, include_archived, type, tags, identifier, term }) => ({
			replayable: true,
			method: 'GET',
			path: '/companies',
			query: { page, include_archived, type, tags, identifier, term },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MocoEndpoints['companiesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.get',
			input: Inputs.companiesGet,
			output: Outputs.companiesGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/companies/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

function upsertBody(input: {
	name?: string;
	type?: string;
	identifier?: string;
	email?: string;
	website?: string;
	phone?: string;
	fax?: string;
	address?: string;
	country_code?: string;
	currency?: string;
	vat_identifier?: string;
	iban?: string;
	info?: string;
	footer?: string;
	default_invoice_due_days?: number;
	billing_email_cc?: string;
	billing_notes?: string;
	user_id?: number;
	tags?: string[];
	custom_properties?: CustomPropertiesInput;
}) {
	return {
		name: input.name,
		type: input.type,
		identifier: input.identifier,
		email: input.email,
		website: input.website,
		phone: input.phone,
		fax: input.fax,
		address: input.address,
		country_code: input.country_code,
		currency: input.currency,
		vat_identifier: input.vat_identifier,
		iban: input.iban,
		info: input.info,
		footer: input.footer,
		default_invoice_due_days: input.default_invoice_due_days,
		billing_email_cc: input.billing_email_cc,
		billing_notes: input.billing_notes,
		user_id: input.user_id,
		tags: input.tags,
		custom_properties: input.custom_properties,
	};
}

export const create: MocoEndpoints['companiesCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.create',
			input: Inputs.companiesCreate,
			output: Outputs.companiesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/companies',
			body: upsertBody(parsed),
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const update: MocoEndpoints['companiesUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.update',
			input: Inputs.companiesUpdate,
			output: Outputs.companiesUpdate,
		},
		input,
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/companies/${segment(id)}`,
			body: upsertBody(rest),
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const archive: MocoEndpoints['companiesArchive'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.archive',
			input: Inputs.companiesArchive,
			output: Outputs.companiesArchive,
		},
		input,
		({ id }) => ({
			method: 'PUT',
			path: `/companies/${segment(id)}/archive`,
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ company: raw }),
			log: ({ id }) => ({ id }),
		},
	);

export const unarchive: MocoEndpoints['companiesUnarchive'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.unarchive',
			input: Inputs.companiesUnarchive,
			output: Outputs.companiesUnarchive,
		},
		input,
		({ id }) => ({
			method: 'PUT',
			path: `/companies/${segment(id)}/unarchive`,
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ company: raw }),
			log: ({ id }) => ({ id }),
		},
	);
