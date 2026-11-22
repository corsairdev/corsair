import type { PandadocEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	PandadocEndpointInputSchemas as Inputs,
	PandadocEndpointOutputSchemas as Outputs,
} from './types';

export const list: PandadocEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: '/public/v1/contacts',
			query: { email },
		}),
		{ log: (_, page) => ({ count: page.results.length }) },
	);

export const get: PandadocEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/public/v1/contacts/${encodeURIComponent(id)}`,
		}),
		{ log: (_, contact) => ({ contactId: contact.id }) },
	);

export const create: PandadocEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/public/v1/contacts',
			body,
		}),
		{ log: (_, contact) => ({ contactId: contact.id }) },
	);

export const update: PandadocEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/public/v1/contacts/${encodeURIComponent(id)}`,
			body,
		}),
		{ log: (_, contact) => ({ contactId: contact.id }) },
	);

export const remove: PandadocEndpoints['contactsDelete'] = (ctx, input) =>
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
			path: `/public/v1/contacts/${encodeURIComponent(id)}`,
		}),
		{
			shape: (raw, { id }) => {
				expectEmptyBody(raw, 'contacts.delete');
				return { id, success: true };
			},
			log: (_, result) => ({ contactId: result.id }),
		},
	);
