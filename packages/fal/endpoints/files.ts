import { logEventFromContext } from 'corsair/core';
import { FalAPIError, makeFalRequest, putToSignedUrl } from '../client';
import type { FalEndpoints } from '../index';
import {
	FalEndpointInputSchemas,
	FalEndpointOutputSchemas,
	FilesUploadInitiateResponseSchema,
} from './types';

// One-shot uploads only; fal's own client switches to multipart above ~90 MB.
const MAX_UPLOAD_BYTES = 90 * 1024 * 1024;

function decodeBase64(content: string): Uint8Array {
	const data = content.replace(/^data:[^,]*;base64,/, '').replace(/\s+/g, '');
	if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(data)) {
		throw new FalAPIError('contentBase64 is not valid base64.');
	}
	return new Uint8Array(Buffer.from(data, 'base64'));
}

function extensionFor(contentType: string): string {
	const subtype = contentType.split('/')[1] ?? '';
	return subtype.split(/[-;+]/)[0] || 'bin';
}

export const upload: FalEndpoints['filesUpload'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.filesUpload.parse(rawInput);
	const bytes = decodeBase64(input.contentBase64);
	if (bytes.byteLength === 0) {
		throw new FalAPIError('contentBase64 decodes to an empty file.');
	}
	if (bytes.byteLength > MAX_UPLOAD_BYTES) {
		throw new FalAPIError(
			`The file is ${bytes.byteLength} bytes; files.upload takes up to ${MAX_UPLOAD_BYTES}.`,
		);
	}

	const fileName =
		input.fileName ?? `${Date.now()}.${extensionFor(input.contentType)}`;
	const initiated = FilesUploadInitiateResponseSchema.parse(
		await makeFalRequest('rest', '/storage/upload/initiate', ctx.key, {
			method: 'POST',
			query: { storage_type: 'fal-cdn-v3' },
			body: { content_type: input.contentType, file_name: fileName },
		}),
	);
	await putToSignedUrl(initiated.upload_url, bytes, input.contentType);

	const response = FalEndpointOutputSchemas.filesUpload.parse({
		file_url: initiated.file_url,
		file_name: fileName,
		content_type: input.contentType,
		size: bytes.byteLength,
	});
	await logEventFromContext(
		ctx,
		'fal.files.upload',
		{ fileName, contentType: input.contentType, size: bytes.byteLength },
		'completed',
	);
	return response;
};
