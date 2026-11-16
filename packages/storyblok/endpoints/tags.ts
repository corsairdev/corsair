import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tags.list', input: Inputs.tagsList, output: Outputs.tagsList },
		input,
		(query) => ({ method: 'GET', path: '/tags', query }),
		{ log: (_, result) => ({ count: result.tags.length }) },
	);

export const create: StoryblokEndpoints['tagsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.create',
			input: Inputs.tagsCreate,
			output: Outputs.tagsCreate,
		},
		input,
		(tag) => ({ method: 'POST', path: '/tags', body: { tag } }),
		{ log: (_, result) => ({ tagId: result.tag.id ?? undefined }) },
	);

export const update: StoryblokEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.update',
			input: Inputs.tagsUpdate,
			output: Outputs.tagsUpdate,
		},
		input,
		({ tag_id, name }) => ({
			method: 'PUT',
			path: `/tags/${segment(tag_id)}`,
			body: { tag: { name } },
		}),
		{ log: ({ tag_id }) => ({ tagId: tag_id }) },
	);

export const remove: StoryblokEndpoints['tagsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.delete',
			input: Inputs.tagsDelete,
			output: Outputs.tagsDelete,
		},
		input,
		({ tag_id }) => ({ method: 'DELETE', path: `/tags/${segment(tag_id)}` }),
		{ log: ({ tag_id }) => ({ tagId: tag_id }) },
	);
