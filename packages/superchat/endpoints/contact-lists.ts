import type { SuperchatEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuperchatEndpointInputSchemas as Inputs,
	SuperchatEndpointOutputSchemas as Outputs,
} from './types';

export const list: SuperchatEndpoints['contactListsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactLists.list',
			input: Inputs.contactListsList,
			output: Outputs.contactListsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/contact-lists', query }),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const create: SuperchatEndpoints['contactListsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactLists.create',
			input: Inputs.contactListsCreate,
			output: Outputs.contactListsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/contact-lists', body }),
		{ log: (_, result) => ({ contactListId: result.id }) },
	);

/**
 * The delete answers the list as it was, not an empty body, so its output is the
 * list rather than a deletion marker.
 */
export const remove: SuperchatEndpoints['contactListsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactLists.delete',
			input: Inputs.contactListsDelete,
			output: Outputs.contactListsDelete,
		},
		input,
		({ contactListId }) => ({
			method: 'DELETE',
			path: `/contact-lists/${segment(contactListId)}`,
		}),
		{ log: ({ contactListId }) => ({ contactListId }) },
	);

export const forContact: SuperchatEndpoints['contactListsForContact'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactLists.forContact',
			input: Inputs.contactListsForContact,
			output: Outputs.contactListsForContact,
		},
		input,
		({ contactId, ...query }) => ({
			method: 'GET',
			path: `/contacts/${segment(contactId)}/contact-lists`,
			query,
		}),
		{
			log: ({ contactId }, result) => ({
				contactId,
				count: result.results.length,
			}),
		},
	);

export const addContact: SuperchatEndpoints['contactListsAddContact'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactLists.addContact',
			input: Inputs.contactListsAddContact,
			output: Outputs.contactListsAddContact,
		},
		input,
		({ contactId, contactListId }) => ({
			method: 'POST',
			path: `/contacts/${segment(contactId)}/contact-lists`,
			// The list is named in the body, not the path, on this route.
			body: { id: contactListId },
		}),
		{ log: ({ contactId, contactListId }) => ({ contactId, contactListId }) },
	);

export const removeContact: SuperchatEndpoints['contactListsRemoveContact'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactLists.removeContact',
			input: Inputs.contactListsRemoveContact,
			output: Outputs.contactListsRemoveContact,
		},
		input,
		({ contactId, contactListId }) => ({
			method: 'DELETE',
			path: `/contacts/${segment(contactId)}/contact-lists/${segment(contactListId)}`,
		}),
		{ log: ({ contactId, contactListId }) => ({ contactId, contactListId }) },
	);
