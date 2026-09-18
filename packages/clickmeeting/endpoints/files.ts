import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';
import type { ClickmeetingEndpointOutputs } from './types';

export const getFileLibrary: ClickmeetingEndpoints['getFileLibrary'] = async (
	ctx,
	input,
) => {
	const query = input.page ? { page: input.page } : undefined;
	const res = await makeClickmeetingRequest<
		ClickmeetingEndpointOutputs['getFileLibrary']
	>('/file-library', ctx.key, {
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
	const res = await makeClickmeetingRequest<
		ClickmeetingEndpointOutputs['getFileDetails']
	>(`/file-library/${encodeURIComponent(String(input.fileId))}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.files.getFileDetails',
		{ fileId: input.fileId },
		'completed',
	);
	return res;
};

function decodeFileContent(
	content: string,
	encoding?: 'base64' | 'raw',
): Buffer | string {
	if (encoding === 'raw') {
		return content;
	}
	const dataUriIndex = content.indexOf(';base64,');
	const base64Str =
		dataUriIndex !== -1
			? content.slice(dataUriIndex + 8).trim()
			: content.trim();
	const clean = base64Str.replace(/\s+/g, '');
	if (
		clean.length === 0 ||
		clean.length % 4 !== 0 ||
		!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)
	) {
		throw new Error('Invalid base64 content provided for file upload');
	}
	return Buffer.from(clean, 'base64');
}

export const uploadFile: ClickmeetingEndpoints['uploadFile'] = async (
	ctx,
	input,
) => {
	const formData = new FormData();
	const fileData = decodeFileContent(input.content, input.encoding);
	const blob = new Blob([fileData]);
	formData.append('uploaded', blob, input.name);
	if (input.conference_id !== undefined) {
		formData.append('conference_id', String(input.conference_id));
	}
	const res = await makeClickmeetingRequest<
		ClickmeetingEndpointOutputs['uploadFile']
	>('/file-library', ctx.key, {
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
	const res = await makeClickmeetingRequest<
		ClickmeetingEndpointOutputs['deleteFile']
	>(`/file-library/${encodeURIComponent(String(input.fileId))}`, ctx.key, {
		method: 'DELETE',
	});
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
	const res = await makeClickmeetingRequest<
		ClickmeetingEndpointOutputs['downloadFile']
	>(
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
