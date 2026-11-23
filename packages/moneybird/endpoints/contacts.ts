import type { MoneybirdEndpoints } from '..';
import { idSegment } from '../client';
import { call, emptyBodyShape } from './call';
import {
	MoneybirdEndpointInputSchemas as Inputs,
	MoneybirdEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MoneybirdEndpoints['contactsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({ page, per_page }) => ({
			replayable: true,
			method: 'GET',
			path: '/contacts.json',
			query: { page, per_page },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page, parsed.per_page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MoneybirdEndpoints['contactsGet'] = async (ctx, input) =>
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
			path: `/contacts/${idSegment(id)}.json`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const create: MoneybirdEndpoints['contactsCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(parsed) => ({
			// Moneybird wraps create/update payloads in the resource key.
			method: 'POST',
			path: '/contacts.json',
			body: { contact: parsed },
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id }),
		},
	);

export const update: MoneybirdEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) =>
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
			path: `/contacts/${idSegment(id)}.json`,
			body: { contact: rest },
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const remove: MoneybirdEndpoints['contactsDelete'] = async (
	ctx,
	input,
) =>
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
			path: `/contacts/${idSegment(id)}.json`,
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, String(id)),
			log: ({ id }) => ({ id }),
		},
	);
