import type { EmailOctopusEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EmailOctopusEndpointInputSchemas as Inputs,
	EmailOctopusEndpointOutputSchemas as Outputs,
} from './types';

export const list: EmailOctopusEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/lists/${segment(parsed.list_id)}/contacts`,
			query: {
				limit: parsed.limit,
				starting_after: parsed.starting_after,
				tag: parsed.tag,
				status: parsed.status,
				'created_at.lte': parsed['created_at.lte'],
				'created_at.gte': parsed['created_at.gte'],
				'last_updated_at.lte': parsed['last_updated_at.lte'],
				'last_updated_at.gte': parsed['last_updated_at.gte'],
			},
		}),
		{
			log: ({ list_id }, result) => ({
				listId: list_id,
				count: result.data?.length ?? 0,
			}),
		},
	);

export const get: EmailOctopusEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ list_id, contact_id }) => ({
			method: 'GET',
			path: `/lists/${segment(list_id)}/contacts/${segment(contact_id)}`,
		}),
		{
			log: ({ list_id, contact_id }) => ({
				listId: list_id,
				contactId: contact_id,
			}),
		},
	);

export const create: EmailOctopusEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({ list_id, email_address, fields, tags, status }) => ({
			method: 'POST',
			path: `/lists/${segment(list_id)}/contacts`,
			body: { email_address, fields, tags, status },
		}),
		{
			log: ({ list_id }, result) => ({
				listId: list_id,
				contactId: result.id ?? undefined,
			}),
		},
	);

export const upsert: EmailOctopusEndpoints['contactsUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.upsert',
			input: Inputs.contactsUpsert,
			output: Outputs.contactsUpsert,
		},
		input,
		({ list_id, email_address, fields, tags, status }) => ({
			method: 'PUT',
			path: `/lists/${segment(list_id)}/contacts`,
			body: { email_address, fields, tags, status },
		}),
		{
			log: ({ list_id }, result) => ({
				listId: list_id,
				contactId: result.id ?? undefined,
			}),
		},
	);

export const update: EmailOctopusEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ list_id, contact_id, email_address, fields, tags, status }) => ({
			method: 'PUT',
			path: `/lists/${segment(list_id)}/contacts/${segment(contact_id)}`,
			body: { email_address, fields, tags, status },
		}),
		{
			log: ({ list_id, contact_id }) => ({
				listId: list_id,
				contactId: contact_id,
			}),
		},
	);

export const remove: EmailOctopusEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ list_id, contact_id }) => ({
			method: 'DELETE',
			path: `/lists/${segment(list_id)}/contacts/${segment(contact_id)}`,
		}),
		{
			shape: () => ({}),
			log: ({ list_id, contact_id }) => ({
				listId: list_id,
				contactId: contact_id,
			}),
		},
	);

export const batch: EmailOctopusEndpoints['contactsBatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.batch',
			input: Inputs.contactsBatch,
			output: Outputs.contactsBatch,
		},
		input,
		({ list_id, contacts }) => ({
			method: 'PUT',
			path: `/lists/${segment(list_id)}/contacts/batch`,
			body: { contacts },
		}),
		{
			log: ({ list_id, contacts }, result) => ({
				listId: list_id,
				count: contacts.length,
				errors: result.errors?.length ?? 0,
			}),
		},
	);
