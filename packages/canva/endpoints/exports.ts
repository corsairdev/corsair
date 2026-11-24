import { logEventFromContext } from 'corsair/core';
import type { DownloadDeps } from 'corsair/http';
import { downloadPublicFile, toFileOutput } from 'corsair/http';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import { loggable } from './mappers';
import { callCanva, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

/** Canva caps a page at 25,000 px a side; a hosted Files entry holds 25 MB. */
export const EXPORT_DOWNLOAD_MAX_BYTES = 25 * 1024 * 1024;

export const create: CanvaEndpoints['exportsCreate'] = async (ctx, input) =>
	callCanva<CanvaEndpointOutputs['exportsCreate']>(
		ctx,
		'exports.create',
		loggable(input),
		'v1/exports',
		{
			method: 'POST',
			body: {
				design_id: input.design_id,
				format: input.format,
			},
		},
	);

export const get: CanvaEndpoints['exportsGet'] = async (ctx, input) =>
	callCanva<CanvaEndpointOutputs['exportsGet']>(
		ctx,
		'exports.get',
		loggable(input),
		`v1/exports/${seg(input.exportId)}`,
	);

/** Tests swap the transport; production uses core's guarded fetch. */
export const exportDownloadDeps: { current: DownloadDeps } = { current: {} };

// Canva names each page's file after its page number (…/0003-<id>.png). Keep
// that, and fall back to the export id and position when the URL has no name.
function fileNameFor(url: string, exportId: string, index: number): string {
	try {
		const last = new URL(url).pathname.split('/').pop();
		if (last?.includes('.')) return decodeURIComponent(last);
	} catch {
		// fall through
	}
	return `${exportId}-${index + 1}`;
}

/**
 * Fetches one file of a finished export. The job is read again rather than
 * trusting a URL from the caller, so this only ever fetches what Canva handed
 * out, and the download goes without the Canva token (the URL is presigned).
 */
export const download: CanvaEndpoints['exportsDownload'] = async (
	ctx,
	input,
) => {
	const index = input.index ?? 0;
	const { job } = await makeCanvaRequest<CanvaEndpointOutputs['exportsGet']>(
		`v1/exports/${seg(input.exportId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	if (job.status !== 'success') {
		const reason =
			job.status === 'failed'
				? `failed${job.error ? `: ${job.error.code} ${job.error.message}` : ''}`
				: 'still in progress; wait for exports.get to report success';
		throw new Error(`Canva export ${input.exportId} is ${reason}.`);
	}
	const urls = job.urls ?? [];
	const url = urls[index];
	if (url === undefined) {
		throw new Error(
			`Canva export ${input.exportId} has ${urls.length} file(s); index ${index} is out of range.`,
		);
	}

	const got = await downloadPublicFile(
		url,
		{ maxBytes: EXPORT_DOWNLOAD_MAX_BYTES, timeoutMs: 60_000 },
		exportDownloadDeps.current,
	);
	const file = toFileOutput(got.bytes, got.contentType, {
		filename: fileNameFor(url, input.exportId, index),
		maxBytes: EXPORT_DOWNLOAD_MAX_BYTES,
		text: false,
	});

	await logEventFromContext(
		ctx,
		'canva.exports.download',
		{ exportId: input.exportId, index },
		'completed',
	);
	return {
		...file,
		exportId: input.exportId,
		index,
		count: urls.length,
		url,
	};
};
