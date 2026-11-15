import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

const JOBNIMBUS_FILES_API_BASE = 'https://api.jobnimbus.com';
const JOBNIMBUS_APP_BASE = 'https://app.jobnimbus.com';

export const filesCreate: JobNimbusEndpoints['filesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.filesCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/files',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.filesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.files.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const filesCreateFromUrl: JobNimbusEndpoints['filesCreateFromUrl'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.filesCreateFromUrl.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/files/fromUrl',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.filesCreateFromUrl.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.files.create_from_url',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const filesRequestSinglePartUpload: JobNimbusEndpoints['filesRequestSinglePartUpload'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.filesRequestSinglePartUpload.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/files/v1/uploads/url',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
				baseUrl: JOBNIMBUS_FILES_API_BASE,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.filesRequestSinglePartUpload.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.files.request_single_part_upload',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const filesCompleteSinglePartUpload: JobNimbusEndpoints['filesCompleteSinglePartUpload'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.filesCompleteSinglePartUpload.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			`/files/v1/uploads/${encodeURIComponent(parsedInput.jnid)}/complete`,
			ctx.key,
			{
				method: 'POST',
				query: compactQuery({
					generateThumbnail: parsedInput.generateThumbnail,
				}),
				baseUrl: JOBNIMBUS_FILES_API_BASE,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.filesCompleteSinglePartUpload.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'jobnimbus.files.complete_single_part_upload',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const filesRequestMultipartUpload: JobNimbusEndpoints['filesRequestMultipartUpload'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.filesRequestMultipartUpload.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/files/v1/uploads/multi-urls',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
				baseUrl: JOBNIMBUS_FILES_API_BASE,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.filesRequestMultipartUpload.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'jobnimbus.files.request_multipart_upload',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const filesCompleteMultipartUpload: JobNimbusEndpoints['filesCompleteMultipartUpload'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.filesCompleteMultipartUpload.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			`/files/v1/uploads/${encodeURIComponent(parsedInput.jnid)}/complete`,
			ctx.key,
			{
				method: 'POST',
				body: {
					jnid: parsedInput.jnid,
					uploadId: parsedInput.uploadId,
					parts: parsedInput.parts,
				},
				query: compactQuery({
					generateThumbnail: parsedInput.generateThumbnail,
				}),
				baseUrl: JOBNIMBUS_FILES_API_BASE,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.filesCompleteMultipartUpload.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'jobnimbus.files.complete_multipart_upload',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const filesAbortMultipartUpload: JobNimbusEndpoints['filesAbortMultipartUpload'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.filesAbortMultipartUpload.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/files/v1/uploads/multi-abort',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
				baseUrl: JOBNIMBUS_FILES_API_BASE,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.filesAbortMultipartUpload.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.files.abort_multipart_upload',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const filesList: JobNimbusEndpoints['filesList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.filesList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/files',
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				size: parsedInput.size,
				from: parsedInput.from,
				sort: parsedInput.sort,
				direction: parsedInput.direction,
				actor: parsedInput.actor,
			}),
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.filesList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.files.list',
		{ count: parsed.files?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const filesGet: JobNimbusEndpoints['filesGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.filesGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/files/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: JOBNIMBUS_APP_BASE,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.filesGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.files.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const Files = {
	create: filesCreate,
	createFromUrl: filesCreateFromUrl,
	requestSinglePartUpload: filesRequestSinglePartUpload,
	completeSinglePartUpload: filesCompleteSinglePartUpload,
	requestMultipartUpload: filesRequestMultipartUpload,
	completeMultipartUpload: filesCompleteMultipartUpload,
	abortMultipartUpload: filesAbortMultipartUpload,
	list: filesList,
	get: filesGet,
};
