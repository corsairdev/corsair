import type { PandadocEndpoints } from '..';
import { call } from './call';
import {
	PandadocEndpointInputSchemas as Inputs,
	PandadocEndpointOutputSchemas as Outputs,
} from './types';

export const list: PandadocEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ parentUuid, count, page }) => ({
			method: 'GET',
			path: '/public/v1/documents/folders',
			query: { parent_uuid: parentUuid, count, page },
		}),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const create: PandadocEndpoints['foldersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.create',
			input: Inputs.foldersCreate,
			output: Outputs.foldersCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/public/v1/documents/folders',
			body,
		}),
		{ log: (_, folder) => ({ folderId: folder.uuid }) },
	);

export const rename: PandadocEndpoints['foldersRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.rename',
			input: Inputs.foldersRename,
			output: Outputs.foldersRename,
		},
		input,
		({ id, name }) => ({
			method: 'PUT',
			path: `/public/v1/documents/folders/${encodeURIComponent(id)}`,
			body: { name },
		}),
		{ log: (_, folder) => ({ folderId: folder.uuid }) },
	);
