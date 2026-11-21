import { logEventFromContext } from 'corsair/core';
import { toFileOutput } from 'corsair/http';
import type { GmicloudEndpoints } from '..';
import { downloadSandboxFile, makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

/**
 * Most bytes of a file returned inline to a caller without a host. A host that
 * keeps files (setFileSink) caps it at its own limit and gets a fileId instead.
 */
const DOWNLOAD_MAX_BYTES = 100_000_000;

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
		// Core's file output: base64 inline, or a fileId from a host that keeps
		// files once the file is too large to return inline.
		...toFileOutput(new Uint8Array(bytes), contentType, {
			filename: path.split('/').filter(Boolean).pop(),
			maxBytes: DOWNLOAD_MAX_BYTES,
			text: false,
		}),
		size: bytes.byteLength,
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
