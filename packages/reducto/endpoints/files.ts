import { resolveFileInput } from 'corsair/http';
import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	DeleteUploadInputSchema,
	DeleteUploadResponseSchema,
	UploadInputSchema,
	UploadRequestSchema,
	UploadResponseSchema,
} from './types';

/** Reducto's direct upload takes files up to 100 MB; larger ones go through a presigned URL. */
export const UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

export const upload: ReductoEndpoints['upload'] = async (ctx, input) => {
	const given = UploadInputSchema.parse(input);
	// A link or base64 becomes the file here; a Blob is sent as it was given.
	const file =
		given.file instanceof Blob
			? given.file
			: (
					await resolveFileInput(given.file, {
						maxBytes: UPLOAD_MAX_BYTES,
						fallbackName: 'upload',
					})
				).file;
	return callReducto(
		ctx,
		'reducto.files.upload',
		UploadRequestSchema,
		UploadResponseSchema,
		{ ...given, file },
		(body) => ({
			method: 'POST',
			url: '/upload',
			formData: { file: body.file },
			query: { extension: body.extension ?? undefined },
		}),
		(body, response) => ({
			fileId: response.file_id,
			// The file bytes are the payload. Only the declared extension is logged.
			extension: body.extension ?? null,
		}),
	);
};

export const remove: ReductoEndpoints['deleteUpload'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.files.delete',
		DeleteUploadInputSchema,
		DeleteUploadResponseSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: '/upload/{file_id}',
			path: { file_id: body.file_id },
		}),
		(body) => ({ fileId: body.file_id }),
	);
};
