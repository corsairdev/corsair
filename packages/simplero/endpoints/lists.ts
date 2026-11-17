import type { SimpleroEndpoints } from '..';
import { segment } from '../client';
import { call, compact, dataId, without } from './shared';
import {
	SimpleroEndpointInputSchemas as Inputs,
	SimpleroEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimpleroEndpoints['listsList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'lists.list', input: Inputs.listsList, output: Outputs.listsList },
		input,
		(query) => ({ method: 'GET', path: '/api/v2/lists', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SimpleroEndpoints['listsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'lists.get', input: Inputs.listsGet, output: Outputs.listsGet },
		input,
		({ id }) => ({ method: 'GET', path: `/api/v2/lists/${segment(id)}` }),
		{ log: ({ id }) => ({ listId: id }) },
	);

export const create: SimpleroEndpoints['listsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.create',
			input: Inputs.listsCreate,
			output: Outputs.listsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v2/lists', body }),
		{ log: (_, result) => ({ listId: dataId(result) }) },
	);

export const update: SimpleroEndpoints['listsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.update',
			input: Inputs.listsUpdate,
			output: Outputs.listsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/v2/lists/${segment(parsed.id)}`,
			body: compact(without(parsed)),
		}),
		{ log: ({ id }) => ({ listId: id }) },
	);
