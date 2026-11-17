import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

export const list: SurveymonkeyEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({ page, per_page, status, sort_by, sort_order, search_by, search }) => ({
			method: 'GET',
			path: '/contacts',
			query: queryOf({
				page,
				per_page,
				status,
				sort_by,
				sort_order,
				search_by,
				search,
			}),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'contact list'),
				data: unwrapList(raw, 'contact list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

/**
 * Creates the contact on the account. A contact list is a separate resource, so
 * putting this contact on a list is a different call.
 */
export const create: SurveymonkeyEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({ email, first_name, last_name, phone_number, custom_fields }) => ({
			method: 'POST',
			path: '/contacts',
			body: {
				first_name,
				last_name,
				...(email === undefined ? {} : { email }),
				...(phone_number === undefined ? {} : { phone_number }),
				...(custom_fields === undefined ? {} : { custom_fields }),
			},
		}),
		{
			log: (_, result) => ({ contactId: result.id }),
		},
	);

export const bulkCreate: SurveymonkeyEndpoints['contactsBulkCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.bulkCreate',
			input: Inputs.contactsBulkCreate,
			output: Outputs.contactsBulkCreate,
		},
		input,
		({ contacts, update_existing }) => ({
			method: 'POST',
			path: '/contacts/bulk',
			body:
				update_existing === undefined
					? { contacts }
					: { contacts, update_existing },
		}),
		{
			log: (parsed, result) => ({
				submitted: parsed.contacts.length,
				succeeded: result.succeeded?.length ?? 0,
			}),
		},
	);

export const get: SurveymonkeyEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ contact_id }) => ({
			method: 'GET',
			path: `/contacts/${segment(contact_id)}`,
		}),
		{
			log: (parsed) => ({ contactId: parsed.contact_id }),
		},
	);

export const update: SurveymonkeyEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({
			contact_id,
			email,
			first_name,
			last_name,
			phone_number,
			custom_fields,
		}) => ({
			method: 'PATCH',
			path: `/contacts/${segment(contact_id)}`,
			body: {
				...(email === undefined ? {} : { email }),
				...(first_name === undefined ? {} : { first_name }),
				...(last_name === undefined ? {} : { last_name }),
				...(phone_number === undefined ? {} : { phone_number }),
				...(custom_fields === undefined ? {} : { custom_fields }),
			},
		}),
		{
			log: (parsed) => ({ contactId: parsed.contact_id }),
		},
	);

export const remove: SurveymonkeyEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ contact_id }) => ({
			method: 'DELETE',
			path: `/contacts/${segment(contact_id)}`,
		}),
		{
			shape: (_, parsed) => ({
				contact_id: parsed.contact_id,
				deleted: true,
			}),
			log: (parsed) => ({ contactId: parsed.contact_id }),
		},
	);

export const listFields: SurveymonkeyEndpoints['contactsListFields'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.listFields',
			input: Inputs.contactsListFields,
			output: Outputs.contactsListFields,
		},
		input,
		({ page, per_page }) => ({
			method: 'GET',
			path: '/contact_fields',
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'contact field list'),
				data: unwrapList(raw, 'contact field list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const updateField: SurveymonkeyEndpoints['contactsUpdateField'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.updateField',
			input: Inputs.contactsUpdateField,
			output: Outputs.contactsUpdateField,
		},
		input,
		({ contact_field_id, label }) => ({
			method: 'PATCH',
			path: `/contact_fields/${segment(contact_field_id)}`,
			body: { label },
		}),
		{
			log: (parsed) => ({ contactFieldId: parsed.contact_field_id }),
		},
	);
