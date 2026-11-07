import type { ImageKitContext, ImageKitEndpoints } from '..';
import { call } from './call';
import {
	ImageKitEndpointInputSchemas as Inputs,
	ImageKitEndpointOutputSchemas as Outputs,
} from './types';

export const create: ImageKitEndpoints['foldersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.create',
			input: Inputs.foldersCreate,
			output: Outputs.foldersCreate,
		},
		input,
		({ folderName, parentFolderPath }) => ({
			method: 'POST',
			path: '/v1/folder',
			body: { folderName, parentFolderPath },
		}),
		{
			// 201 carries an empty-object body; an empty answer is fine too.
			shape: (raw) => raw ?? {},
			log: ({ folderName, parentFolderPath }) => ({ folderName, parentFolderPath }),
		},
	);

export const remove: ImageKitEndpoints['foldersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.delete',
			input: Inputs.foldersDelete,
			output: Outputs.foldersDelete,
		},
		input,
		({ folderPath }) => ({
			method: 'DELETE',
			path: '/v1/folder',
			body: { folderPath },
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ folderPath }) => ({ folderPath }),
		},
	);

// copy, move and rename submit bulk jobs and answer { jobId } at once; the
// job is read back with getJobStatus.
export const copy: ImageKitEndpoints['foldersCopy'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.copy',
			input: Inputs.foldersCopy,
			output: Outputs.foldersCopy,
		},
		input,
		({ sourceFolderPath, destinationPath, includeVersions }) => ({
			method: 'POST',
			path: '/v1/bulkJobs/copyFolder',
			body: { sourceFolderPath, destinationPath, includeVersions },
		}),
		{
			log: ({ sourceFolderPath, destinationPath }, result) => ({
				sourceFolderPath,
				destinationPath,
				jobId: result.jobId,
			}),
		},
	);

export const move: ImageKitEndpoints['foldersMove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.move',
			input: Inputs.foldersMove,
			output: Outputs.foldersMove,
		},
		input,
		({ sourceFolderPath, destinationPath }) => ({
			method: 'POST',
			path: '/v1/bulkJobs/moveFolder',
			body: { sourceFolderPath, destinationPath },
		}),
		{
			log: ({ sourceFolderPath, destinationPath }, result) => ({
				sourceFolderPath,
				destinationPath,
				jobId: result.jobId,
			}),
		},
	);

export const rename: ImageKitEndpoints['foldersRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.rename',
			input: Inputs.foldersRename,
			output: Outputs.foldersRename,
		},
		input,
		({ folderPath, newFolderName, purgeCache }) => ({
			method: 'POST',
			path: '/v1/bulkJobs/renameFolder',
			body: { folderPath, newFolderName, purgeCache },
		}),
		{
			log: ({ folderPath, newFolderName }, result) => ({
				folderPath,
				newFolderName,
				jobId: result.jobId,
			}),
		},
	);

export const getJobStatus: ImageKitEndpoints['foldersGetJobStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.getJobStatus',
			input: Inputs.foldersGetJobStatus,
			output: Outputs.foldersGetJobStatus,
		},
		input,
		({ jobId }) => ({
			method: 'GET',
			path: `/v1/bulkJobs/${jobId}`,
			replaySafe: true,
		}),
	);
