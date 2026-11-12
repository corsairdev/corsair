import type { WrikeEndpoints } from '..';
import { id } from '../client';
import { call } from './call';
import {
	WrikeEndpointInputSchemas as Inputs,
	WrikeEndpointOutputSchemas as Outputs,
} from './types';

export const list: WrikeEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ pageSize, nextPageToken, project, title, permalink, fields }) => ({
			method: 'GET',
			path: '/folders',
			query: { pageSize, nextPageToken, project, title, permalink, fields },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				// A folder that is a project carries a `project` object.
				projects:
					result.data?.filter((folder) => folder.project != null).length ?? 0,
			}),
		},
	);

export const get: WrikeEndpoints['foldersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.get',
			input: Inputs.foldersGet,
			output: Outputs.foldersGet,
		},
		input,
		({ id: folderId }) => ({
			method: 'GET',
			path: `/folders/${id(folderId)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				title: result.data?.[0]?.title ?? undefined,
				space: result.data?.[0]?.space ?? undefined,
			}),
		},
	);

/**
 * Creates a folder inside another, or in the account root when the parent is
 * the virtual root id that `account.get` returns.
 */
export const create: WrikeEndpoints['foldersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.create',
			input: Inputs.foldersCreate,
			output: Outputs.foldersCreate,
		},
		input,
		({ parentId, title, description, shareds }) => ({
			method: 'POST',
			path: `/folders/${id(parentId)}/folders`,
			body: { title, description, shareds },
		}),
		{
			log: (parsed, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				parent: parsed.parentId,
				title: parsed.title,
			}),
		},
	);

/** The tasks in a folder, optionally including every descendant folder. */
export const tasks: WrikeEndpoints['foldersTasks'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.tasks',
			input: Inputs.foldersTasks,
			output: Outputs.foldersTasks,
		},
		input,
		({
			id: folderId,
			pageSize,
			nextPageToken,
			descendants,
			sortField,
			sortOrder,
			fields,
		}) => ({
			method: 'GET',
			path: `/folders/${id(folderId)}/tasks`,
			query: {
				pageSize,
				nextPageToken,
				descendants,
				sortField,
				sortOrder,
				fields,
			},
		}),
		{
			log: (_, result) => ({ count: result.data?.length ?? 0 }),
		},
	);

export const update: WrikeEndpoints['foldersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.update',
			input: Inputs.foldersUpdate,
			output: Outputs.foldersUpdate,
		},
		input,
		({ id: folderId, ...body }) => ({
			method: 'PUT',
			path: `/folders/${id(folderId)}`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: result.data?.[0]?.id ?? parsed.id,
				title: result.data?.[0]?.title ?? undefined,
			}),
		},
	);

/**
 * Deletes a folder. Wrike moves it to the recycle bin together with every
 * descendant folder and task (unless one also has a parent outside it), and
 * there is no flag that refuses a folder with contents.
 */
export const remove: WrikeEndpoints['foldersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.delete',
			input: Inputs.foldersDelete,
			output: Outputs.foldersDelete,
		},
		input,
		({ id: folderId }) => ({
			method: 'DELETE',
			path: `/folders/${id(folderId)}`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: (parsed) => ({ id: parsed.id }),
		},
	);
