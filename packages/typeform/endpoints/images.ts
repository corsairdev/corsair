import { logEventFromContext } from 'corsair/core';
import type { TypeformEndpoints } from '..';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const list: TypeformEndpoints['imagesList'] = async (ctx, _input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['imagesList']
	>('/images', ctx.key);

	// GET /images returns a raw array
	if (ctx.db.images) {
		for (const image of response) {
			const id = image.id;
			if (id) {
				try {
					// id narrowed to string; spread + override to satisfy DB entity requirement
					await ctx.db.images.upsertByEntityId(id, { ...image, id });
				} catch (error) {
					console.warn('Failed to save image to database:', error);
				}
			}
		}
	}

	await logEventFromContext(ctx, 'typeform.images.list', {}, 'completed');

	return response;
};

export const create: TypeformEndpoints['imagesCreate'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['imagesCreate']
	>('/images', ctx.key, {
		method: 'POST',
		body: {
			file_name: input.file_name,
			url: input.url,
			image: input.image,
		},
	});

	const id = response.id;
	if (id && ctx.db.images) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.images.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save image to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.images.create',
		{ file_name: input.file_name },
		'completed',
	);

	return response;
};

export const deleteImage: TypeformEndpoints['imagesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['imagesDelete']
	>(`/images/${input.image_id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.images) {
		try {
			await ctx.db.images.deleteByEntityId(input.image_id);
		} catch (error) {
			console.warn('Failed to delete image from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.images.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const getBySize: TypeformEndpoints['imagesGetBySize'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['imagesGetBySize']
	>(`/images/${input.image_id}/${input.size}`, ctx.key);

	const id = response.id;
	if (id && ctx.db.images) {
		try {
			await ctx.db.images.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save image to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.images.getBySize',
		{ ...input },
		'completed',
	);

	return response;
};

export const getBackgroundBySize: TypeformEndpoints['imagesGetBackgroundBySize'] =
	async (ctx, input) => {
		const response = await makeTypeformRequest<
			TypeformEndpointOutputs['imagesGetBackgroundBySize']
		>(`/images/${input.image_id}/background/${input.size}`, ctx.key);

		const id = response.id;
		if (id && ctx.db.images) {
			try {
				await ctx.db.images.upsertByEntityId(id, { ...response, id });
			} catch (error) {
				console.warn('Failed to save image to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'typeform.images.getBackgroundBySize',
			{ ...input },
			'completed',
		);

		return response;
	};

export const getChoiceImageBySize: TypeformEndpoints['imagesGetChoiceImageBySize'] =
	async (ctx, input) => {
		const response = await makeTypeformRequest<
			TypeformEndpointOutputs['imagesGetChoiceImageBySize']
		>(`/images/${input.image_id}/choice/${input.size}`, ctx.key);

		const id = response.id;
		if (id && ctx.db.images) {
			try {
				await ctx.db.images.upsertByEntityId(id, { ...response, id });
			} catch (error) {
				console.warn('Failed to save image to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'typeform.images.getChoiceImageBySize',
			{ ...input },
			'completed',
		);

		return response;
	};
