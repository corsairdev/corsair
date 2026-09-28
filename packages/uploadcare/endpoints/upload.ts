import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareUploadRequest, publicKeyFromAuth } from '../client';
import type {
	MultipartStartResponse,
	UploadcareGroup,
	UploadedFileInfo,
	UploadFromUrlResponse,
	UploadFromUrlStatusResponse,
} from './types';

export const fromUrl: UploadcareEndpoints['uploadFromUrl'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareUploadRequest<UploadFromUrlResponse>(
		'/from_url/',
		{
			method: 'POST',
			formData: {
				pub_key: publicKeyFromAuth(ctx.key),
				source_url: input.source_url,
				store: input.store,
				filename: input.filename,
				check_URL_duplicates: input.check_URL_duplicates,
				save_URL_duplicates: input.save_URL_duplicates,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.upload.fromUrl',
		input,
		'completed',
	);
	return response;
};

export const fromUrlStatus: UploadcareEndpoints['getUrlUploadStatus'] = async (
	ctx,
	input,
) => {
	const response =
		await makeUploadcareUploadRequest<UploadFromUrlStatusResponse>(
			'/from_url/status/',
			{ method: 'GET', query: { token: input.token } },
		);
	await logEventFromContext(
		ctx,
		'uploadcare.upload.fromUrlStatus',
		input,
		'completed',
	);
	return response;
};

export const fileInfo: UploadcareEndpoints['getUploadedFileInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareUploadRequest<UploadedFileInfo>(
		'/info/',
		{
			method: 'GET',
			query: {
				pub_key: publicKeyFromAuth(ctx.key),
				file_id: input.file_id,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.upload.fileInfo',
		input,
		'completed',
	);
	return response;
};

export const createGroup: UploadcareEndpoints['createFileGroupUpload'] = async (
	ctx,
	input,
) => {
	const formData: Record<string, string> = {
		pub_key: publicKeyFromAuth(ctx.key),
	};
	input.files.forEach((uuid, index) => {
		formData[`files[${index}]`] = uuid;
	});
	const response = await makeUploadcareUploadRequest<UploadcareGroup>(
		'/group/',
		{ method: 'POST', formData },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.upload.createGroup',
		input,
		'completed',
	);
	return response;
};

export const groupInfo: UploadcareEndpoints['getFileGroupInfoUpload'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareUploadRequest<UploadcareGroup>(
		'/group/info/',
		{
			method: 'GET',
			query: {
				pub_key: publicKeyFromAuth(ctx.key),
				group_id: input.group_id,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'uploadcare.upload.groupInfo',
		input,
		'completed',
	);
	return response;
};

export const startMultipart: UploadcareEndpoints['startMultipartUpload'] =
	async (ctx, input) => {
		const response = await makeUploadcareUploadRequest<MultipartStartResponse>(
			'/multipart/start/',
			{
				method: 'POST',
				formData: {
					UPLOADCARE_PUB_KEY: publicKeyFromAuth(ctx.key),
					filename: input.filename,
					size: input.size,
					content_type: input.content_type,
					UPLOADCARE_STORE: input.store,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'uploadcare.upload.startMultipart',
			input,
			'completed',
		);
		return response;
	};
