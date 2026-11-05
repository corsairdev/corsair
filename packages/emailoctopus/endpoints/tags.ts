import type { EmailOctopusEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EmailOctopusEndpointInputSchemas as Inputs,
	EmailOctopusEndpointOutputSchemas as Outputs,
} from './types';

export const list: EmailOctopusEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tags.list', input: Inputs.tagsList, output: Outputs.tagsList },
		input,
		({ list_id, limit, starting_after }) => ({
			method: 'GET',
			path: `/lists/${segment(list_id)}/tags`,
			query: { limit, starting_after },
		}),
		{
			log: ({ list_id }, result) => ({
				listId: list_id,
				count: result.data?.length ?? 0,
			}),
		},
	);

export const create: EmailOctopusEndpoints['tagsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.create',
			input: Inputs.tagsCreate,
			output: Outputs.tagsCreate,
		},
		input,
		({ list_id, tag }) => ({
			method: 'POST',
			path: `/lists/${segment(list_id)}/tags`,
			body: { tag },
		}),
		{ log: ({ list_id, tag }) => ({ listId: list_id, tag }) },
	);

export const update: EmailOctopusEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.update',
			input: Inputs.tagsUpdate,
			output: Outputs.tagsUpdate,
		},
		input,
		({ list_id, tag, name }) => ({
			method: 'PUT',
			path: `/lists/${segment(list_id)}/tags/${segment(tag)}`,
			body: { tag: name },
		}),
		{
			log: ({ list_id, tag, name }) => ({
				listId: list_id,
				tag,
				name,
			}),
		},
	);

export const remove: EmailOctopusEndpoints['tagsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.delete',
			input: Inputs.tagsDelete,
			output: Outputs.tagsDelete,
		},
		input,
		({ list_id, tag }) => ({
			method: 'DELETE',
			path: `/lists/${segment(list_id)}/tags/${segment(tag)}`,
		}),
		{
			shape: () => ({}),
			log: ({ list_id, tag }) => ({ listId: list_id, tag }),
		},
	);
