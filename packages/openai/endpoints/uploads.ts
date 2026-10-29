import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest, multipartOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	UploadsAddPartResponse,
	UploadsCancelResponse,
	UploadsCompleteResponse,
	UploadsCreateResponse,
} from '../schema/uploads';

export const create: OpenaiEndpoints['uploadsCreate'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<UploadsCreateResponse>(
		'uploads',
		ctx.key,
		{
			method: 'POST',
			body: {
				filename: input.filename,
				purpose: input.purpose,
				bytes: input.bytes,
				mime_type: input.mimeType,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.uploads.create',
		{ filename: input.filename, purpose: input.purpose, bytes: input.bytes },
		'completed',
	);
	return result;
};

export const addPart: OpenaiEndpoints['uploadsAddPart'] = async (
	ctx,
	input,
) => {
	const result = await multipartOpenaiRequest<UploadsAddPartResponse>(
		`uploads/${input.uploadId}/parts`,
		ctx.key,
		{ files: [{ field: 'data', file: input.data, fileName: input.fileName }] },
	);

	await logEventFromContext(
		ctx,
		'openai.uploads.addPart',
		{ uploadId: input.uploadId },
		'completed',
	);
	return result;
};

export const complete: OpenaiEndpoints['uploadsComplete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<UploadsCompleteResponse>(
		`uploads/${input.uploadId}/complete`,
		ctx.key,
		{ method: 'POST', body: { part_ids: input.partIds, md5: input.md5 } },
	);

	await logEventFromContext(
		ctx,
		'openai.uploads.complete',
		{ uploadId: input.uploadId, partCount: input.partIds.length },
		'completed',
	);
	return result;
};

export const cancel: OpenaiEndpoints['uploadsCancel'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<UploadsCancelResponse>(
		`uploads/${input.uploadId}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'openai.uploads.cancel',
		{ ...input },
		'completed',
	);
	return result;
};
