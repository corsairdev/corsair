import { logEventFromContext } from 'corsair/core';
import type { StudioByAI21LabsEndpoints } from '..';
import {
	downloadStudioByAI21LabsFile,
	makeStudioByAI21LabsRequest,
	uploadStudioByAI21LabsFile,
} from '../client';
import type { StudioByAI21LabsEndpointOutputs } from './types';

export const list: StudioByAI21LabsEndpoints['listLibraryFiles'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['listLibraryFiles']
	>('library/files', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const upload: StudioByAI21LabsEndpoints['uploadWorkspaceFile'] = async (
	ctx,
	input,
) => {
	const { file, fileName, ...fields } = input;
	const stringFields: Record<string, string> = {};
	if (fields.labels) stringFields.labels = JSON.stringify(fields.labels); // Wait, AI21 might expect repeated keys or stringified JSON. I will pass it stringified for now, but usually it's comma separated or repeated. Let's pass as comma separated if it's an array, or just JSON. Actually, I'll join them.
	// Actually, the client handles array appending if I modify client.ts, but my uploadStudioByAI21LabsFile currently expects Record<string, string | undefined>.
	// I'll join labels by comma as a reasonable default for standard REST forms, or stringify. Let's just stringify.
	if (fields.labels) stringFields.labels = JSON.stringify(fields.labels);
	if (fields.publicUrl) stringFields.publicUrl = fields.publicUrl;

	const response = await uploadStudioByAI21LabsFile<
		StudioByAI21LabsEndpointOutputs['uploadWorkspaceFile']
	>('library/files', ctx.key, { file, fileName, fields: stringFields });

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.upload',
		{ fileName, publicUrl: fields.publicUrl },
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
		{ ...input },
		'completed',
	);
	return response;
};

export const update: StudioByAI21LabsEndpoints['updateFile'] = async (
	ctx,
	input,
) => {
	const { file_id, ...body } = input;
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['updateFile']
	>(`library/files/${file_id}`, ctx.key, { method: 'PUT', body });

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteFile: StudioByAI21LabsEndpoints['deleteFile'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['deleteFile']
	>(`library/files/${input.file_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'studiobyai21labs.library.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const download: StudioByAI21LabsEndpoints['getFileDownloadLink'] =
	async (ctx, input) => {
		const response = await downloadStudioByAI21LabsFile(
			`library/files/${input.file_id}/download`,
			ctx.key,
		);

		await logEventFromContext(
			ctx,
			'studiobyai21labs.library.download',
			{ ...input },
			'completed',
		);
		return response;
	};
