import type { RefinerEndpoints } from '..';
import { call } from './call';
import {
	RefinerEndpointInputSchemas as Inputs,
	RefinerEndpointOutputSchemas as Outputs,
} from './types';

export const list: RefinerEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({
			order_by,
			page,
			page_cursor,
			page_length,
			form_uuid,
			segment_uuid,
			search,
		}) => ({
			method: 'GET',
			path: '/contacts',
			query: {
				order_by,
				page,
				page_cursor,
				page_length,
				form_uuid,
				segment_uuid,
				search,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.items?.length ?? 0,
				total: result.pagination?.items_count ?? undefined,
			}),
		},
	);

export const get: RefinerEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ id, email, uuid }) => ({
			method: 'GET',
			path: '/contact',
			query: { id, email, uuid },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				segments: result.segments?.length ?? 0,
				hasAccount: result.account !== null && result.account !== undefined,
			}),
		},
	);

/**
 * Deleting a contact also removes their survey responses. The docs suggest
 * overwriting sensitive traits with empty values via identifyUser instead, when
 * the responses must survive a compliance request; that is worth knowing before
 * this operation is used to satisfy an erasure request.
 */
export const remove: RefinerEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ id, email, uuid }) => ({
			method: 'DELETE',
			path: '/contact',
			query: { id, email, uuid },
			// A second delete finds nothing; the contact is already gone either way.
			replayable: false,
		}),
		{
			log: () => ({}),
		},
	);
