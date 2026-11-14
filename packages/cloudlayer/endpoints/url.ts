import { logEventFromContext } from 'corsair/core';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest, makeCloudlayerSyncRequest } from '../client';
import type {
	UrlToImageOutput,
	UrlToImageQuickOutput,
	UrlToPdfOutput,
	UrlToPdfQuickOutput,
} from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './types';

// https://cloudlayer.io/docs/url-to-pdf/ — POST /v2/url/pdf; async:false is JSON
export const urlToPdf: CloudlayerEndpoints['url']['toPdf'] = async (
	ctx,
	input,
) => {
	const parsedInput = CloudlayerEndpointInputSchemas['url.toPdf'].parse(input);

	const response =
		parsedInput.async === false
			? await makeCloudlayerSyncRequest('/url/pdf', ctx.key, {
					method: 'POST',
					body: parsedInput,
				})
			: await makeCloudlayerRequest<UrlToPdfOutput>('/url/pdf', ctx.key, {
					method: 'POST',
					body: parsedInput,
				});

	const parsed = CloudlayerEndpointOutputSchemas['url.toPdf'].parse(response);

	// The captured URL is not logged: it can point at a private or
	// authenticated page, and the batch size is already the count.
	await logEventFromContext(
		ctx,
		'cloudlayer.url.toPdf',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/url-to-pdf/ — POST /v1/url/pdf (binary PDF)
export const urlToPdfV1: CloudlayerEndpoints['url']['toPdfV1'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['url.toPdfV1'].parse(input);
	const response = await makeCloudlayerSyncRequest('/url/pdf', ctx.key, {
		method: 'POST',
		apiVersion: 'v1',
		body: parsedInput,
	});
	const parsed = CloudlayerEndpointOutputSchemas['url.toPdfV1'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.url.toPdfV1',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

// https://cloudlayer.io/docs/url-to-pdf/ — GET /v2/url/pdf (convenience route)
export const urlToPdfQuick: CloudlayerEndpoints['url']['toPdfQuick'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['url.toPdfQuick'].parse(input);

	const response = await makeCloudlayerRequest<UrlToPdfQuickOutput>(
		'/url/pdf',
		ctx.key,
		{
			method: 'GET',
			query: { url: parsedInput.url, timeout: parsedInput.timeout },
		},
	);

	const parsed =
		CloudlayerEndpointOutputSchemas['url.toPdfQuick'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.url.toPdfQuick',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/url-to-pdf/ — GET /v1/url/pdf (binary PDF)
export const urlToPdfQuickV1: CloudlayerEndpoints['url']['toPdfQuickV1'] =
	async (ctx, input) => {
		const parsedInput =
			CloudlayerEndpointInputSchemas['url.toPdfQuickV1'].parse(input);
		const response = await makeCloudlayerSyncRequest('/url/pdf', ctx.key, {
			method: 'GET',
			apiVersion: 'v1',
			query: { url: parsedInput.url, timeout: parsedInput.timeout },
		});
		const parsed =
			CloudlayerEndpointOutputSchemas['url.toPdfQuickV1'].parse(response);

		await logEventFromContext(
			ctx,
			'cloudlayer.url.toPdfQuickV1',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

// https://cloudlayer.io/docs/url-to-image/ — POST /v2/url/image; async:false is JSON
export const urlToImage: CloudlayerEndpoints['url']['toImage'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['url.toImage'].parse(input);

	const response =
		parsedInput.async === false
			? await makeCloudlayerSyncRequest('/url/image', ctx.key, {
					method: 'POST',
					body: parsedInput,
				})
			: await makeCloudlayerRequest<UrlToImageOutput>('/url/image', ctx.key, {
					method: 'POST',
					body: parsedInput,
				});

	const parsed = CloudlayerEndpointOutputSchemas['url.toImage'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.url.toImage',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/url-to-image/ — POST /v1/url/image (binary image)
export const urlToImageV1: CloudlayerEndpoints['url']['toImageV1'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['url.toImageV1'].parse(input);
	const response = await makeCloudlayerSyncRequest('/url/image', ctx.key, {
		method: 'POST',
		apiVersion: 'v1',
		body: parsedInput,
	});
	const parsed =
		CloudlayerEndpointOutputSchemas['url.toImageV1'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.url.toImageV1',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

// https://cloudlayer.io/docs/url-to-image/ — GET /v2/url/image (JSON job)
export const urlToImageQuick: CloudlayerEndpoints['url']['toImageQuick'] =
	async (ctx, input) => {
		const parsedInput =
			CloudlayerEndpointInputSchemas['url.toImageQuick'].parse(input);

		const response = await makeCloudlayerRequest<UrlToImageQuickOutput>(
			'/url/image',
			ctx.key,
			{
				method: 'GET',
				query: { url: parsedInput.url, timeout: parsedInput.timeout },
			},
		);

		const parsed =
			CloudlayerEndpointOutputSchemas['url.toImageQuick'].parse(response);

		await logEventFromContext(
			ctx,
			'cloudlayer.url.toImageQuick',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

// https://cloudlayer.io/docs/url-to-image/ — GET /v1/url/image (binary image)
export const urlToImageQuickV1: CloudlayerEndpoints['url']['toImageQuickV1'] =
	async (ctx, input) => {
		const parsedInput =
			CloudlayerEndpointInputSchemas['url.toImageQuickV1'].parse(input);
		const response = await makeCloudlayerSyncRequest('/url/image', ctx.key, {
			method: 'GET',
			apiVersion: 'v1',
			query: { url: parsedInput.url, timeout: parsedInput.timeout },
		});
		const parsed =
			CloudlayerEndpointOutputSchemas['url.toImageQuickV1'].parse(response);

		await logEventFromContext(
			ctx,
			'cloudlayer.url.toImageQuickV1',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};
