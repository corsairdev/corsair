import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const getFileLibrary: ClickmeetingEndpoints['getFileLibrary'] = async (
	ctx,
	input,
) => {
	const query = input.page ? { page: input.page } : undefined;
	const res = await makeClickmeetingRequest<any>('/file-library', ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.files.getFileLibrary',
		{},
		'completed',
	);
	return res;
};

export const getFileDetails: ClickmeetingEndpoints['getFileDetails'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>(
		`/file-library/${encodeURIComponent(String(input.fileId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.files.getFileDetails',
		{ fileId: input.fileId },
		'completed',
	);
	return res;
};

export const uploadFile: ClickmeetingEndpoints['uploadFile'] = async (
	ctx,
	input,
) => {
	const formData = new FormData();
	const blob = new Blob([input.content]);
	formData.append('uploaded', blob, input.name);
	if (input.conference_id !== undefined) {
		formData.append('conference_id', String(input.conference_id));
	}
	const res = await makeClickmeetingRequest<any>('/file-library', ctx.key, {
		method: 'POST',
		body: formData,
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.files.uploadFile',
		{ name: input.name },
		'completed',
	);
	return res;
};

export const deleteFile: ClickmeetingEndpoints['deleteFile'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>(
		`/file-library/${encodeURIComponent(String(input.fileId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.files.deleteFile',
		{ fileId: input.fileId },
		'completed',
	);
	return res;
};

export const downloadFile: ClickmeetingEndpoints['downloadFile'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>(
		`/file-library/${encodeURIComponent(String(input.fileId))}/download`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.files.downloadFile',
		{ fileId: input.fileId },
		'completed',
	);
	return res;
};
