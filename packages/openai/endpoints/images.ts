import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest, multipartOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	ImagesCreateEditResponse,
	ImagesCreateResponse,
	ImagesCreateVariationResponse,
} from '../schema/images';

export const create: OpenaiEndpoints['imagesCreate'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<ImagesCreateResponse>(
		'images/generations',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				prompt: input.prompt,
				n: input.n,
				size: input.size,
				quality: input.quality,
				style: input.style,
				response_format: input.responseFormat,
				background: input.background,
				user: input.user,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.images.create',
		{ model: input.model, prompt: input.prompt, n: input.n },
		'completed',
	);
	return result;
};

export const createEdit: OpenaiEndpoints['imagesCreateEdit'] = async (
	ctx,
	input,
) => {
	const files: Array<{ field: string; file: Blob | string; fileName: string }> =
		[{ field: 'image', file: input.image, fileName: input.imageFileName }];
	if (input.mask !== undefined && input.maskFileName !== undefined) {
		files.push({
			field: 'mask',
			file: input.mask,
			fileName: input.maskFileName,
		});
	}

	const result = await multipartOpenaiRequest<ImagesCreateEditResponse>(
		'images/edits',
		ctx.key,
		{
			files,
			fields: {
				prompt: input.prompt,
				model: input.model,
				n: input.n === undefined ? undefined : String(input.n),
				size: input.size,
				response_format: input.responseFormat,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.images.createEdit',
		{ prompt: input.prompt, model: input.model, n: input.n },
		'completed',
	);
	return result;
};

export const createVariation: OpenaiEndpoints['imagesCreateVariation'] = async (
	ctx,
	input,
) => {
	const result = await multipartOpenaiRequest<ImagesCreateVariationResponse>(
		'images/variations',
		ctx.key,
		{
			files: [
				{
					field: 'image',
					file: input.image,
					fileName: input.imageFileName,
				},
			],
			fields: {
				model: input.model,
				n: input.n === undefined ? undefined : String(input.n),
				size: input.size,
				response_format: input.responseFormat,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.images.createVariation',
		{ model: input.model, n: input.n },
		'completed',
	);
	return result;
};
