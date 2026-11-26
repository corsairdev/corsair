import type { LinkhutEndpoints } from '..';
import { call, requireDone } from './call';
import {
	LinkhutEndpointInputSchemas as Inputs,
	LinkhutEndpointOutputSchemas as Outputs,
} from './types';

export const get: LinkhutEndpoints['tagsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.get',
			input: Inputs.tagsGet,
			output: Outputs.tagsGet,
		},
		input,
		() => ({ method: 'GET', path: '/v1/tags/get', replayable: true }),
		{ log: (_, result) => ({ count: Object.keys(result).length }) },
	);

export const remove: LinkhutEndpoints['tagsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.delete',
			input: Inputs.tagsDelete,
			output: Outputs.tagsDelete,
		},
		input,
		({ tag }) => ({
			method: 'GET',
			path: '/v1/tags/delete',
			query: { tag },
			replayable: false,
		}),
		{ shape: requireDone('tags.delete') },
	);

export const rename: LinkhutEndpoints['tagsRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.rename',
			input: Inputs.tagsRename,
			output: Outputs.tagsRename,
		},
		input,
		({ old, new: replacement }) => ({
			method: 'GET',
			path: '/v1/tags/rename',
			query: { old, new: replacement },
			replayable: false,
		}),
		{ shape: requireDone('tags.rename') },
	);
