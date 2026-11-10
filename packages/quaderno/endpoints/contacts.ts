import type { QuadernoEndpoints } from '..';
import { segment } from '../client';
import { call, requireArray, wrap } from './call';
import {
	QuadernoEndpointInputSchemas as Inputs,
	nextCreatedBefore,
	QuadernoEndpointOutputSchemas as Outputs,
} from './types';

export const list: QuadernoEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
			toRequest: ({ q, limit, created_before }) => ({
				method: 'GET',
				path: '/contacts',
				query: { q, limit, created_before },
			}),
		},
		input,
		{
			// The route answers a bare array. It is named here so the output has a
			// stable key, and the next cursor is derived from the last row because
			// Quaderno puts the real one in a response header.
			shape: (raw, { limit }) => {
				const contacts = requireArray(raw, 'contacts');
				return {
					contacts,
					next_created_before: nextCreatedBefore(
						contacts as { id?: number | null }[],
						limit,
					),
				};
			},
			log: (_, result) => ({
				count: result.contacts.length,
				hasNext: result.next_created_before !== null,
			}),
		},
	);

export const create: QuadernoEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
			toRequest: (body) => ({ method: 'POST', path: '/contacts', body }),
		},
		input,
		{
			shape: (raw) => wrap('contact', raw),
			log: ({ email }, result) => ({
				contactId: result.contact.id,
				hasEmail: Boolean(email),
			}),
		},
	);

export const get: QuadernoEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/contacts/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('contact', raw),
			log: ({ id }) => ({ contactId: id }),
		},
	);

export const update: QuadernoEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/contacts/${segment(id)}`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('contact', raw),
			log: ({ id }) => ({ contactId: id }),
		},
	);

export const remove: QuadernoEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
			toRequest: ({ id }) => ({
				method: 'DELETE',
				path: `/contacts/${segment(id)}`,
			}),
		},
		input,
		{
			// A delete answers 204 with no body, so there is nothing to parse.
			// Quaderno refuses when the contact still has documents (422), which
			// arrives as an error before this runs.
			shape: () => ({ deleted: true }),
			log: ({ id }) => ({ contactId: id }),
		},
	);
