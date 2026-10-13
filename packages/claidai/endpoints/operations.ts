import { logEventFromContext } from 'corsair/core';
import type { ClaidAiEndpoints } from '..';
import { makeClaidAiRequest } from '../client';
import {
	deleteStorageRow,
	saveEditedImages,
	saveGeneratedImages,
	saveImageTask,
	saveStorages,
	saveStorageTypes,
} from './persist';
import { ClaidAiEndpointOutputSchemas as Out } from './types';

export const backgroundRemove: ClaidAiEndpoints['backgroundRemove'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/edit',
		ctx.key,
		Out.backgroundRemove,
		{
			method: 'POST',
			body: {
				input: input.input,
				operations: {
					background: { remove: true, color: input.color },
				},
				output: input.output,
			},
		},
	);
	await saveEditedImages(ctx, response);
	await logEventFromContext(
		ctx,
		'claidai.background.remove',
		input,
		'completed',
	);
	return response;
};

export const imageEditBatch: ClaidAiEndpoints['imageEditBatch'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/edit/batch',
		ctx.key,
		Out.imageEditBatch,
		{ method: 'POST', body: input },
	);
	await saveImageTask(ctx, response);
	await logEventFromContext(
		ctx,
		'claidai.image_edit.batch',
		input,
		'completed',
	);
	return response;
};

export const licensePlateBlur: ClaidAiEndpoints['licensePlateBlur'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/edit',
		ctx.key,
		Out.licensePlateBlur,
		{
			method: 'POST',
			body: {
				input: input.input,
				operations: { privacy: { blur_car_plate: true } },
				output: input.output,
			},
		},
	);
	await saveEditedImages(ctx, response);
	await logEventFromContext(
		ctx,
		'claidai.license_plate.blur',
		input,
		'completed',
	);
	return response;
};

export const smartFrame: ClaidAiEndpoints['smartFrame'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/edit',
		ctx.key,
		Out.smartFrame,
		{
			method: 'POST',
			body: {
				input: input.input,
				operations: {
					resizing: { width: input.width, height: input.height, fit: 'canvas' },
					padding: input.padding,
					background: input.background_color
						? { color: input.background_color }
						: undefined,
				},
				output: input.output,
			},
		},
	);
	await saveEditedImages(ctx, response);
	await logEventFromContext(ctx, 'claidai.smart_frame', input, 'completed');
	return response;
};

export const createStorage: ClaidAiEndpoints['createStorage'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'storage/storages',
		ctx.key,
		Out.createStorage,
		{ method: 'POST', body: input },
	);
	await saveStorages(ctx, [response.data]);
	await logEventFromContext(
		ctx,
		'claidai.storage.create',
		{ name: input.name, type: input.type },
		'completed',
	);
	return response;
};

export const backgroundGenerate: ClaidAiEndpoints['backgroundGenerate'] =
	async (ctx, input) => {
		const response = await makeClaidAiRequest(
			'scene/create',
			ctx.key,
			Out.backgroundGenerate,
			{ method: 'POST', body: input },
		);
		await saveGeneratedImages(ctx, response);
		await logEventFromContext(
			ctx,
			'claidai.background.generate',
			input,
			'completed',
		);
		return response;
	};

export const imageGenerate: ClaidAiEndpoints['imageGenerate'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/generate',
		ctx.key,
		Out.imageGenerate,
		{ method: 'POST', body: input },
	);
	await saveGeneratedImages(ctx, response);
	await logEventFromContext(ctx, 'claidai.image.generate', input, 'completed');
	return response;
};

export const generativeResize: ClaidAiEndpoints['generativeResize'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/edit',
		ctx.key,
		Out.generativeResize,
		{
			method: 'POST',
			body: {
				input: input.input,
				operations: {
					resizing: {
						width: input.width,
						height: input.height,
						fit: input.feathering
							? { type: 'outpaint', feathering: input.feathering }
							: 'outpaint',
					},
				},
				output: input.output,
			},
		},
	);
	await saveEditedImages(ctx, response);
	await logEventFromContext(
		ctx,
		'claidai.generative_resize',
		input,
		'completed',
	);
	return response;
};

export const storageDetails: ClaidAiEndpoints['storageDetails'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		`storage/storages/${input.storage_id}`,
		ctx.key,
		Out.storageDetails,
	);
	await saveStorages(ctx, [response.data]);
	await logEventFromContext(ctx, 'claidai.storage.details', input, 'completed');
	return response;
};

export const deleteStorage: ClaidAiEndpoints['deleteStorage'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		`storage/storages/${input.storage_id}`,
		ctx.key,
		Out.deleteStorage,
		{ method: 'DELETE' },
	);
	await deleteStorageRow(ctx, input.storage_id);
	await logEventFromContext(ctx, 'claidai.storage.delete', input, 'completed');
	return response;
};

export const imageAiEdit: ClaidAiEndpoints['imageAiEdit'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/ai-edit',
		ctx.key,
		Out.imageAiEdit,
		{ method: 'POST', body: input },
	);
	await saveImageTask(ctx, response);
	await logEventFromContext(ctx, 'claidai.image.ai_edit', input, 'completed');
	return response;
};

export const storageList: ClaidAiEndpoints['storageList'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'storage/storages',
		ctx.key,
		Out.storageList,
	);
	await saveStorages(ctx, response.data);
	await logEventFromContext(ctx, 'claidai.storage.list', input, 'completed');
	return response;
};

export const polishImage: ClaidAiEndpoints['polishImage'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'image/edit',
		ctx.key,
		Out.polishImage,
		{
			method: 'POST',
			body: {
				input: input.input,
				operations: { restorations: { polish: true } },
				output: input.output,
			},
		},
	);
	await saveEditedImages(ctx, response);
	await logEventFromContext(ctx, 'claidai.polish_image', input, 'completed');
	return response;
};

export const patchStorage: ClaidAiEndpoints['patchStorage'] = async (
	ctx,
	input,
) => {
	const { storage_id, ...body } = input;
	const response = await makeClaidAiRequest(
		`storage/storages/${storage_id}`,
		ctx.key,
		Out.patchStorage,
		{ method: 'PATCH', body },
	);
	await saveStorages(ctx, [response.data]);
	await logEventFromContext(
		ctx,
		'claidai.storage.patch',
		{ storage_id, name: input.name, type: input.type },
		'completed',
	);
	return response;
};

export const storageTypes: ClaidAiEndpoints['storageTypes'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest(
		'storage/storage-types',
		ctx.key,
		Out.storageTypes,
	);
	await saveStorageTypes(ctx, response.data);
	await logEventFromContext(ctx, 'claidai.storage.types', input, 'completed');
	return response;
};
