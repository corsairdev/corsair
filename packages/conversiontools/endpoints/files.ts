import { logEventFromContext } from 'corsair/core';
import type { ConversiontoolsEndpoints } from '..';
import {
	CONVERSIONTOOLS_API_BASE,
	makeConversiontoolsDownloadByIdRequest,
	makeConversiontoolsDownloadFromLinkRequest,
	makeConversiontoolsRequest,
	parseJsonTextResponse,
} from '../client';
import { DEFAULT_TRANSFER_TIMEOUT_MS } from '../limits';
import type {
	FilesCreateDownloadLinkResponse,
	FilesCreateUploadSessionResponse,
	FilesGetInfoResponse,
	FilesUploadResponse,
	FilesUploadToSessionResponse,
} from './types';
import {
	ConversiontoolsEndpointInputSchemas,
	ConversiontoolsEndpointOutputSchemas,
} from './types';

const upload: ConversiontoolsEndpoints['files']['upload'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.filesUpload.parse(input);
	const response = await makeConversiontoolsRequest<
		FilesUploadResponse | string
	>('/files', ctx.key, {
		method: 'POST',
		formData: { file: parsedInput.file },
		timeoutMs: ctx.options?.transferTimeoutMs ?? DEFAULT_TRANSFER_TIMEOUT_MS,
	});
	const parsed = ConversiontoolsEndpointOutputSchemas.filesUpload.parse(
		parseJsonTextResponse(response),
	);
	await logEventFromContext(
		ctx,
		'conversiontools.files.upload',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

const getInfo: ConversiontoolsEndpoints['files']['getInfo'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.filesGetInfo.parse(input);
	const response = await makeConversiontoolsRequest<FilesGetInfoResponse>(
		`/files/${encodeURIComponent(parsedInput.file_id)}/info`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.filesGetInfo.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.files.getInfo',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

const createDownloadLink: ConversiontoolsEndpoints['files']['createDownloadLink'] =
	async (ctx, input) => {
		const parsedInput =
			ConversiontoolsEndpointInputSchemas.filesCreateDownloadLink.parse(input);
		const response =
			await makeConversiontoolsRequest<FilesCreateDownloadLinkResponse>(
				`/files/${encodeURIComponent(parsedInput.file_id)}/download`,
				ctx.key,
				{ method: 'POST' },
			);
		const parsed =
			ConversiontoolsEndpointOutputSchemas.filesCreateDownloadLink.parse(
				response,
			);
		// The download_id is a temporary bearer-like secret; do not log it.
		await logEventFromContext(
			ctx,
			'conversiontools.files.createDownloadLink',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

const downloadById: ConversiontoolsEndpoints['files']['downloadById'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.filesDownloadById.parse(input);
	const response = await makeConversiontoolsDownloadByIdRequest(
		parsedInput.file_id,
		ctx.key,
		ctx.options?.transferTimeoutMs ?? DEFAULT_TRANSFER_TIMEOUT_MS,
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.filesDownloadById.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.files.downloadById',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

const downloadFromLink: ConversiontoolsEndpoints['files']['downloadFromLink'] =
	async (ctx, input) => {
		const parsedInput =
			ConversiontoolsEndpointInputSchemas.filesDownloadFromLink.parse(input);
		const response = await makeConversiontoolsDownloadFromLinkRequest(
			parsedInput.download_id,
			ctx.options?.transferTimeoutMs ?? DEFAULT_TRANSFER_TIMEOUT_MS,
		);
		const parsed =
			ConversiontoolsEndpointOutputSchemas.filesDownloadFromLink.parse(
				response,
			);
		// download_id is a temporary bearer-like secret; only log a count.
		await logEventFromContext(
			ctx,
			'conversiontools.files.downloadFromLink',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

const createUploadSession: ConversiontoolsEndpoints['files']['createUploadSession'] =
	async (ctx, input) => {
		const parsedInput =
			ConversiontoolsEndpointInputSchemas.filesCreateUploadSession.parse(input);
		const response =
			await makeConversiontoolsRequest<FilesCreateUploadSessionResponse>(
				'/upload-sessions',
				ctx.key,
				{ method: 'POST', body: { filename: parsedInput.filename } },
			);
		const parsed =
			ConversiontoolsEndpointOutputSchemas.filesCreateUploadSession.parse(
				response,
			);
		// upload_url carries the one-time upload credential; never log it.
		await logEventFromContext(
			ctx,
			'conversiontools.files.createUploadSession',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

const uploadToSession: ConversiontoolsEndpoints['files']['uploadToSession'] =
	async (ctx, input) => {
		const parsedInput =
			ConversiontoolsEndpointInputSchemas.filesUploadToSession.parse(input);
		const uploadUrl = new URL(parsedInput.upload_url);
		const apiOrigin = new URL(CONVERSIONTOOLS_API_BASE).origin;
		const sessionPathPrefix = '/v1/upload-sessions/';
		const sessionPath = uploadUrl.pathname.slice(sessionPathPrefix.length);
		if (
			uploadUrl.protocol !== 'https:' ||
			uploadUrl.origin !== apiOrigin ||
			uploadUrl.username.length > 0 ||
			uploadUrl.password.length > 0 ||
			!uploadUrl.pathname.startsWith(sessionPathPrefix) ||
			sessionPath.length === 0 ||
			sessionPath.includes('/') ||
			uploadUrl.search.length > 0 ||
			uploadUrl.hash.length > 0
		) {
			throw new Error('Invalid Conversion Tools upload session URL');
		}
		const response =
			await makeConversiontoolsRequest<FilesUploadToSessionResponse>(
				uploadUrl.pathname,
				undefined,
				{
					method: 'PUT',
					body: parsedInput.file,
					baseUrl: uploadUrl.origin,
					timeoutMs:
						ctx.options?.transferTimeoutMs ?? DEFAULT_TRANSFER_TIMEOUT_MS,
				},
			);
		const parsed =
			ConversiontoolsEndpointOutputSchemas.filesUploadToSession.parse(response);
		// The URL contains the session credential; only log the uploaded byte count.
		await logEventFromContext(
			ctx,
			'conversiontools.files.uploadToSession',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const Files = {
	upload,
	getInfo,
	createDownloadLink,
	downloadById,
	downloadFromLink,
	createUploadSession,
	uploadToSession,
};
