import type { MeloEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { withNextPage } from './pagination';
import {
	MeloEndpointInputSchemas as Inputs,
	MeloEndpointOutputSchemas as Outputs,
} from './types';

export const list: MeloEndpoints['searchesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'searches.list',
			input: Inputs.searchesList,
			output: Outputs.searchesList,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/searches',
			query,
		}),
		{
			shape: (raw) => withNextPage(raw),
			log: (_, result) => ({
				count: result['hydra:member'].length,
				total: result['hydra:totalItems'] ?? undefined,
			}),
		},
	);

export const get: MeloEndpoints['searchesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'searches.get',
			input: Inputs.searchesGet,
			output: Outputs.searchesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/searches/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ searchId: id }) },
	);

export const create: MeloEndpoints['searchesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'searches.create',
			input: Inputs.searchesCreate,
			output: Outputs.searchesCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/searches',
			body,
			replaySafe: false,
		}),
		{ log: (_, result) => ({ searchId: result['@id'] ?? undefined }) },
	);

export const update: MeloEndpoints['searchesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'searches.update',
			input: Inputs.searchesUpdate,
			output: Outputs.searchesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/searches/${segment(id)}`,
			body,
			replaySafe: false,
		}),
		{ log: ({ id }) => ({ searchId: id }) },
	);

// `delete` is a reserved word, so the function is `remove` and is registered
// under the `delete` key.
export const remove: MeloEndpoints['searchesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'searches.delete',
			input: Inputs.searchesDelete,
			output: Outputs.searchesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/searches/${segment(id)}`,
			replaySafe: false,
			bodyless: true,
		}),
		{
			// The documented answer is a bodyless 204, so a 2xx is the evidence.
			shape: (_, { id }) => ({ id, deleted: true }),
			log: ({ id }) => ({ searchId: id }),
		},
	);
