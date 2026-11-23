import type { MocoEndpoints } from '..';
import { segment } from '../client';
import { call, emptyBodyShape } from './call';
import type { CustomPropertiesInput } from './types';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MocoEndpoints['contactsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({ page, tags, term, phone }) => ({
			replayable: true,
			method: 'GET',
			path: '/contacts/people',
			query: { page, tags, term, phone },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MocoEndpoints['contactsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/contacts/people/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

function upsertBody(input: {
	gender?: string;
	firstname?: string;
	lastname?: string;
	title?: string;
	job_position?: string;
	mobile_phone?: string;
	work_phone?: string;
	work_email?: string;
	work_address?: string;
	home_email?: string;
	home_address?: string;
	birthday?: string;
	salutation?: string;
	info?: string;
	company_id?: number;
	user_id?: number;
	tags?: string[];
	custom_properties?: CustomPropertiesInput;
}) {
	return {
		gender: input.gender,
		firstname: input.firstname,
		lastname: input.lastname,
		title: input.title,
		job_position: input.job_position,
		mobile_phone: input.mobile_phone,
		work_phone: input.work_phone,
		work_email: input.work_email,
		work_address: input.work_address,
		home_email: input.home_email,
		home_address: input.home_address,
		birthday: input.birthday,
		salutation: input.salutation,
		info: input.info,
		company_id: input.company_id,
		user_id: input.user_id,
		tags: input.tags,
		custom_properties: input.custom_properties,
	};
}

export const create: MocoEndpoints['contactsCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/contacts/people',
			body: upsertBody(parsed),
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const update: MocoEndpoints['contactsUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/contacts/people/${segment(id)}`,
			body: upsertBody(rest),
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const remove: MocoEndpoints['contactsDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/contacts/people/${segment(id)}`,
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, id),
			log: ({ id }) => ({ id }),
		},
	);
