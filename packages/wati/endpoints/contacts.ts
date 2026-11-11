import type { WatiEndpoints } from '..';
import { target } from '../client';
import { call } from './call';
import {
	WatiEndpointInputSchemas as Inputs,
	WatiEndpointOutputSchemas as Outputs,
} from './types';

export const create: WatiEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({ whatsapp_number, name, custom_params }) => ({
			method: 'POST',
			path: '/contacts',
			body: { whatsapp_number, name, custom_params },
		}),
		{
			// The number is a person's phone number, so only whether custom
			// attributes were sent is logged.
			log: (parsed) => ({
				name: parsed.name,
				customParams: parsed.custom_params?.length ?? 0,
			}),
		},
	);

export const get: WatiEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ target: who }) => ({
			method: 'GET',
			path: `/contacts/${target(who)}`,
		}),
		{
			log: (_, result) => ({
				name: typeof result.name === 'string' ? result.name : undefined,
			}),
		},
	);

export const list: WatiEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({ page_number, page_size }) => ({
			method: 'GET',
			path: '/contacts',
			query: { page_number, page_size },
		}),
		{
			log: (_, result) => ({
				count: result.contact_list?.length ?? 0,
				page: result.page_number ?? undefined,
				total: result.total ?? undefined,
			}),
		},
	);

export const count: WatiEndpoints['contactsCount'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.count',
			input: Inputs.contactsCount,
			output: Outputs.contactsCount,
		},
		input,
		() => ({ method: 'GET', path: '/contacts/count' }),
		{
			log: (_, result) => ({
				count: result.count ?? result.total ?? undefined,
			}),
		},
	);

/** Deleting removes the contact and their conversation history. */
export const remove: WatiEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ target: who }) => ({
			method: 'DELETE',
			path: `/contacts/${target(who)}`,
		}),
		{
			shape: (raw) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				success: true,
			}),
			// The target is a phone number, so it is not logged.
			log: () => ({ deleted: true }),
		},
	);
