import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { downloadSandboxFile, makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const download: GmicloudEndpoints['sandboxFilesDownload'] = async (
	ctx,
	input,
) => {
	const { sandbox_key, domain, access_token, path, username, range } =
		GmicloudEndpointInputSchemas.sandboxFilesDownload.parse(input);
	const { bytes, contentType } = await downloadSandboxFile(
		{ sandbox_key, domain, access_token },
		{ path, username },
		range,
	);
	const result = GmicloudEndpointOutputSchemas.sandboxFilesDownload.parse({
		path,
		contentType,
		size: bytes.byteLength,
		contentBase64: Buffer.from(bytes).toString('base64'),
	});
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxFiles.download',
		{ path, size: result.size },
		'completed',
	);
	return result;
};

export const upload: GmicloudEndpoints['sandboxFilesUpload'] = async (
	ctx,
	input,
) => {
	const {
		sandbox_key,
		domain,
		access_token,
		path,
		username,
		content,
		encoding,
	} = GmicloudEndpointInputSchemas.sandboxFilesUpload.parse(input);
	const file = new Blob([Buffer.from(content, encoding)], {
		type: 'application/octet-stream',
	});
	const result = GmicloudEndpointOutputSchemas.sandboxFilesUpload.parse(
		await makeGmicloudRequest(ctx, {
			api: 'sandbox',
			method: 'POST',
			url: 'files',
			sandbox: { sandbox_key, domain, access_token },
			query: { path, username },
			formData: { file },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxFiles.upload',
		{ path, size: file.size },
		'completed',
	);
	return result;
};
