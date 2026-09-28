import { logEventFromContext } from 'corsair/core';
import type { ClaidAiEndpoints } from '..';
import { makeClaidAiRequest } from '../client';
import type { ClaidAiEndpointOutputs } from './types';

export const backgroundRemove: ClaidAiEndpoints['backgroundRemove'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['backgroundRemove']
	>('image/edit', ctx.key, {
		method: 'POST',
		body: input,
	});

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
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['imageEditBatch']
	>('image/edit/batch', ctx.key, {
		method: 'POST',
		body: input,
	});

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
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['licensePlateBlur']
	>('image/edit', ctx.key, {
		method: 'POST',
		body: {
			input: input.input,
			operations: {
				privacy: {
					blur_car_plate: true,
				},
			},
		},
	});

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
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['smartFrame']
	>('image/edit', ctx.key, {
		method: 'POST',
		body: {
			input: input.input,
			operations: input.options,
		},
	});

	await logEventFromContext(ctx, 'claidai.smart_frame', input, 'completed');
	return response;
};

export const createStorage: ClaidAiEndpoints['createStorage'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['createStorage']
	>('storage/storages', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(ctx, 'claidai.storage.create', input, 'completed');
	return response;
};

export const backgroundGenerate: ClaidAiEndpoints['backgroundGenerate'] =
	async (ctx, input) => {
		const response = await makeClaidAiRequest<
			ClaidAiEndpointOutputs['backgroundGenerate']
		>('scene/create', ctx.key, {
			method: 'POST',
			body: input,
		});

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
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['imageGenerate']
	>('image/generate', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(ctx, 'claidai.image.generate', input, 'completed');
	return response;
};

export const generativeResize: ClaidAiEndpoints['generativeResize'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['generativeResize']
	>('image/edit', ctx.key, {
		method: 'POST',
		body: {
			input: input.input,
			operations: input.operations,
		},
	});

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
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['storageDetails']
	>(`storage/storages/${input.storage_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'claidai.storage.details', input, 'completed');

	return response;
};

export const imageAiEdit: ClaidAiEndpoints['imageAiEdit'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['imageAiEdit']
	>('image/ai-edit', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(ctx, 'claidai.image.ai_edit', input, 'completed');

	return response;
};

export const storageList: ClaidAiEndpoints['storageList'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['storageList']
	>('storage/storages', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'claidai.storage.list', input, 'completed');

	return response;
};

export const polishImage: ClaidAiEndpoints['polishImage'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['polishImage']
	>('image/edit', ctx.key, {
		method: 'POST',
		body: {
			input: input.input,
			operations: {
				restorations: {
					polish: true,
				},
			},
		},
	});

	await logEventFromContext(ctx, 'claidai.polish_image', input, 'completed');

	return response;
};

export const patchStorage: ClaidAiEndpoints['patchStorage'] = async (
	ctx,
	input,
) => {
	const { storage_id, ...body } = input;

	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['patchStorage']
	>(`storage/storages/${storage_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(ctx, 'claidai.storage.patch', input, 'completed');

	return response;
};

export const storageTypes: ClaidAiEndpoints['storageTypes'] = async (
	ctx,
	input,
) => {
	const response = await makeClaidAiRequest<
		ClaidAiEndpointOutputs['storageTypes']
	>('storage/storage-types', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'claidai.storage.types', input, 'completed');

	return response;
};
