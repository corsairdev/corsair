import { logEventFromContext } from 'corsair/core';
import {
	HiggsfieldError,
	makeHiggsfieldRequest,
	putToPresignedUrl,
} from '../client';
import type { HiggsfieldEndpoints } from '../index';
import type { FilesCreateUploadUrlResponse } from './types';
import {
	HiggsfieldEndpointInputSchemas,
	HiggsfieldEndpointOutputSchemas,
} from './types';

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

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
		throw new HiggsfieldError(
			'contentBase64 is not valid base64.',
			'invalid_input',
		);
	}
	const size = Math.floor((unpadded.length * 3) / 4);
	if (size === 0) {
		throw new HiggsfieldError(
			'contentBase64 decodes to an empty file.',
			'invalid_input',
		);
	}
	if (size > MAX_UPLOAD_BYTES) {
		throw new HiggsfieldError(
			`The file is ${size} bytes; files.upload takes up to ${MAX_UPLOAD_BYTES}.`,
			'invalid_input',
		);
	}
	return Buffer.from(unpadded, 'base64');
}

async function createUploadUrlFor(
	apiKey: string,
	contentType: string,
): Promise<FilesCreateUploadUrlResponse> {
	return HiggsfieldEndpointOutputSchemas.filesCreateUploadUrl.parse(
		await makeHiggsfieldRequest(apiKey, '/files/generate-upload-url', {
			method: 'POST',
			body: { content_type: contentType },
		}),
	);
}

export const createUploadUrl: HiggsfieldEndpoints['filesCreateUploadUrl'] =
	async (ctx, rawInput) => {
		const input =
			HiggsfieldEndpointInputSchemas.filesCreateUploadUrl.parse(rawInput);
		const response = await createUploadUrlFor(ctx.key, input.contentType);
		await logEventFromContext(
			ctx,
			'higgsfield.files.createUploadUrl',
			{ contentType: input.contentType },
			'completed',
		);
		return response;
	};

export const upload: HiggsfieldEndpoints['filesUpload'] = async (
	ctx,
	rawInput,
) => {
	const { contentBase64, contentType } =
		HiggsfieldEndpointInputSchemas.filesUpload.parse(rawInput);
	const bytes = decodeBase64(contentBase64);

	const created = await createUploadUrlFor(ctx.key, contentType);
	await putToPresignedUrl(created.upload_url, bytes, {
		'Content-Type': contentType,
		...created.upload_headers,
	});

	const response = HiggsfieldEndpointOutputSchemas.filesUpload.parse({
		public_url: created.public_url,
		content_type: contentType,
		size: bytes.byteLength,
	});
	await logEventFromContext(
		ctx,
		'higgsfield.files.upload',
		{ contentType, size: bytes.byteLength },
		'completed',
	);
	return response;
};
