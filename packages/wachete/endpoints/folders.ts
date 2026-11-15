import type { WacheteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WacheteEndpointInputSchemas as Inputs,
	WacheteEndpointOutputSchemas as Outputs,
} from './types';

/** Lists a folder's subfolders and monitors. Omit `parentId` for the root. */
export const list: WacheteEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ parentId, continuationToken }) => ({
			method: 'GET',
			path: '/thirdparty/v1/folder/list',
			query: { parentId, continuationToken },
		}),
		{
			log: (_, result) => ({
				folders: result.subfolders?.length ?? 0,
				tasks: result.tasks?.length ?? 0,
				hasMore: result.continuationToken != null,
			}),
		},
	);

/** Creates a folder, or renames and moves one when `id` is given. */
export const upsert: WacheteEndpoints['foldersUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.upsert',
			input: Inputs.foldersUpsert,
			output: Outputs.foldersUpsert,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/thirdparty/v1/folder',
			body: body.id ? body : { ...body, id: undefined },
		}),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				created: parsed.id === undefined,
			}),
		},
	);

/**
 * Deleting a folder also deletes every subfolder and monitor inside it — which
 * makes this the most destructive call in the plugin.
 */
export const remove: WacheteEndpoints['foldersDelete'] = (ctx, input) =>
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
			path: `/thirdparty/v1/folder/${segment(id)}`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);

/** Moves monitors and folders into another folder. */
export const move: WacheteEndpoints['foldersMove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.move',
			input: Inputs.foldersMove,
			output: Outputs.foldersMove,
		},
		input,
		(body) => ({ method: 'POST', path: '/thirdparty/v1/folder/move', body }),
		{
			shape: (raw) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				moved: true,
			}),
			log: (parsed) => ({
				tasks: parsed.taskIds?.length ?? 0,
				folders: parsed.folderIds?.length ?? 0,
				into: parsed.folderId,
			}),
		},
	);
