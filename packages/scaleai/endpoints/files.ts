import { logEventFromContext } from 'corsair/core';
import type { ScaleAiEndpoints } from '..';
import { makeScaleAiRequest } from '../client';
import type { GetAssetsResponse, ScaleFile } from './types';

function decodeBase64(value: string): Uint8Array {
	if (typeof atob === 'function') {
		const binary = atob(value);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	}
	return new Uint8Array(Buffer.from(value, 'base64'));
}

export const getAssets: ScaleAiEndpoints['getAssets'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {
		project: input.project,
		limit: input.limit,
		next_token: input.next_token,
	};
	if (input.metadata !== undefined) {
		query.metadata = JSON.stringify(input.metadata);
	}
	const response = await makeScaleAiRequest<GetAssetsResponse>(
		'files',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.files.getAssets',
		{ count: response.docs.length, has_more: response.has_more ?? false },
		'completed',
	);
	return response;
};

export const importFile: ScaleAiEndpoints['importFile'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleFile>(
		'files/import',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.files.import',
		{ project_name: input.project_name },
		'completed',
	);
	return response;
};

export const uploadFile: ScaleAiEndpoints['uploadFile'] = async (
	ctx,
	input,
) => {
	const bytes = decodeBase64(input.file_base64);
	const blob = new Blob([bytes], {
		type: input.mime_type ?? 'application/octet-stream',
	});

	const formData: Record<string, unknown> = {
		file: new File([blob], input.file_name, { type: blob.type }),
	};
	if (input.project_name !== undefined)
		formData.project_name = input.project_name;
	if (input.reference_id !== undefined)
		formData.reference_id = input.reference_id;
	if (input.metadata !== undefined)
		formData.metadata = JSON.stringify(input.metadata);

	const response = await makeScaleAiRequest<ScaleFile>(
		'files/upload',
		ctx.key,
		{
			method: 'POST',
			formData,
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.files.upload',
		{ file_name: input.file_name, project_name: input.project_name },
		'completed',
	);
	return response;
};
