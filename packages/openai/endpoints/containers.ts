import { logEventFromContext } from 'corsair/core';
import { toFileOutput } from 'corsair/http';
import {
	DOWNLOAD_MAX_BYTES,
	downloadOpenaiFile,
	makeOpenaiRequest,
	multipartOpenaiRequest,
} from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	ContainerFilesCreateResponse,
	ContainerFilesDeleteResponse,
	ContainerFilesListResponse,
	ContainerFilesRetrieveResponse,
	ContainersCreateResponse,
	ContainersDeleteResponse,
	ContainersListResponse,
	ContainersRetrieveResponse,
} from '../schema/containers';

// --- Containers ---

export const create: OpenaiEndpoints['containersCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ContainersCreateResponse>(
		'containers',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				file_ids: input.fileIds,
				expires_after: input.expiresAfter,
			},
		},
	);

	await logEventFromContext(ctx, 'openai.containers.create', {}, 'completed');
	return result;
};

export const list: OpenaiEndpoints['containersList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<ContainersListResponse>(
		'containers',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'openai.containers.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieve: OpenaiEndpoints['containersRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ContainersRetrieveResponse>(
		`containers/${input.containerId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.containers.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteContainer: OpenaiEndpoints['containersDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ContainersDeleteResponse>(
		`containers/${input.containerId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.containers.delete',
		{ ...input },
		'completed',
	);
	return result;
};

// --- Container Files ---

export const createFile: OpenaiEndpoints['containerFilesCreate'] = async (
	ctx,
	input,
) => {
	const result =
		input.file !== undefined && input.fileName !== undefined
			? await multipartOpenaiRequest<ContainerFilesCreateResponse>(
					`containers/${input.containerId}/files`,
					ctx.key,
					{
						files: [
							{ field: 'file', file: input.file, fileName: input.fileName },
						],
					},
				)
			: await makeOpenaiRequest<ContainerFilesCreateResponse>(
					`containers/${input.containerId}/files`,
					ctx.key,
					{ method: 'POST', body: { file_id: input.fileId } },
				);

	await logEventFromContext(
		ctx,
		'openai.containerFiles.create',
		{ containerId: input.containerId, fileId: input.fileId },
		'completed',
	);
	return result;
};

export const listFiles: OpenaiEndpoints['containerFilesList'] = async (
	ctx,
	input,
) => {
	const { containerId, ...query } = input;
	const result = await makeOpenaiRequest<ContainerFilesListResponse>(
		`containers/${containerId}/files`,
		ctx.key,
		{ method: 'GET', query: { ...query } },
	);

	await logEventFromContext(
		ctx,
		'openai.containerFiles.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieveFile: OpenaiEndpoints['containerFilesRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ContainerFilesRetrieveResponse>(
		`containers/${input.containerId}/files/${input.fileId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.containerFiles.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieveFileContent: OpenaiEndpoints['containerFilesRetrieveContent'] =
	async (ctx, input) => {
		const file = await downloadOpenaiFile(
			`containers/${input.containerId}/files/${input.fileId}/content`,
			ctx.key,
		);

		await logEventFromContext(
			ctx,
			'openai.containerFiles.retrieveContent',
			{ ...input },
			'completed',
		);
		// `fileId` in the result is core's: where a host saved the file. OpenAI's id is the input.
		return {
			containerId: input.containerId,
			...toFileOutput(file.bytes, file.contentType, {
				filename: file.filename,
				maxBytes: DOWNLOAD_MAX_BYTES,
			}),
		};
	};

export const deleteFile: OpenaiEndpoints['containerFilesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ContainerFilesDeleteResponse>(
		`containers/${input.containerId}/files/${input.fileId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.containerFiles.delete',
		{ ...input },
		'completed',
	);
	return result;
};
