import type { SuperchatEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SuperchatEndpointInputSchemas as Inputs,
	SuperchatEndpointOutputSchemas as Outputs,
} from './types';

export const list: SuperchatEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/contacts', query }),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const get: SuperchatEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ contactId }) => ({
			method: 'GET',
			path: `/contacts/${segment(contactId)}`,
		}),
		{ log: ({ contactId }) => ({ contactId }) },
	);

export const create: SuperchatEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/contacts', body }),
		{
			log: (parsed, result) => ({
				contactId: result.id,
				handles: parsed.handles.length,
			}),
		},
	);

export const update: SuperchatEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ contactId, ...body }) => ({
			method: 'PATCH',
			path: `/contacts/${segment(contactId)}`,
			body,
		}),
		{ log: ({ contactId }) => ({ contactId }) },
	);

/** Every expression has to match, so this is an AND across the list. */
export const search: SuperchatEndpoints['contactsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.search',
			input: Inputs.contactsSearch,
			output: Outputs.contactsSearch,
		},
		input,
		({ after, before, limit, query }) => ({
			method: 'POST',
			path: '/contacts/search',
			query: { after, before, limit },
			body: { query },
		}),
		{
			log: (parsed, result) => ({
				expressions: parsed.query.value.length,
				count: result.results.length,
			}),
		},
	);

export const remove: SuperchatEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ contactId }) => ({
			method: 'DELETE',
			path: `/contacts/${segment(contactId)}`,
		}),
		{
			shape: (raw, { contactId }) => deletion(raw, contactId),
			log: ({ contactId }) => ({ contactId }),
		},
	);
