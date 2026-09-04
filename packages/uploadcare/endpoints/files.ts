import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareRequest } from '../client';
import type { BatchResponse, FilesListResponse, UploadcareFile } from './types';

export const list: UploadcareEndpoints['filesList'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<FilesListResponse>(
		'files/',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: UploadcareEndpoints['fileGet'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<UploadcareFile>(
		`files/${input.file_id}/`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const store: UploadcareEndpoints['fileStore'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<UploadcareFile>(
		`files/${input.file_id}/storage/`,
		ctx.key,
		{
			method: 'PUT',
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.store',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteFile: UploadcareEndpoints['fileDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<UploadcareFile>(
		`files/${input.file_id}/storage/`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const batchStore: UploadcareEndpoints['batchStoreFiles'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<BatchResponse>(
		'files/storage/',
		ctx.key,
		{
			method: 'PUT',
			body: input.file_ids,
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.batchStore',
		{ ...input },
		'completed',
	);
	return response;
};

export const batchDelete: UploadcareEndpoints['batchDeleteFiles'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<BatchResponse>(
		'files/storage/',
		ctx.key,
		{
			method: 'DELETE',
			body: input.file_ids,
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.files.batchDelete',
		{ ...input },
		'completed',
	);
	return response;
};
