import type { KommoEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, pageFrom } from './call';
import {
	KommoEndpointInputSchemas as Inputs,
	KommoEndpointOutputSchemas as Outputs,
} from './types';

const LIST_LIMIT = 250;

export const list: KommoEndpoints['contactsList'] = (ctx, input) =>
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
			path: '/contacts',
			query: definedQuery({
				with:
					parsed.with && parsed.with.length > 0
						? parsed.with.join(',')
						: undefined,
				page: parsed.page,
				limit: parsed.limit,
				query: parsed.query,
				'filter[responsible_user_id][]': parsed.responsible_user_id,
				'filter[updated_at][from]': parsed.updated_from,
				'filter[updated_at][to]': parsed.updated_to,
			}),
		}),
		{
			// unknown: `raw` is an untyped HAL envelope; the output schema
			// validates whatever `shape` returns.
			shape: (raw, parsed) => {
				const contacts =
					((raw as { _embedded?: { contacts?: unknown[] } } | undefined)
						?._embedded?.contacts as unknown[] | undefined) ?? [];
				return {
					...(raw as object),
					next_page: pageFrom(
						raw,
						parsed.page,
						contacts.length,
						parsed.limit ?? LIST_LIMIT,
					),
				};
			},
			log: (_, result) => ({ count: result._embedded.contacts.length }),
		},
	);

export const get: KommoEndpoints['contactsGet'] = (ctx, input) =>
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
		{ log: (_, result) => ({ contactId: result.id }) },
	);

export const create: KommoEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({ contacts }) => ({ method: 'POST', path: '/contacts', body: contacts }),
		{
			log: (parsed, result) => ({
				submitted: parsed.contacts.length,
				created: result._embedded?.contacts.length ?? 0,
			}),
		},
	);

export const update: KommoEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ contacts }) => ({ method: 'PATCH', path: '/contacts', body: contacts }),
		{ log: (parsed) => ({ updated: parsed.contacts.length }) },
	);
