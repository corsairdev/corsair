import type { DubEndpoints } from '..';
import { call } from './call';
import {
	DUB_FOLDERS_PAGE_SIZE,
	DubEndpointInputSchemas as Inputs,
	DubEndpointOutputSchemas as Outputs,
} from './types';

export const create: DubEndpoints['foldersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.create',
			input: Inputs.foldersCreate,
			output: Outputs.foldersCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/folders', body }),
	);

export const list: DubEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ search, page, pageSize }) => ({
			method: 'GET',
			path: '/folders',
			query: { search, page, pageSize },
		}),
		{
			shape: (raw, { page, pageSize }) => {
				const items = Array.isArray(raw) ? raw : [];
				const effectivePageSize = pageSize ?? DUB_FOLDERS_PAGE_SIZE;
				return {
					items,
					page: page ?? 1,
					pageSize: effectivePageSize,
					nextPage: items.length >= effectivePageSize ? (page ?? 1) + 1 : null,
				};
			},
			log: (_, result) => ({ count: result.items.length }),
		},
	);

export const update: DubEndpoints['foldersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.update',
			input: Inputs.foldersUpdate,
			output: Outputs.foldersUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/folders/${id}`,
			body,
		}),
	);

export const remove: DubEndpoints['foldersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.delete',
			input: Inputs.foldersDelete,
			output: Outputs.foldersDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/folders/${id}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);
