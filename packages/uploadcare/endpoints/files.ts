import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareRequest } from '../client';
import type {
	BatchResponse,
	CopyLocalResponse,
	FileMetadata,
	FilesListResponse,
	UploadcareFile,
} from './types';

function listQuery(
	input: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(input)) {
		if (value !== undefined) query[key] = value;
	}
	return query;
}

export const list: UploadcareEndpoints['filesList'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<FilesListResponse>(
		'/files/',
		ctx.key,
		{ method: 'GET', query: listQuery(input) },
	);
	await logEventFromContext(ctx, 'uploadcare.files.list', input, 'completed');
	return response;
};

export const get: UploadcareEndpoints['fileGet'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<UploadcareFile>(
		`/files/${input.uuid}/`,
		ctx.key,
		{ method: 'GET', query: { include: input.include } },
	);
	await logEventFromContext(ctx, 'uploadcare.files.get', input, 'completed');
	return response;
};

export const store: UploadcareEndpoints['fileStore'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<UploadcareFile>(
		`/files/${input.uuid}/storage/`,
		ctx.key,
		{ method: 'PUT' },
	);
	await logEventFromContext(ctx, 'uploadcare.files.store', input, 'completed');
	return response;
};

export const deleteFile: UploadcareEndpoints['fileDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<UploadcareFile>(
		`/files/${input.uuid}/storage/`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'uploadcare.files.delete', input, 'completed');
	return response;
};

export const batchStore: UploadcareEndpoints['batchStoreFiles'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<BatchResponse>(
		'/files/storage/',
		ctx.key,
		{ method: 'PUT', body: input.uuids },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.batchStore',
		input,
		'completed',
	);
	return response;
};

export const batchDelete: UploadcareEndpoints['batchDeleteFiles'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<BatchResponse>(
		'/files/storage/',
		ctx.key,
		{ method: 'DELETE', body: input.uuids },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.batchDelete',
		input,
		'completed',
	);
	return response;
};

export const copyLocal: UploadcareEndpoints['copyLocal'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<CopyLocalResponse>(
		'/files/local_copy/',
		ctx.key,
		{
			method: 'POST',
			body: {
				source: input.source,
				store: input.store,
				metadata: input.metadata,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.copyLocal',
		input,
		'completed',
	);
	return response;
};

export const getMetadata: UploadcareEndpoints['getFileMetadata'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<FileMetadata>(
		`/files/${input.uuid}/metadata/`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.getMetadata',
		input,
		'completed',
	);
	return response;
};

export const getMetadataKey: UploadcareEndpoints['getFileMetadataKey'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<string>(
		`/files/${input.uuid}/metadata/${input.key}/`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.getMetadataKey',
		input,
		'completed',
	);
	return response;
};

export const updateMetadataKey: UploadcareEndpoints['updateFileMetadataKey'] =
	async (ctx, input) => {
		const response = await makeUploadcareRequest<string>(
			`/files/${input.uuid}/metadata/${input.key}/`,
			ctx.key,
			{ method: 'PUT', body: input.value },
		);
		await logEventFromContext(
			ctx,
			'uploadcare.files.updateMetadataKey',
			input,
			'completed',
		);
		return response;
	};

export const deleteMetadataKey: UploadcareEndpoints['deleteFileMetadataKey'] =
	async (ctx, input) => {
		await makeUploadcareRequest<void>(
			`/files/${input.uuid}/metadata/${input.key}/`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'uploadcare.files.deleteMetadataKey',
			input,
			'completed',
		);
		return { success: true as const };
	};
