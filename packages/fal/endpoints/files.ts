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

/**
 * Decodes standard or URL-safe base64, padded or not, after checking the
 * decoded size. Node's decoder silently drops an incomplete last group
 * (`YWJjA` decodes to `abc`), so a length that leaves one spare character, or
 * padding that does not complete the last group, is refused.
 */
function decodeBase64(content: string): Buffer {
	const data = content
		.replace(/^data:[^,]*;base64,/, '')
		.replace(/\s+/g, '')
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const unpadded = data.replace(/={1,2}$/, '');
	const padded = data.length !== unpadded.length;
	if (
		!/^[A-Za-z0-9+/]*$/.test(unpadded) ||
		unpadded.length % 4 === 1 ||
		(padded && data.length % 4 !== 0)
	) {
		throw new FalAPIError('contentBase64 is not valid base64.');
	}

	const size = Math.floor((unpadded.length * 3) / 4);
	if (size === 0) {
		throw new FalAPIError('contentBase64 decodes to an empty file.');
	}
	if (size > MAX_UPLOAD_BYTES) {
		throw new FalAPIError(
			`The file is ${size} bytes; files.upload takes up to ${MAX_UPLOAD_BYTES}.`,
		);
	}
	return Buffer.from(unpadded, 'base64');
}

function extensionFor(contentType: string): string {
	const subtype = contentType.split('/')[1] ?? '';
	return subtype.split(/[-;+]/)[0] || 'bin';
}

export const upload: FalEndpoints['filesUpload'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.filesUpload.parse(rawInput);
	const bytes = decodeBase64(input.contentBase64);

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
