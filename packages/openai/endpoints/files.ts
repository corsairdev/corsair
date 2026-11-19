import { logEventFromContext } from 'corsair/core';
import { toFileOutput } from 'corsair/http';
import {
	DOWNLOAD_MAX_BYTES,
	downloadOpenaiFile,
	makeOpenaiRequest,
	OPENAI_UPLOAD_MAX_BYTES,
	uploadOpenaiFile,
} from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	FilesDeleteResponse,
	FilesListResponse,
	FilesRetrieveResponse,
	FilesUploadResponse,
} from '../schema/files';

export const upload: OpenaiEndpoints['filesUpload'] = async (ctx, input) => {
	const result = await uploadOpenaiFile<FilesUploadResponse>('files', ctx.key, {
		file: input.file,
		fileName: input.fileName,
		fields: { purpose: input.purpose },
		maxBytes: OPENAI_UPLOAD_MAX_BYTES.file,
	});

	await logEventFromContext(
		ctx,
		'openai.files.upload',
		{ fileName: input.fileName, purpose: input.purpose },
		'completed',
	);
	return result;
};

export const list: OpenaiEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<FilesListResponse>('files', ctx.key, {
		method: 'GET',
		query: {
			purpose: input.purpose,
			limit: input.limit,
			order: input.order,
			after: input.after,
		},
	});

	await logEventFromContext(
		ctx,
		'openai.files.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieve: OpenaiEndpoints['filesRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<FilesRetrieveResponse>(
		`files/${input.fileId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.files.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteFile: OpenaiEndpoints['filesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<FilesDeleteResponse>(
		`files/${input.fileId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.files.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const downloadContent: OpenaiEndpoints['filesDownloadContent'] = async (
	ctx,
	input,
) => {
	const file = await downloadOpenaiFile(
		`files/${input.fileId}/content`,
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'openai.files.downloadContent',
		{ ...input },
		'completed',
	);
	// `fileId` in the result is core's: where a host saved the file. OpenAI's id is the input.
	return toFileOutput(file.bytes, file.contentType, {
		filename: file.filename,
		maxBytes: DOWNLOAD_MAX_BYTES,
	});
};
