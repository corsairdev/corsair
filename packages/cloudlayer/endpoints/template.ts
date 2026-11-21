import { logEventFromContext } from 'corsair/core';
import { resolveFileInput } from 'corsair/http';
import { z } from 'zod';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest, makeCloudlayerSyncRequest } from '../client';
import type { TemplateToImageOutput, TemplateToPdfOutput } from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
	TemplateMultipartInputSchema,
} from './types';

/**
 * Most bytes taken from a link, base64 or a data: URL: core's download default,
 * passed explicitly so inline base64 is held to it too (core caps it only when asked).
 */
const FILE_MAX_BYTES = 25 * 1024 * 1024;

const InlineTemplateSchema = z.base64();

/**
 * The multipart form parts when the call uploads a template file, or undefined
 * for the JSON form. A bare base64 string is the JSON body's inline template,
 * which the input union matches first, so it stays JSON here too. A link or
 * base64 object is fetched or decoded into a file; a Blob is sent as given.
 */
async function templateUploadForm(
	input: unknown,
): Promise<{ template: Blob; data: string } | undefined> {
	const upload = TemplateMultipartInputSchema.safeParse(input);
	if (!upload.success) return undefined;
	const { template, data } = upload.data;
	if (
		typeof template === 'string' &&
		InlineTemplateSchema.safeParse(template).success
	) {
		return undefined;
	}
	// cloudlayer.io documents no size limit for an uploaded template, so a link
	// is held to core's default download cap.
	const file =
		template instanceof Blob
			? template
			: (
					await resolveFileInput(template, {
						maxBytes: FILE_MAX_BYTES,
						fallbackName: 'template.html',
					})
				).file;
	return { template: file, data: JSON.stringify(data) };
}

// https://cloudlayer.io/docs/template-to-pdf/ — POST /v2/template/pdf; async:false is JSON
export const templateToPdf: CloudlayerEndpoints['template']['toPdf'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['template.toPdf'].parse(input);
	const formData = await templateUploadForm(parsedInput);

	const response =
		formData !== undefined
			? await makeCloudlayerRequest<TemplateToPdfOutput>(
					'/template/pdf',
					ctx.key,
					{ method: 'POST', formData },
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
		const formData = await templateUploadForm(parsedInput);

		const response =
			formData !== undefined
				? await makeCloudlayerRequest<TemplateToImageOutput>(
						'/template/image',
						ctx.key,
						{ method: 'POST', formData },
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
