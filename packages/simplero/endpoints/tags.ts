import type { SimpleroEndpoints } from '..';
import { segment } from '../client';
import { call, compact, dataId, without } from './shared';
import {
	SimpleroEndpointInputSchemas as Inputs,
	SimpleroEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimpleroEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tags.list', input: Inputs.tagsList, output: Outputs.tagsList },
		input,
		(query) => ({ method: 'GET', path: '/api/v2/tags', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SimpleroEndpoints['tagsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tags.get', input: Inputs.tagsGet, output: Outputs.tagsGet },
		input,
		({ id }) => ({ method: 'GET', path: `/api/v2/tags/${segment(id)}` }),
		{ log: ({ id }) => ({ tagId: id }) },
	);

export const create: SimpleroEndpoints['tagsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.create',
			input: Inputs.tagsCreate,
			output: Outputs.tagsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v2/tags', body }),
		{ log: (_, result) => ({ tagId: dataId(result) }) },
	);

export const update: SimpleroEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.update',
			input: Inputs.tagsUpdate,
			output: Outputs.tagsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/v2/tags/${segment(parsed.id)}`,
			body: compact(without(parsed)),
		}),
		{ log: ({ id }) => ({ tagId: id }) },
	);
