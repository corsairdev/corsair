import { logEventFromContext } from 'corsair/core';
import type { StudioByAI21LabsEndpoints } from '..';
import {
	makeStudioByAI21LabsRequest,
	uploadStudioByAI21LabsFile,
} from '../client';
import type { StudioByAI21LabsEndpointOutputs } from './types';

export const list: StudioByAI21LabsEndpoints['listLibraryFiles'] = async (
	ctx,
	input,
) => {
	const label = Array.isArray(input.label)
		? input.label.join(',')
		: input.label;
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['listLibraryFiles']
	>('library/files', ctx.key, {
		method: 'GET',
		query: {
			name: input.name,
			path: input.path,
			status: input.status,
			label,
			offset: input.offset,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.list',
		{ name: input.name, path: input.path, status: input.status },
		'completed',
	);
	return response;
};

export const upload: StudioByAI21LabsEndpoints['uploadWorkspaceFile'] = async (
	ctx,
	input,
) => {
	const { file, fileName, path, labels, publicUrl } = input;

	if (file !== undefined) {
		const fields: Record<string, string | undefined> = {
			path,
			publicUrl,
			labels: labels ? JSON.stringify(labels) : undefined,
		};
		const response = await uploadStudioByAI21LabsFile<
			StudioByAI21LabsEndpointOutputs['uploadWorkspaceFile']
		>('library/files', ctx.key, {
			file,
			fileName: fileName ?? 'upload',
			fields,
		});
		await logEventFromContext(
			ctx,
			'studiobyai21labs.library.upload',
			{ fileName: fileName ?? 'upload', path, publicUrl },
			'completed',
		);
		return response;
	}

	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['uploadWorkspaceFile']
	>('library/files', ctx.key, {
		method: 'POST',
		body: {
			path,
			labels,
			publicUrl,
		},
	});
	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.upload',
		{ path, publicUrl },
		'completed',
	);
	return response;
};

export const get: StudioByAI21LabsEndpoints['getWorkspaceFile'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['getWorkspaceFile']
	>(`library/files/${input.file_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.get',
		{ file_id: input.file_id },
		'completed',
	);
	return response;
};

export const update: StudioByAI21LabsEndpoints['updateFile'] = async (
	ctx,
	input,
) => {
	const { file_id, publicUrl, labels } = input;
	await makeStudioByAI21LabsRequest<undefined>(
		`library/files/${file_id}`,
		ctx.key,
		{ method: 'PUT', body: { publicUrl, labels } },
	);

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.update',
		{ file_id },
		'completed',
	);
	return undefined;
};

export const deleteFile: StudioByAI21LabsEndpoints['deleteFile'] = async (
	ctx,
	input,
) => {
	await makeStudioByAI21LabsRequest<undefined>(
		`library/files/${input.file_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.delete',
		{ file_id: input.file_id },
		'completed',
	);
	return undefined;
};

export const download: StudioByAI21LabsEndpoints['getFileDownloadLink'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest<
			StudioByAI21LabsEndpointOutputs['getFileDownloadLink']
		>(`library/files/${input.file_id}/download`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'studiobyai21labs.library.download',
			{ file_id: input.file_id },
			'completed',
		);
		return response;
	};
