import { logEventFromContext } from 'corsair/core';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest, makeCloudlayerSyncRequest } from '../client';
import type { TemplateToImageOutput, TemplateToPdfOutput } from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './types';

// https://cloudlayer.io/docs/template-to-pdf/ — POST /v2/template/pdf; async:false is JSON
export const templateToPdf: CloudlayerEndpoints['template']['toPdf'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['template.toPdf'].parse(input);

	const response =
		parsedInput.template instanceof Blob
			? await makeCloudlayerRequest<TemplateToPdfOutput>(
					'/template/pdf',
					ctx.key,
					{
						method: 'POST',
						formData: {
							template: parsedInput.template,
							data: JSON.stringify(parsedInput.data),
						},
					},
				)
			: 'async' in parsedInput && parsedInput.async === false
				? await makeCloudlayerSyncRequest('/template/pdf', ctx.key, {
						method: 'POST',
						body: parsedInput,
					})
				: await makeCloudlayerRequest<TemplateToPdfOutput>(
						'/template/pdf',
						ctx.key,
						{ method: 'POST', body: parsedInput },
					);

	const parsed =
		CloudlayerEndpointOutputSchemas['template.toPdf'].parse(response);

	// Render data is caller-owned and can hold customer details, so only the
	// fact that one document was rendered is logged.
	await logEventFromContext(
		ctx,
		'cloudlayer.template.toPdf',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/template-to-pdf/ — POST /v1/template/pdf (binary PDF)
export const templateToPdfV1: CloudlayerEndpoints['template']['toPdfV1'] =
	async (ctx, input) => {
		const parsedInput =
			CloudlayerEndpointInputSchemas['template.toPdfV1'].parse(input);
		const response = await makeCloudlayerSyncRequest('/template/pdf', ctx.key, {
			method: 'POST',
			apiVersion: 'v1',
			body: parsedInput,
		});
		const parsed =
			CloudlayerEndpointOutputSchemas['template.toPdfV1'].parse(response);

		await logEventFromContext(
			ctx,
			'cloudlayer.template.toPdfV1',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

// https://cloudlayer.io/docs/template-to-image/ — POST /v2/template/image; async:false is JSON
export const templateToImage: CloudlayerEndpoints['template']['toImage'] =
	async (ctx, input) => {
		const parsedInput =
			CloudlayerEndpointInputSchemas['template.toImage'].parse(input);

		const response =
			parsedInput.template instanceof Blob
				? await makeCloudlayerRequest<TemplateToImageOutput>(
						'/template/image',
						ctx.key,
						{
							method: 'POST',
							formData: {
								template: parsedInput.template,
								data: JSON.stringify(parsedInput.data),
							},
						},
					)
				: 'async' in parsedInput && parsedInput.async === false
					? await makeCloudlayerSyncRequest('/template/image', ctx.key, {
							method: 'POST',
							body: parsedInput,
						})
					: await makeCloudlayerRequest<TemplateToImageOutput>(
							'/template/image',
							ctx.key,
							{ method: 'POST', body: parsedInput },
						);

		const parsed =
			CloudlayerEndpointOutputSchemas['template.toImage'].parse(response);

		// Template files and render data can contain customer content, so only the
		// fact that one image was rendered is logged.
		await logEventFromContext(
			ctx,
			'cloudlayer.template.toImage',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

// https://cloudlayer.io/docs/template-to-image/ — POST /v1/template/image (binary image)
export const templateToImageV1: CloudlayerEndpoints['template']['toImageV1'] =
	async (ctx, input) => {
		const parsedInput =
			CloudlayerEndpointInputSchemas['template.toImageV1'].parse(input);
		const response = await makeCloudlayerSyncRequest(
			'/template/image',
			ctx.key,
			{ method: 'POST', apiVersion: 'v1', body: parsedInput },
		);
		const parsed =
			CloudlayerEndpointOutputSchemas['template.toImageV1'].parse(response);

		await logEventFromContext(
			ctx,
			'cloudlayer.template.toImageV1',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};
