import type { StannpEndpoints } from '..';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const upload: StannpEndpoints['filesUpload'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.upload',
			input: Inputs.filesUpload,
			output: Outputs.filesUpload,
		},
		input,
		({ file, folder, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/files/upload',
			form: { file, folder },
			idempotencyKey,
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const createFolder: StannpEndpoints['filesCreateFolder'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.createFolder',
			input: Inputs.filesCreateFolder,
			output: Outputs.filesCreateFolder,
		},
		input,
		({ name, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/files/createFolder',
			form: { name },
			idempotencyKey,
		}),
		{
			log: (_, result) => ({ folderId: result }),
		},
	);

export const listFolders: StannpEndpoints['filesListFolders'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.listFolders',
			input: Inputs.filesListFolders,
			output: Outputs.filesListFolders,
		},
		input,
		(_parsed, base) => ({
			method: 'GET',
			base,
			path: '/v1/files/folders',
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);
