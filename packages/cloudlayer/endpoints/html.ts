import { logEventFromContext } from 'corsair/core';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest, makeCloudlayerSyncRequest } from '../client';
import type { HtmlToImageOutput, HtmlToPdfOutput } from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './types';

// https://cloudlayer.io/docs/html-to-pdf/ — POST /v2/html/pdf; async:false is JSON
export const htmlToPdf: CloudlayerEndpoints['html']['toPdf'] = async (
	ctx,
	input,
) => {
	const parsedInput = CloudlayerEndpointInputSchemas['html.toPdf'].parse(input);

	const response =
		parsedInput.async === false
			? await makeCloudlayerSyncRequest('/html/pdf', ctx.key, {
					method: 'POST',
					body: parsedInput,
				})
			: await makeCloudlayerRequest<HtmlToPdfOutput>('/html/pdf', ctx.key, {
					method: 'POST',
					body: parsedInput,
				});

	const parsed = CloudlayerEndpointOutputSchemas['html.toPdf'].parse(response);

	// One document per call. The HTML body is never logged: it can carry
	// customer data and is caller-owned content.
	await logEventFromContext(
		ctx,
		'cloudlayer.html.toPdf',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/html-to-pdf/ — POST /v1/html/pdf (binary PDF)
export const htmlToPdfV1: CloudlayerEndpoints['html']['toPdfV1'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['html.toPdfV1'].parse(input);

	const response = await makeCloudlayerSyncRequest('/html/pdf', ctx.key, {
		method: 'POST',
		apiVersion: 'v1',
		body: parsedInput,
	});
	const parsed =
		CloudlayerEndpointOutputSchemas['html.toPdfV1'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.html.toPdfV1',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

// https://cloudlayer.io/docs/html-to-image/ — POST /v2/html/image; async:false is JSON
export const htmlToImage: CloudlayerEndpoints['html']['toImage'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['html.toImage'].parse(input);

	const response =
		parsedInput.async === false
			? await makeCloudlayerSyncRequest('/html/image', ctx.key, {
					method: 'POST',
					body: parsedInput,
				})
			: await makeCloudlayerRequest<HtmlToImageOutput>('/html/image', ctx.key, {
					method: 'POST',
					body: parsedInput,
				});

	const parsed =
		CloudlayerEndpointOutputSchemas['html.toImage'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.html.toImage',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/html-to-image/ — POST /v1/html/image (binary image)
export const htmlToImageV1: CloudlayerEndpoints['html']['toImageV1'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['html.toImageV1'].parse(input);

	const response = await makeCloudlayerSyncRequest('/html/image', ctx.key, {
		method: 'POST',
		apiVersion: 'v1',
		body: parsedInput,
	});
	const parsed =
		CloudlayerEndpointOutputSchemas['html.toImageV1'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.html.toImageV1',
		{ count: 1 },
		'completed',
	);
	return parsed;
};
