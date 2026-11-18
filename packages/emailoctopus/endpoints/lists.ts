import type { EmailOctopusEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EmailOctopusEndpointInputSchemas as Inputs,
	EmailOctopusEndpointOutputSchemas as Outputs,
} from './types';

export const list: EmailOctopusEndpoints['listsList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'lists.list', input: Inputs.listsList, output: Outputs.listsList },
		input,
		({ limit, starting_after }) => ({
			method: 'GET',
			path: '/lists',
			query: { limit, starting_after },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const get: EmailOctopusEndpoints['listsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'lists.get', input: Inputs.listsGet, output: Outputs.listsGet },
		input,
		({ list_id }) => ({
			method: 'GET',
			path: `/lists/${segment(list_id)}`,
		}),
		{ log: ({ list_id }) => ({ listId: list_id }) },
	);

export const create: EmailOctopusEndpoints['listsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.create',
			input: Inputs.listsCreate,
			output: Outputs.listsCreate,
		},
		input,
		({ name }) => ({
			method: 'POST',
			path: '/lists',
			body: { name },
		}),
		{ log: (_, result) => ({ listId: result.id ?? undefined }) },
	);

export const update: EmailOctopusEndpoints['listsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.update',
			input: Inputs.listsUpdate,
			output: Outputs.listsUpdate,
		},
		input,
		({ list_id, name }) => ({
			method: 'PUT',
			path: `/lists/${segment(list_id)}`,
			body: { name },
		}),
		{ log: ({ list_id }) => ({ listId: list_id }) },
	);

export const remove: EmailOctopusEndpoints['listsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.delete',
			input: Inputs.listsDelete,
			output: Outputs.listsDelete,
		},
		input,
		({ list_id }) => ({
			method: 'DELETE',
			path: `/lists/${segment(list_id)}`,
		}),
		{
			shape: () => ({}),
			log: ({ list_id }) => ({ listId: list_id }),
		},
	);
