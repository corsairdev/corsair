import type { DubEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	DUB_TAGS_PAGE_SIZE,
	DubEndpointInputSchemas as Inputs,
	DubEndpointOutputSchemas as Outputs,
} from './types';

export const create: DubEndpoints['tagsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.create',
			input: Inputs.tagsCreate,
			output: Outputs.tagsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/tags', body }),
	);

export const list: DubEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
		},
		input,
		({ sortBy, sortOrder, search, ids, page, pageSize }) => ({
			method: 'GET',
			path: '/tags',
			query: {
				sortBy,
				sortOrder,
				search,
				ids: ids?.join(','),
				page,
				pageSize,
			},
		}),
		{
			shape: (raw, { page, pageSize }) => {
				// A non-array 2xx body is spec drift or an error envelope on 200;
				// hand it to the output schema so it fails loudly instead of
				// masquerading as an empty page.
				if (!Array.isArray(raw)) return raw;
				const effectivePageSize = pageSize ?? DUB_TAGS_PAGE_SIZE;
				return {
					items: raw,
					page: page ?? 1,
					pageSize: effectivePageSize,
					nextPage: raw.length >= effectivePageSize ? (page ?? 1) + 1 : null,
				};
			},
			log: (_, result) => ({ count: result.items.length }),
		},
	);

export const update: DubEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.update',
			input: Inputs.tagsUpdate,
			output: Outputs.tagsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/tags/${segment(id)}`,
			body,
		}),
	);

export const remove: DubEndpoints['tagsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.delete',
			input: Inputs.tagsDelete,
			output: Outputs.tagsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/tags/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);
