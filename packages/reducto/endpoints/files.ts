import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	DeleteUploadInputSchema,
	DeleteUploadResponseSchema,
	UploadInputSchema,
	UploadResponseSchema,
} from './types';

export const upload: ReductoEndpoints['upload'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.files.upload',
		UploadInputSchema,
		UploadResponseSchema,
		input,
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
