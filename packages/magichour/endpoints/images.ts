import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

// Each operation creates an asynchronous image project: it returns the new
// project id immediately and the caller polls `GET /v1/image-projects/{id}`
// for status and downloads. Events log the id only, never the prompt or the
// input file paths.

export const clothesChanger: MagicHourEndpoints['imagesClothesChanger'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.imagesClothesChanger.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['imagesClothesChanger']
		>('/v1/ai-clothes-changer', ctx.key, { method: 'POST', body: parsedInput });

		const parsed =
			MagicHourEndpointOutputSchemas.imagesClothesChanger.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.images.clothesChanger',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const faceEditor: MagicHourEndpoints['imagesFaceEditor'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imagesFaceEditor.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesFaceEditor']
	>('/v1/ai-face-editor', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.imagesFaceEditor.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.faceEditor',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const gifGenerator: MagicHourEndpoints['imagesGifGenerator'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imagesGifGenerator.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesGifGenerator']
	>('/v1/ai-gif-generator', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.imagesGifGenerator.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.gifGenerator',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const headshotGenerator: MagicHourEndpoints['imagesHeadshotGenerator'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.imagesHeadshotGenerator.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['imagesHeadshotGenerator']
		>('/v1/ai-headshot-generator', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});

		const parsed =
			MagicHourEndpointOutputSchemas.imagesHeadshotGenerator.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.images.headshotGenerator',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const imageEditor: MagicHourEndpoints['imagesImageEditor'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imagesImageEditor.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesImageEditor']
	>('/v1/ai-image-editor', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.imagesImageEditor.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.imageEditor',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const imageGenerator: MagicHourEndpoints['imagesImageGenerator'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.imagesImageGenerator.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['imagesImageGenerator']
		>('/v1/ai-image-generator', ctx.key, { method: 'POST', body: parsedInput });

		const parsed =
			MagicHourEndpointOutputSchemas.imagesImageGenerator.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.images.imageGenerator',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const imageUpscaler: MagicHourEndpoints['imagesImageUpscaler'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imagesImageUpscaler.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesImageUpscaler']
	>('/v1/ai-image-upscaler', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.imagesImageUpscaler.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.imageUpscaler',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const memeGenerator: MagicHourEndpoints['imagesMemeGenerator'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imagesMemeGenerator.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesMemeGenerator']
	>('/v1/ai-meme-generator', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.imagesMemeGenerator.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.memeGenerator',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const qrCodeGenerator: MagicHourEndpoints['imagesQrCodeGenerator'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.imagesQrCodeGenerator.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['imagesQrCodeGenerator']
		>('/v1/ai-qr-code-generator', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});

		const parsed =
			MagicHourEndpointOutputSchemas.imagesQrCodeGenerator.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.images.qrCodeGenerator',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const bodySwap: MagicHourEndpoints['imagesBodySwap'] = async (
	ctx,
	input,
) => {
	const parsedInput = MagicHourEndpointInputSchemas.imagesBodySwap.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesBodySwap']
	>('/v1/body-swap', ctx.key, { method: 'POST', body: parsedInput });

	const parsed = MagicHourEndpointOutputSchemas.imagesBodySwap.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.bodySwap',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const faceSwapPhoto: MagicHourEndpoints['imagesFaceSwapPhoto'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imagesFaceSwapPhoto.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesFaceSwapPhoto']
	>('/v1/face-swap-photo', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.imagesFaceSwapPhoto.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.faceSwapPhoto',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const headSwap: MagicHourEndpoints['imagesHeadSwap'] = async (
	ctx,
	input,
) => {
	const parsedInput = MagicHourEndpointInputSchemas.imagesHeadSwap.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imagesHeadSwap']
	>('/v1/head-swap', ctx.key, { method: 'POST', body: parsedInput });

	const parsed = MagicHourEndpointOutputSchemas.imagesHeadSwap.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.images.headSwap',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const backgroundRemover: MagicHourEndpoints['imagesBackgroundRemover'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.imagesBackgroundRemover.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['imagesBackgroundRemover']
		>('/v1/image-background-remover', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});

		const parsed =
			MagicHourEndpointOutputSchemas.imagesBackgroundRemover.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.images.backgroundRemover',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const photoColorizer: MagicHourEndpoints['imagesPhotoColorizer'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.imagesPhotoColorizer.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['imagesPhotoColorizer']
		>('/v1/photo-colorizer', ctx.key, { method: 'POST', body: parsedInput });

		const parsed =
			MagicHourEndpointOutputSchemas.imagesPhotoColorizer.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.images.photoColorizer',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};
